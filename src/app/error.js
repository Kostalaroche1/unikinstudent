"use client";
import { FaBug } from "react-icons/fa";
import { Container, Button } from "react-bootstrap";
import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Container className="text-center py-5">
            <FaBug size={50} className="text-danger mb-3" />
            <h1>Oops! Il ya eu un probleme.</h1>
            <p className="text-muted">Svp essayer encore ou consulter équipe technique BIBLIOTHEQUE ONLINE UNIKIN.</p>
            <Button variant="primary" onClick={() => reset()}>Ressayer </Button>
        </Container>
    );
}
