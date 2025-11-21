

import { NextResponse } from "next/server";
import { connectionDatabase } from "../../../../lib/database";

// GET — ALL or ONE
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const [rows] = await connectionDatabase.execute(
                "SELECT * FROM history WHERE id_purchase = ?",
                [id]
            );
            return NextResponse.json(rows[0] || null);
        }

        const [rows] = await connectionDatabase.execute(
            "SELECT * FROM history ORDER BY createdAt DESC"
        );

        return NextResponse.json(rows);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — CREATE
export async function POST(req) {
    try {
        const { userId, bookId } = await req.json();

        const [result] = await connectionDatabase.execute(
            "INSERT INTO history (userId, bookId) VALUES (?, ?)",
            [userId, bookId]
        );

        return NextResponse.json({ insertedId: result.insertId });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT — UPDATE
export async function PUT(req) {
    try {
        const { id, userId, bookId } = await req.json();

        const [result] = await connectionDatabase.execute(
            "UPDATE history SET userId = ?, bookId = ? WHERE id_purchase = ?",
            [userId, bookId, id]
        );

        return NextResponse.json({ updated: result.affectedRows > 0 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — REMOVE
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const [result] = await connectionDatabase.execute(
            "DELETE FROM history WHERE id_purchase = ?",
            [id]
        );

        return NextResponse.json({ deleted: result.affectedRows > 0 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
