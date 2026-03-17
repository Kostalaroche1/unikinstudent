import { NextResponse } from "next/server"

// DELETE COOKIE
export async function DELETE() {
    return deleteCookie("authToken");
}

export function deleteCookie(cookieName) {
    try {
        const response = NextResponse.json({ status: true, message: "Deconnexion effectuee" });
        response.cookies.set(cookieName, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0),
            path: "/",
        });
        return response
    } catch (error) {
        return NextResponse.json({ status: false, message: "un probleme de deconnexion reesayer" })
    }
}
