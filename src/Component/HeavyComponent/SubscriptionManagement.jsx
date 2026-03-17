// components/SubscriptionManagement.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { FaTrash, FaPlus, FaSyncAlt } from "react-icons/fa";
import { useUserContext } from "../ContextComponent/UserAuth";

export default function SubscriptionManagement() {
    const { user } = useUserContext();
    const loading = user === null;
    const [subs, setSubs] = useState([]);
    const [loadingSubs, setLoadingSubs] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [targetUser, setTargetUser] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    async function fetchSubs() {
        setLoadingSubs(true);
        try {
            const url = user?.role === "superadmin" ? "/api/subscription/subadmin" : "/api/subscription/subadmin"; // backend filters by session user for non-superadmins
            const res = await fetch(url);
            const data = await res.json();
            if (data.ok) setSubs(data.subscriptions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubs(false);
        }
    }

    useEffect(() => {
        if (!loading && user) fetchSubs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    async function handleDelete(id) {
        if (!confirm("Delete subscription?")) return;
        await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
        fetchSubs();
    }

    async function handleCreate() {
        const body = { expiresAt };
        if (user.role === "superadmin" && targetUser) body.id_user = targetUser;
        await fetch("/api/subscription/subadmin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        setShowCreate(false);
        setExpiresAt("");
        setTargetUser("");
        fetchSubs();
    }

    async function handleRenew(id) {
        // only superadmin allowed: call PUT to update expiresAt quickly for demo
        const newDate = prompt("Enter new expiresAt (YYYY-MM-DD)");
        if (!newDate) return;
        await fetch(`/api/subscription/subadmin/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expiresAt: newDate }) });
        fetchSubs();
    }

    if (loading) return <Spinner />;

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center">
                <h3>Subscriptions</h3>
                {user?.role === "superadmin" && (
                    <div>
                        <Button variant="success" className="me-2" onClick={() => setShowCreate(true)}>
                            <FaPlus /> Create
                        </Button>
                    </div>
                )}
            </div>

            {loadingSubs ? (
                <Spinner />
            ) : (
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Created</th>
                            <th>Expires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subs.map((s) => (
                            <tr key={s.id_sub}>
                                <td>{s.id_sub}</td>
                                <td>{s.id_user}</td>
                                <td>{s.createdAt}</td>
                                <td>{s.expiresAt ?? "—"}</td>
                                <td>
                                    {user?.role === "superadmin" ? (
                                        <>
                                            <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleRenew(s.id_sub)}>
                                                <FaSyncAlt /> Renew
                                            </Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s.id_sub)}>
                                                <FaTrash />
                                            </Button>
                                        </>
                                    ) : (
                                        <span className="text-muted">View only</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showCreate} onHide={() => setShowCreate(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {user?.role === "superadmin" && (
                            <Form.Group className="mb-2">
                                <Form.Label>User ID (for superadmin)</Form.Label>
                                <Form.Control value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-2">
                            <Form.Label>Expires At</Form.Label>
                            <Form.Control type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreate(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
