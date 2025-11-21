// src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp, FaYoutube, FaYoutubeSquare } from "react-icons/fa";

export default function FooterBiblos() {
    const [year, setYear] = useState(null)
    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])

    return (
        <footer className=" text-light py-2 mt-5 mb-md-0" style={{ backgroundColor: '#c1c588ff', backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%" }}>
            <Container>
                {/* First line */}
                <Row className="mb-3 text-md-start mx-3">
                    <Col md={4} className=" mb-md-0">
                        <h4 className="mt-1">A Propos de nous</h4>
                        <ul className="list-unstyled">
                            <li><a href="" className="text-light text-decoration-none">Nos partenaires</a></li>
                            <li><a href="" className="text-light text-decoration-none">Apropos de nous</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h4 className="mt-1">Contact</h4>
                        <div className="mb-0">Email: unikinstudent@gmail.com</div>
                        <div>Kinshasa, RD CONGO</div>
                    </Col>
                    <Col md={4} className="mb-2">
                        <h6 className=" align-content-center align-items-center mb-2 pt-">SUIVEZ NOUS</h6>
                        <div className="d-flex gap-3 m">
                            <Link href={""}>  <FaFacebook size={30} /></Link>
                            <Link href={" "}>  <FaYoutube size={30} /></Link>
                            <Link href={" "}>  <FaWhatsapp size={30} /></Link>
                            <Link href={" "}>  <FaTwitter size={30} /></Link>
                        </div>
                    </Col>
                    <hr className="gab-2 " />
                </Row>
                {/* Second line */}
                <Row className="text-center py-0">
                    <Col className="py-0">
                        <p className="mb-1 py-0 small text-opacity-25">© {year} BIblos,  Tout droit reservé.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
