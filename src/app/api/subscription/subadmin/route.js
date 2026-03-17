// /app/api/subscriptions/route.js
import { NextResponse } from "next/server";
import { connectionDatabase } from "../../../../../lib/database";
import { verifySessionAuthToken } from "../../email/route";

async function getCurrentUser() {
    return await verifySessionAuthToken(
        process.env.JWT_SECRET_KEY_AUTH,
        "authToken"
    );
}

/* ============================
   GET SUBSCRIPTIONS
============================ */
export async function GET() {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (currentUser.role === "superadmin") {
        const [rows] = await db.execute(
            "SELECT * FROM subscription"
        );
        return NextResponse.json(rows);
    }

    // admin or user → only their own subscription
    const [rows] = await db.execute(
        "SELECT * FROM subscription WHERE id_user = ?",
        [currentUser.id]
    );

    return NextResponse.json(rows[0] || null);
}

/*
   CREATE SUBSCRIPTION (superadmin only) */
export async function POST(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_user, expiresAt } = await req.json();

    await db.execute(
        "INSERT INTO subscription (id_user, expiresAt) VALUES (?, ?)",
        [id_user, expiresAt]
    );

    return NextResponse.json({ message: "Subscription created" });
}

/* UPDATE SUBSCRIPTION (superadmin only) */
export async function PUT(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_sub, expiresAt } = await req.json();

    await db.execute(
        "UPDATE subscription SET expiresAt = ? WHERE id_sub = ?",
        [expiresAt, id_sub]
    );

    return NextResponse.json({ message: "Subscription updated" });
}

/*
   DELETE SUBSCRIPTION (superadmin only)*/
export async function DELETE(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_sub } = await req.json();

    await db.execute("DELETE FROM subscription WHERE id_sub = ?", [id_sub]);

    return NextResponse.json({ message: "Subscription deleted" });
}
