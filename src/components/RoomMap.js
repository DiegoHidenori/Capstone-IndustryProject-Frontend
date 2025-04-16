import React, { useEffect, useRef } from "react";
import "../styles/RoomMap.css";

export default function RoomMap({ selectedRooms, onRoomClick }) {
    const containerRef = useRef();

    useEffect(() => {
        const loadSvg = async () => {
            const response = await fetch("/layout.svg");
            const svgText = await response.text();
            containerRef.current.innerHTML = svgText;

            const svg = containerRef.current.querySelector("svg");
            if (!svg) return;

            // const roomElements = svg.querySelectorAll("[data-room-id]");
            const roomGroups = svg.querySelectorAll("g[data-room-id]");

            roomGroups.forEach((group) => {
                const roomId = parseInt(group.getAttribute("data-room-id"));
                const isSelected = selectedRooms.includes(roomId);

                group.classList.add("room-shape");

                group
                    .querySelectorAll("rect, path, polygon, circle")
                    .forEach((shape) => {
                        shape.setAttribute(
                            "fill",
                            isSelected ? "#28a745" : "#78b0a0"
                        );
                    });

                group.addEventListener("click", () => onRoomClick(roomId));
                // // Apply fill color and class based on selection
                // el.setAttribute("fill", isSelected ? "#28a745" : "#78b0a0");
                // el.classList.toggle("selected", isSelected);

                // // Handle room clicks
                // el.addEventListener("click", () => {
                //     onRoomClick(parsedId);
                // });
            });
        };

        loadSvg();
    }, [selectedRooms, onRoomClick]);

    return (
        <div className="room-map-container">
            <h3>Click a room to select/deselect:</h3>
            <div ref={containerRef}></div>
        </div>
    );
}
