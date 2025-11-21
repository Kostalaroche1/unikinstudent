// "use client";
// import { useEffect, useState } from "react";

// export default function NetworkStatus() {
//     const [online, setOnline] = useState(true);

//     useEffect(() => {
//         // Initial check
//         setOnline(navigator.onLine);

//         // Detect going offline
//         const handleOffline = () => setOnline(false);

//         // Detect coming back online
//         const handleOnline = () => setOnline(true);

//         window.addEventListener("offline", handleOffline);
//         window.addEventListener("online", handleOnline);

//         return () => {
//             window.removeEventListener("offline", handleOffline);
//             window.removeEventListener("online", handleOnline);
//         };
//     }, []);

//     if (online) return null;

//     return (
//         <div style={{
//             background: "red",
//             color: "white",
//             padding: "10px",
//             textAlign: "center",
//             position: "fixed",
//             top: 0,
//             width: "100%",
//             zIndex: 9999
//         }}>
//             ⚠️ No internet connection. Please connect to continue.
//         </div>
//     );
// }


"use client";
import { useEffect, useState } from "react";

export default function NetworkStatus() {
    const [online, setOnline] = useState(true);

    useEffect(() => {
        setOnline(navigator.onLine);

        const goOffline = () => setOnline(false);
        const goOnline = () => setOnline(true);

        window.addEventListener("offline", goOffline);
        window.addEventListener("online", goOnline);

        return () => {
            window.removeEventListener("offline", goOffline);
            window.removeEventListener("online", goOnline);
        };
    }, []);

    if (online) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px 30px",
                    borderRadius: "10px",
                    textAlign: "center",
                    maxWidth: "300px",
                    width: "80%"
                }}
            >
                <h2 style={{ marginBottom: "10px" }}>⚠️ No Internet</h2>
                <p>Please check your connection to continue.</p>
            </div>
        </div>
    );
}
