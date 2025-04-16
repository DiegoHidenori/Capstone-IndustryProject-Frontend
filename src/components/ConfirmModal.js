import React from "react";
import "../styles/ConfirmModal.css";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">
                        Yes
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
