import { NextResponse } from "next/server";
import { connectionDatabase } from "../../../../lib/database";

// GET ALL or GET ONE
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id"); // optional

        if (id) {
            const [rows] = await connectionDatabase.execute(
                "SELECT * FROM subscription WHERE id_sub = ?",
                [id]
            );
            return NextResponse.json(rows[0] || null);
        }

        const [rows] = await connectionDatabase.execute(
            "SELECT * FROM subscription"
        );
        return NextResponse.json(rows);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// CREATE SUBSCRIPTION
export async function POST(req) {
    try {
        const { userId, expiredDate } = await req.json();
        console.log(userId, "userIde and ", expiredDate, "ExpireDate")
        const [result] = await connectionDatabase.execute(
            "INSERT INTO subscription (userId, expiresAt) VALUES (?, ?)",
            [userId, expiredDate]
        );

        return NextResponse.json({
            // insertedId: result.insertId
            status: true
        });

    } catch (error) {
        console.log(error, "error")
        return NextResponse.json({ error: error.message, status: false });
    }
}

// UPDATE SUBSCRIPTION
export async function PUT(req) {
    try {
        const { id_sub, userId, expiresAt } = await req.json();
        const [result] = await connectionDatabase.execute(
            `UPDATE subscription
       SET userId = ?, expiresAt = ?
       WHERE id_sub = ?`,
            [userId, expiresAt, id_sub]
        );

        return NextResponse.json({ updated: result.affectedRows > 0 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE SUBSCRIPTION
export async function DELETE(req) {
    try {
        const { id_sub } = await req.json();

        const [result] = await connectionDatabase.execute(
            "DELETE FROM subscription WHERE id_sub = ?",
            [id_sub]
        );

        return NextResponse.json({ deleted: result.affectedRows > 0 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
