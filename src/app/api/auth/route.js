import { NextResponse } from "next/server"

//DELETE COOKIE
export const DELETE = async (req) => {
    const response = NextResponse.json({ status: true, message: "Déconnexion effectuée" })
    if (deleteCookie(process.env.JWT_SECRET_KEY_AUTH)) {
        return response
    } else {
        return NextResponse.json({ status: false, message: "un probleme de deconnexion reesayer" })
    }
}

export const deleteCookie = (token) => {
    try {
        cookieStore.set(token, "", { maxAge: -1, path: "/" })
        //
        return true
    } catch (error) {
        return false
    }
}