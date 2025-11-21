import { NextResponse } from 'next/server';
import { connectionDatabase } from "../../../../lib/database";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const db = await connectionDatabase();
        const [rows] = await db.query('SELECT * FROM books ORDER BY id_book DESC');
        return NextResponse.json({ books: rows });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: false });
    }
}

export async function POST(req) {
    try {

        let pdf_url = null;
        let public_id = null;

        const form = await req.formData();
        const title = form.get("title");
        const description = form.get("description");
        const price = form.get("price")
        const author = form.get("author")
        const file = form.get("file");
        const idUser = 1


        if (!file) {
            return Response.json({ error: "PDF required" }, { status: 400 });
        }

        // Convert file → buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload PDF
        const uploaded = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: process.env.CLOUDINARY_PDF_FOLDER || "books-pdf",
                    access_mode: "public",
                    format: "pdf",
                    filename_override: file.name,   // ⬅️ IMPORTANT
                    use_filename: true,

                },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // If upload failed
        if (!uploaded?.secure_url) {
            return Response.json({ error: "Failed to upload PDF" }, { status: 500 });
        }
        pdf_url = uploaded.secure_url
        public_id = uploaded.public_id

        console.log(
            pdf_url, 'pdf_url', "public_id", public_id,
            "files", file, "formdata", form, "author", author, "price", price, "buffer",
            "upload", uploaded
        )

        // Save in DB ONLY after successful upload
        const db = await connectionDatabase();
        const [resInsert] = await db.execute(
            "INSERT INTO books (title, description,price,author, pdf_url, public_id,id_user) VALUES (?, ?, ?, ?,?,?,?)",
            [title, description, price, author, pdf_url, public_id, idUser]
        );

        // return Response.json({ success: true });


        return NextResponse.json(
            { id: resInsert.insertId, title, description, pdf_url, public_id, idUser, author, price },
            { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id')

        const form = await req.formData();
        const title = form.get('title');
        const description = form.get('description');
        const file = form.get('file');
        const author = form.get('author')
        const price = form.get("price");
        console.log("form", form, "id = ", id, "price", price, "author", author)

        const db = await connectionDatabase();
        const [rows] = await db.query('SELECT * FROM books WHERE id_book = ?', [id]);
        const book = rows[0];
        if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        let pdf_url = book.pdf_url;
        let public_id = book.public_id;

        if (file) {
            // delete old file on Cloudinary if exists
            if (public_id) await cloudinary.uploader.destroy(public_id, {
                resource_type: 'raw',
                folder: "books-pdf",
                access_mode: "public",
                format: "pdf",
                filename_override: file.name,   // ⬅️ IMPORTANT
                use_filename: true,
            });

            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    resource_type: 'raw',
                    folder: "books-pdf",
                    access_mode: "public",
                    format: "pdf",
                    filename_override: file.name,   // ⬅️ IMPORTANT
                    use_filename: true,
                    folder: process.env.CLOUDINARY_PDF_FOLDER || 'books-pdf'
                }, (err, res) => {
                    if (err) reject(err); else resolve(res);
                });
                stream.end(buffer);
            });

            pdf_url = result.secure_url;
            public_id = result.public_id;
        }

        await db.query('UPDATE books SET title = ?, description = ?,price=?,author=? , pdf_url = ?, public_id = ? WHERE id_book = ?', [
            title || book.title,
            description || book.description,
            price || book.price,
            author || book.author,
            pdf_url,
            public_id,
            id
        ]);


        return NextResponse.json({ message: 'Updated' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")
    try {
        console.log(id)
        const db = await connectionDatabase();
        const [rows] = await db.query('SELECT * FROM books WHERE id_book = ?', [id]);
        const book = rows[0];
        if (!book) return NextResponse.json({}, { status: 204 });

        if (book.public_id) {
            await cloudinary.uploader.destroy(book.public_id, { resource_type: 'raw', format: "pdf", mode_source: "public" }).catch(err => console.error(err));
        }

        await db.query('DELETE FROM books WHERE id_book = ?', [id]);
        return NextResponse.json({}, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
