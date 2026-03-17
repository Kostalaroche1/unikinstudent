// components/UserManagement.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { FaTrash, FaUserEdit, FaUserShield } from "react-icons/fa";
import SuperAdminGuard from "./SuperAdminGuard";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("user");

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (data.ok) setUsers(data.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function handleDelete(id) {
        if (!confirm("Delete this user?")) return;
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
    }

    function openRoleModal(user) {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
    }

    async function changeRole() {
        if (!selectedUser) return;
        await fetch(`/api/users/${selectedUser.id_user}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
        });
        setShowRoleModal(false);
        fetchUsers();
    }

    return (
        <SuperAdminGuard>
            <div className="p-3">
                <h3>Users Management</h3>
                {loading ? (
                    <Spinner />
                ) : (
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id_user}>
                                    <td>{u.id_user}</td>
                                    <td>
                                        {u.image ? <img src={u.image} alt="" width={40} height={40} style={{ objectFit: "cover", borderRadius: 6 }} /> : "—"}
                                    </td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.createdAt}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openRoleModal(u)}>
                                            <FaUserEdit /> Role
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id_user)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUser && (
                            <Form>
                                <Form.Group>
                                    <Form.Label>User</Form.Label>
                                    <Form.Control readOnly value={`${selectedUser.name} (${selectedUser.email})`} />
                                </Form.Group>
                                <Form.Group className="mt-2">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                        <option value="superadmin">superadmin</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={changeRole}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </SuperAdminGuard>
    );
}
