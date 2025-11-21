"use client"

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

    return (
        <div>
            <Container className="text-center mt-5 pt-5 not-found-bietu">
                <Row className="justify-content-center mt-4">
                    <Col md={6}>
                        <FaExclamationTriangle size={60} color="#ff4d4f" />
                        <h1 className="mt-3">Oops! Page no trouvé</h1>
                        <p className="text-muted">Désolé, La page qui tu cherche est inexistant.</p>

                        <Image
                            className="rounded-circle"
                            src="/bietuphoto/exception/image/notFound1.png" // place your image in public/images/
                            alt="Not Found"
                            width={200}
                            height={200}

                        />
                        <div className="mt-4">
                            <Button variant="primary" onClick={() => router.push("/")}>
                                retour
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default NotFound;
