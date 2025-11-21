components / BookList.jsx
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BookCard from "./BooksCard";

// export default function BookList({ search }) {
//     // later you will replace this with MySQL fetch
//     const books = [
//         { id: 1, title: "The Power of Faith", author: "John Mark", price: 10, image: "/books/book1.jpg" },
//         { id: 2, title: "Learn React Fast", author: "Gabriel K.", price: 15, image: "/books/book2.jpg" },
//         { id: 3, title: "Kingdom of God", author: "Paul S.", price: 12, image: "/books/book3.jpg" },
//     ];

//     const filtered = books.filter((b) =>
//         b.title.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <Row>
//             {filtered.map((book) => (
//                 <Col key={book.id} xs={12} md={6} lg={4} className="mb-4">
//                     <BookCard book={book} />
//                 </Col>
//             ))}
//         </Row>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function BookList({ search }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("/api/books")
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
                <Col key={book.id} xs={12} md={6} lg={4}>
                    <BookCard book={book} />
                </Col>
            ))}
        </Row>
    );
}

