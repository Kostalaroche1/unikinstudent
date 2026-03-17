"use client";

import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import BookCard from "./BooksCard";
import Link from "next/link";
import { Dropdown, Image } from "react-bootstrap";
import { FaPersonBooth, FaRegistered, FaUser } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useUserContext } from "../ContextComponent/UserAuth";
import { deleteCookie, getAuth } from "./AuthForm";

const fallbackBooks = [
    {
        id: "demo-1",
        title: "L'Etranger",
        author: "Albert Camus",
        price: 12.5,
        image: "/bietuphoto/book.png",
        pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
    },
    {
        id: "demo-2",
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupery",
        price: 10,
        image: "/bietuphoto/book.png",
        pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
    },
];

const normalizeBooks = (books) =>
    books
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
            ...item,
            id: item.id ?? item.id_book ?? `book-${index}`,
            title: typeof item.title === "string" ? item.title : "",
            author: typeof item.author === "string" ? item.author : "Unknown author",
            price: item.price ?? 0,
            image: item.image || "/bietuphoto/book.png",
            pdf_url: typeof item.pdf_url === "string" ? item.pdf_url : "",
        }));

export default function HomePage() {
    const [search, setSearch] = useState("");
    const [book, setBook] = useState([]);
    const { data: session } = useSession();
    const { user, setUser } = useUserContext();

    async function fetchBooks() {
        if (!user) {
            const dataAuth = await getAuth();
            if (dataAuth) {
                setUser(dataAuth);
            }
        }

        try {
            const res = await fetch("/api/book", { cache: "no-store" });
            if (!res.ok) {
                throw new Error("Failed to fetch books");
            }

            const data = await res.json();
            const booksFromApi = Array.isArray(data.books) ? normalizeBooks(data.books) : [];
            setBook(booksFromApi.length > 0 ? booksFromApi : fallbackBooks);
        } catch (err) {
            console.error(err);
            setBook(fallbackBooks);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = book.filter((bk) =>
        (bk.title || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="w-100 d-flex justify-content-between align-items-center">
                <p onClick={() => console.log(book)}>
                    <img src="/bietuphoto/unikin_logo.png" alt="unikin logo" />
                </p>

                {((user === null) || Object.keys(user).length === 0) || !session ? (
                    <Dropdown align="end" className="ms-0">
                        <Dropdown.Toggle
                            as="div"
                            style={{ cursor: "pointer" }}
                        >
                            <FiLogIn /> Connexion
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} href="/auth">
                                <FaRegistered className="me-2" /> Creer compte
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} href="/auth">
                                <FiLogIn className="me-2" /> Connexion
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Dropdown align="end" className="ms-0">
                        <Dropdown.Toggle
                            as="div"
                            style={{ cursor: "pointer" }}
                        >
                            <Image
                                src={session.user.image}
                                alt={session.user.name}
                                width={30}
                                height={30}
                                className="rounded-circle"
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} href="/admin">
                                <FaUser className="me-2" /> {session.user?.name}
                            </Dropdown.Item>
                            {user.role === "superadmin" && (
                                <Dropdown.Item as={Link} href="/admin">
                                    <FaPersonBooth className="me-2" /> Dashboard
                                </Dropdown.Item>
                            )}
                            <Dropdown.Item onClick={async () => deleteCookie()}>
                                <FiLogOut className="me-2" /> Deconnecter
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
            <SearchBar search={search} setSearch={setSearch} />
            <BookCard book={filteredBooks} />
        </div>
    );
}
