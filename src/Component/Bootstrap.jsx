"use client"
import React, { useEffect } from 'react'

function BootstrapInstallation() {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle")
    }, [])
    return (<></>)
}
export default BootstrapInstallation