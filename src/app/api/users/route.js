// /app/api/users/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectionDatabase } from "../../../../lib/database";
import { verifySessionAuthToken } from "../email/route";

// Helper: get current logged user (from cookie)
async function getCurrentUser() {
    return await verifySessionAuthToken(
        process.env.JWT_SECRET_KEY_AUTH,
        "authToken"
    );
}

/* 
   GET USERS
   - superadmin → returns all
   - admin/user → returns own account only
 */
export async function GET() {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser)
        return NextResponse.json({ error: "Unauthorized", status: 401 });

    if (currentUser.role === "superadmin") {
        const [rows] = await db.execute("SELECT * FROM users");
        return NextResponse.json(rows);
    }

    // admin & user → only their profile
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE id_user = ?",
        [currentUser.id]
    );

    return NextResponse.json(rows[0]);
}

/*
   CREATE USER (superadmin only)
 */
export async function POST(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { name, email, password, role } = await req.json();

    await db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role ?? "user"]
    );

    return NextResponse.json({ message: "User created" });
}

/* ============================
   UPDATE USER (superadmin only)
============================ */
export async function PUT(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_user, name, email, role } = await req.json();

    await db.execute(
        `UPDATE users 
         SET name = ?, email = ?, role = ?
         WHERE id_user = ?`,
        [name, email, role, id_user]
    );

    return NextResponse.json({ message: "User updated" });
}

/* ============================
   DELETE USER (superadmin only)
============================ */
export async function DELETE(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_user } = await req.json();

    await db.execute("DELETE FROM users WHERE id_user = ?", [id_user]);

    return NextResponse.json({ message: "User deleted" });
}
