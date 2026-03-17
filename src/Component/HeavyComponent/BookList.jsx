components / BookList.jsx
"use client";

import { useEffect, useState } from "react";
import BookCard from "./BooksCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function BookList({ search }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("/api/book")
            .then((res) => res.json())
            .then((data) => setBooks(data.books || []));
    }, []);

    const filtered = books.filter(
        (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Row className="g-3 mt-3">
            {filtered.map((book) => (
                <Col key={book.id_book ?? book.id} xs={12} md={6} lg={4}>
                    <BookCard book={book} />
                </Col>
            ))}
        </Row>
    );
}

