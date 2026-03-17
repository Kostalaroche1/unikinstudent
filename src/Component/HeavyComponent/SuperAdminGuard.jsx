// components/SuperAdminGuard.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation"; // or next/router if pages router
import { Spinner } from "react-bootstrap";
import { useUserContext } from "../ContextComponent/UserAuth";

export default function SuperAdminGuard({ children }) {
    const { user } = useUserContext();
    const loading = user === null;
    const router = useRouter();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (!user || user.role !== "superadmin") {
        // redirect to home (client-side)
        if (typeof window !== "undefined") router.push("/");
        return null;
    }

    return <>{children}</>;
}
