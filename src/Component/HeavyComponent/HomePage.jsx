
"use client";

import { useEffect, useId, useState } from "react";
import SearchBar from "./SearchBar";
import BookCard from "./BooksCard";
import Link from "next/link";
import { Button, Dropdown, Image } from "react-bootstrap";
import { FaBars, FaDashcube, FaPersonBooth, FaRegistered, FaTimes, FaUser } from "react-icons/fa";
import { FiLogIn, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useUserContext } from "../ContextComponent/UserAuth";
import { deleteCookie, getAuth } from "./AuthForm";

export default function HomePage() {
    const [search, setSearch] = useState("");
    const dates = Date.now()
    const [book, setBook] = useState([])
    const { data: session } = useSession()
    const { user, setUser } = useUserContext()
    const data = [
        {
            id: useId(),
            title: "L'Étranger",
            author: "Albert Camus",
            price: 12.5,
            image: "/bietuphoto/livre.jpg",
            pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
            createdBy: new Date("2024-01-10"),
            createdAt: new Date("2024-02-03")
        },
        {
            id: useId(),
            title: "Le Petit Prince",
            author: "Antoine de Saint-Exupéry",
            price: 10,
            image: "/bietuphoto/livre.jpg",
            pdf_url: "https://res.cloudinary.com/dhh7di2sp/raw/upload/v1763618958/books-pdf/roman1_e5es9c.pdf",
            createdBy: new Date("2024-03-12"),
            createdAt: new Date("2024-03-29")
        },
        {
            id: useId(),
            title: "1984",
            author: "George Orwell",
            price: 14,
            image: "/bietuphoto/livre.jpg",
            pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
            createdBy: new Date("2024-04-01"),
            createdAt: new Date("2024-04-20")
        },
        {
            id: useId(),
            title: "L'Alchimiste",
            author: "Paulo Coelho",
            price: 16,
            image: "/bietuphoto/livre.jpg",
            pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
            createdBy: new Date("2024-05-18"),
            createdAt: new Date("2024-06-03")
        },
        {
            id: useId(),
            title: "Les Misérables",
            author: "Victor Hugo",
            price: 18,
            image: "/bietuphoto/livre.jpg",
            pdf_url: "/pdf/st_exupery_le_petit_prince.pdf",
            createdBy: new Date("2024-06-10"),
            createdAt: new Date("2024-07-01")
        }
    ];

    async function fetchBooks() {
        console.log("session", session)
        if (!user) {
            const dataAuth = await getAuth()
            if (dataAuth) {
                setUser(dataAuth)
            }
        }

        try {
            const res = await fetch('/api/book');
            const data = await res.json();
            console.log(data.books, "data inside fetchboos Homepage", Array.isArray(data.books))
            if (Array.isArray(data.books)) {
                if (book.length < 1) {
                    setBook(data.books)
                }
            }
        } catch (err) {
            console.error(err);
            alert('Erreur lors du chargement des livres');
        }
    }


    useEffect(() => {
        fetchBooks()

    }, [])


    const filteredBooks = book.filter((bk) =>
        bk.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="w-100 d-flex justify-content-between align-items-center">
                <p onClick={() => console.log(book)}>
                    <img src="/bietuphoto/unikin_logo.png" alt="unikin logo" />
                </p>

                {((user === null) || Object.keys(user).length === 0) || !session ? (
                    <>
                        <Dropdown align="end" className="ms-0">
                            <Dropdown.Toggle
                                as="div"
                                style={{ cursor: "pointer" }}

                            >
                                <FiLogIn />   Connexion
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} href="/auth">
                                    <FaRegistered className="me-2" />  Créer compte
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} href="/auth">
                                    <FiLogIn className="me-2" />  Connexion
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
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
                            <Dropdown.Item as={Link} href={"/admin"}>
                                <FaUser className="me-2" />  {session.user?.name}
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} href={"/admin"}>
                                <FaPersonBooth className="me-2" />  Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item onClick={async () => deleteCookie()}>
                                <FiLogOut className="me-2" />    Deconnecter
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} href="/auth">
                                {/* <FiUser className="me-2" /> créer un compte */}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
                }
            </div>
            <SearchBar search={search} setSearch={setSearch} />
            <BookCard book={filteredBooks} />
        </div>
    );
}
