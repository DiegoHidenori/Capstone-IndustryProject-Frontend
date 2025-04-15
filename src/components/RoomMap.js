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

            const roomElements = svg.querySelectorAll("[data-room-id]");

            roomElements.forEach((el) => {
                const roomId = el.getAttribute("data-room-id");

                el.classList.add("room-shape");

                const isSelected = selectedRooms.includes(parseInt(roomId));
                el.setAttribute("fill", isSelected ? "#28a745" : "#78b0a0");

                // Call handler with string ID
                el.addEventListener("click", () => {
                    onRoomClick(parseInt(roomId));
                });
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
