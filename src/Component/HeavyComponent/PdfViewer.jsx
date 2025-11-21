"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PdfViewer({ fileUrl }) {
    if (!fileUrl) return null;

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: (Toolbar) => (
            <Toolbar>
                {(slots) => {
                    const {
                        CurrentPageInput,
                        ZoomOut,
                        ZoomIn,
                        ZoomPopover,
                    } = slots;

                    return (
                        <div style={{ display: "flex", gap: "10px", padding: "8px" }}>
                            <CurrentPageInput />
                            <ZoomOut />
                            <ZoomIn />
                            <ZoomPopover />
                        </div>
                    );
                }}
            </Toolbar>
        ),
    });

    return (
        <div style={{ height: "90vh" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
        </div>
    );
}
