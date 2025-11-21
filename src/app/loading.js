import { Spinner } from "react-bootstrap";
import { Container } from "react-bootstrap";

export default function Loading() {
    return (
        <Container className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3" />
            <p className="text-muted">Chargement, svp patientez...</p>
        </Container>
    );
}
