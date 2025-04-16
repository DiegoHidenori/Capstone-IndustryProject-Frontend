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

            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "auto");
            svg.style.maxWidth = "900px";
            svg.style.display = "block";
            svg.style.margin = "0 auto";

            const roomGroups = svg.querySelectorAll("g[data-room-id]");

            roomGroups.forEach((group) => {
                const roomId = parseInt(group.getAttribute("data-room-id"));
                const isSelected = selectedRooms.includes(roomId);

                group.classList.add("room-shape");

                group
                    .querySelectorAll("rect, path, polygon, circle, ellipse")
                    .forEach((shape) => {
                        shape.setAttribute(
                            "fill",
                            isSelected ? "#28a745" : "#78b0a0"
                        );
                        shape.removeAttribute("stroke");
                        shape.removeAttribute("stroke-width");
                    });

                group.addEventListener("click", () => onRoomClick(roomId));
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
