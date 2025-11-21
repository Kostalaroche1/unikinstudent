"use client";

import PdfViewer from "./PdfViewer";

export default function PdfModal({ fileUrl, show, onClose }) {
    if (!show || !fileUrl) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
        }}>
            <div style={{
                width: "90%",
                height: "90%",
                position: "relative",
                background: "#fff",
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    Close
                </button>

                <PdfViewer fileUrl={fileUrl} />
            </div>
        </div>
    );
}
