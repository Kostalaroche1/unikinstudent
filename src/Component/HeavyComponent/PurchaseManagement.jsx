"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function PurchaseManagement({ userRole }) {
    const [purchases, setPurchases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [bookId, setBookId] = useState("");

    async function fetchPurchases() {
        const res = await fetch("/api/purchase/adminpurchase");
        const data = await res.json();
        setPurchases(data);
    }

    useEffect(() => {
        fetchPurchases();
    }, []);

    async function handleDelete(id_purchase) {
        if (!confirm("Delete this purchase?")) return;
        await fetch("/api/purchase/adminpurchase", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_purchase }),
        });
        fetchPurchases();
    }

    async function handleEdit() {
        if (!editItem) return;
        await fetch("/api/purchase/adminpurchase", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_purchase: editItem.id_purchase, id_book: bookId, id_user: editItem.id_user }),
        });
        setShowModal(false);
        fetchPurchases();
    }

    async function handleCreate(id_book) {
        await fetch("/api/purchaseD/adminpurchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_book }),
        });
        fetchPurchases();
    }

    return (
        <div>
            <h3>Purchases</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Book ID</th>
                        <th>Created At</th>
                        {userRole === "superadmin" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {purchases.map(p => (
                        <tr key={p.id_purchase}>
                            <td>{p.id_purchase}</td>
                            <td>{p.id_user}</td>
                            <td>{p.id_book}</td>
                            <td>{new Date(p.createdAt).toLocaleString()}</td>
                            {userRole === "superadmin" && (
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => { setEditItem(p); setBookId(p.id_book); setShowModal(true); }}>
                                        <FaEdit />
                                    </Button>{" "}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id_purchase)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Form inline className="my-3">
                <Form.Control type="number" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
                <Button onClick={() => handleCreate(bookId)}>Add Purchase</Button>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Book ID</Form.Label>
                        <Form.Control type="number" value={bookId} onChange={(e) => setBookId(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEdit}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
