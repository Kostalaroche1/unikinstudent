"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PdfViewer({ fileUrl }) {
    if (!fileUrl) return null;

    // No custom toolbar override in v3.12.0
    const layoutPlugin = defaultLayoutPlugin();

    return (
        <div style={{ height: "90vh" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} plugins={[layoutPlugin]} />
            </Worker>
        </div>
    );
}
