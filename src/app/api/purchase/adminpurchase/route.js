// /app/api/purchase/route.js
import { NextResponse } from "next/server";
import { connectionDatabase } from "../../../../../lib/database";
import { verifySessionAuthToken } from "../../email/route";

// helper to get current user from JWT cookie
async function getCurrentUser() {
    return await verifySessionAuthToken(
        process.env.JWT_SECRET_KEY_AUTH,
        "authToken"
    );
}

/*GET PURCHASES*/
export async function GET() {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (currentUser.role === "superadmin") {
        const [rows] = await db.execute("SELECT * FROM purchase ORDER BY id_purchase DESC");
        return NextResponse.json(rows);
    }

    // admin or user → only their own purchases
    const [rows] = await db.execute(
        "SELECT * FROM purchase WHERE id_user = ? ORDER BY id_purchase DESC",
        [currentUser.id]
    );
    return NextResponse.json(rows);
}

/*CREATE PURCHASE*/
export async function POST(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id_book } = await req.json();
    if (!id_book)
        return NextResponse.json({ error: "id_book is required" }, { status: 400 });

    const [result] = await db.execute(
        "INSERT INTO purchase (id_user, id_book) VALUES (?, ?)",
        [currentUser.id, id_book]
    );

    return NextResponse.json({ ok: true, id_purchase: result.insertId });
}

/* UPDATE PURCHASE (superadmin only) */
export async function PUT(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_purchase, id_book, id_user } = await req.json();

    if (!id_purchase || !id_book || !id_user)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await db.execute(
        "UPDATE purchase SET id_book = ?, id_user = ? WHERE id_purchase = ?",
        [id_book, id_user, id_purchase]
    );

    return NextResponse.json({ ok: true });
}

/* DELETE PURCHASE (superadmin only) */
export async function DELETE(req) {
    const db = await connectionDatabase();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "superadmin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id_purchase } = await req.json();
    if (!id_purchase)
        return NextResponse.json({ error: "Missing id_purchase" }, { status: 400 });

    await db.execute("DELETE FROM purchase WHERE id_purchase = ?", [id_purchase]);
    return NextResponse.json({ ok: true });
}
