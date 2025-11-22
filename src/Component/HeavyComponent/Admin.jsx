
"use client";
import React, { useEffect, useState } from "react";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaBackward } from "react-icons/fa";
import { useUserContext } from "../ContextComponent/UserAuth";
import Link from "next/link";
import { getAuth } from "./AuthForm";
import { useRouter } from "next/navigation";
import PdfViewer from "./PdfViewer";

export default function BooksAdmin() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { book, setBook, user, setUser } = useUserContext()

    const router = useRouter()
    async function fetchBooks() {
        const dataAuth = await getAuth()

        if (!user) {
            if (dataAuth) {
                setUser(dataAuth)
            }
        }
        if (user) {
            if (user && user.role !== "superadmin" || dataAuth.role !== "superadmin") {
                router.back("/")
            }
        }



        try {
            const res = await fetch('/api/book');
            const data = await res.json();
            console.log(data, "fetch admin useeefect")
            setBooks(data.books || []);
            if (book.length > 0) {
                setBook(data.books)
            }
        } catch (err) {
            console.error(err);
            alert('Erreur lors du chargement des livres');
        }
    }

    useEffect(() => { fetchBooks(); }, []);

    function openAdd() {
        setEditing(null);
        setTitle('');
        setDescription('');
        setFile(null);
        setShow(true);
        setAuthor("");
        setPrice("")
    }

    function openEdit(bookPara) {
        console.log(bookPara)
        setEditing(bookPara);
        setTitle(bookPara.title);
        setDescription(bookPara.description || '');
        setAuthor(bookPara.author || "")
        setPrice(bookPara.price || "")
        setFile(null);
        setShow(true);

    }

    async function handleSubmit() {
        if (!title.trim()) return alert('Le titre est requis');
        setLoading(true);
        try {
            const form = new FormData();
            form.append('title', title);
            form.append('description', description);
            form.append("author", author)
            form.append("price", price)
            if (file) form.append('file', file);

            const endpoint = editing ? `/api/book?id=${editing.id_book}` : '/api/book';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, { method, body: form });
            if (!res.ok) throw new Error(await res.text());

            setShow(false);
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert('Échec de la sauvegarde');
        } finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Supprimer ce livre ?')) return;
        try {
            const res = await fetch(`/api/book?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            fetchBooks();
        } catch (err) { console.error(err); alert('Erreur suppression'); }
    }

    const filtered = books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));

    return (user && user.role === 'superadmin' &&
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link href={"/"} className="list-unstyled"><FaBackward /> Gestion des PDF (Livres)</Link>
                <div className="d-flex gap-2">
                    <Form.Control placeholder="Rechercher..." value={query} onChange={e => setQuery(e.target.value)} />
                    <Button onClick={openAdd}><FaPlus /> Ajouter</Button>
                </div>
            </div>

            <Table responsive hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Auteur</th>
                        <th>Fichier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(book => (
                        <tr key={book.id_book}>
                            <td>{book.id_book}</td>
                            <td>{book.title}</td>
                            <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={book.description}>{book.description}</td>
                            <td>{book.price}</td>
                            <td>{book.author}</td>
                            <td><PdfViewer>ouvrir</PdfViewer></td>
                            <td>
                                <Button size="sm" variant="warning" className="me-2" onClick={() => openEdit(book)}><FaEdit /></Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(book.id_book)}><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Modifier le PDF' : 'Ajouter un PDF'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control value={price} onChange={e => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>author</Form.Label>
                            <Form.Control rows={3} value={author} onChange={e => setAuthor(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Fichier PDF {editing ? '(laisser vide pour garder actuel)' : ''}</Form.Label>
                            <Form.Control type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? 'En cours...' : (editing ? 'Mettre à jour' : 'Ajouter')}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


