"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, Button, Card, Alert, Row, Col, ToggleButtonGroup, ToggleButton, Modal, Spinner } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { useUserContext } from "../ContextComponent/UserAuth";


export default function AuthForm() {
  const [mode, setMode] = useState("connecter"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession()
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [loadData, setLoadData] = useState(false)

  const { user } = useUserContext()
  const route = useRouter()
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      route.push("/")
    }
  }, [])


  const sendMail = async (e) => {
    e.preventDefault();

    setLoadData(true)
    // Regular expressions for validation
    const phoneNumber1Regex = /^08[123459]{1}[0-9]{7}$/.test(phone)
    const phoneNumber2Rgex = /^09[0579]{1}[0-9]{7}$/.test(phone)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
    if (!session) {
      if (!emailRegex.test(email)) {
        setError("entrer une adresse email valide.");
        return;
      }
      if (!phoneNumber1Regex || (!phoneNumber1Regex)) {
        setError("s'il vous plai entrée un numéro de telephone valide avec 0 au debut");
        return;
      }
    }

    setError("");
    const sendMail = await fetch(`/api/email`, {
      method: "POST", body: JSON.stringify({
        userEmail: session ? session.user.email : email, subject: "Le code d'authentification à la bibliothèque unikin en ligne expire dans 10 min ", text: "cet email provient de l'application  bibliothèque unikin en ligne pour s'authentifier", user: session ? session.user : null
      })
    })

    const data = await sendMail.json()
    if (data.status) {
      setLoadData(false)
      setShowMessageModal(true)
    } else {
      setLoadData(false)
      setError("peut être email introduit n'est valide, introduisez un email valide pour vous connectez")
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-90 mt-5 bg-light ">
      <VerifyCodeModal show={showMessageModal} setShow={setShowMessageModal} />
      <Card className="shadow-lg p-4 rounded-4" style={{ width: "500px" }}>
        <Card.Body>
          {/* Header */}
          <div className="text-center mb-4">
            <h4>{mode === "connecter" ? session ? session.user.email : "cliquez sur créer avec un autre compte dans le cas d'une nouvelle compte " : "enregistrer"}</h4>
            <p className="text-muted small">
              {mode === "connecter"
                ? "Acceder à votre compte"
                : "créer un compte"}
            </p>
          </div>

          {/* Toggle Mode */}
          <div className="text-center mb-4">
            <ToggleButtonGroup
              type="radio"
              name="mode"
              value={mode}
              onChange={(val) => setMode(val)}
            >
              <ToggleButton
                disabled={loadData}
                id="tbg-login"
                value="connecter"
                variant={mode === "login" ? "primary" : "outline-primary"}
              >
                connecter
              </ToggleButton>
              <ToggleButton
                id="tbg-register"
                disabled={loadData}
                value="enregistrer"
                variant={mode === "enregistrer" ? "primary" : "outline-primary"}
                onClick={() => {
                  if (session) {
                    signOut()
                  }
                }}
              >
                créer un compte
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {/* Form */}
          <Form onSubmit={sendMail}>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-grid">
              {session && <Button variant="primary" type="submit" disabled={loadData} >
                {mode === "connecter" ? "connecter" : "créer un compte"

                }
              </Button>}
            </div>
          </Form>

          {/* Divider */}
          {!session && <>
            {/* Social login buttons */}
            <Row className="text-center">
              <Col>
                <Button variant="outline-danger" className="w-100 mb-2"
                  disabled={loadData}
                  onClick={() => {
                    setLoadData(true)
                    signIn("google")
                  }}
                >
                  <FaGoogle className="me-2" />
                  Continuer avec google
                </Button>
              </Col>
            </Row>
          </>}
          <Row className="text-=text-center mt-2">
            <Col>
              <Button variant="light" size="sm" className="w-100 mb-2"
                onClick={() => {
                  signOut()
                }}
              >connecter avec un autre compte </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

    </div >
  );
}
export const ModalMessage = ({ message, showMessageModal, setShowMessageModal }) => {
  return (<Modal show={showMessageModal} onHide={() => true}>
    <Modal.Header closeButton onClick={() => setShowMessageModal(false)}></Modal.Header>
    <Modal.Body >
      <Modal.Title>{message}</Modal.Title>
    </Modal.Body>
  </Modal>
  )
}
// modal checking
export function VerifyCodeModal({ show, setShow }) {
  const [codeCheckMail, setCodeCheckMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const route = useRouter()
  const { setUser } = useUserContext()

  const handleVerify = async () => {
    if (!codeCheckMail.trim()) {
      setMessage("Please enter your verification code.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeCheckMail }),
      });
      const data = await res.json();
      if (data.status) {
        setMessage("✅" + data.message);
        setUser(await getAuth())
        setShow(false)
        route.push("/dashboard");
        setCodeCheckMail("")
        setShow(false)
        route.push("/")
      } else {
        setMessage(`❌ ${data.error || "code invalide"}`);
      }
    } catch (err) {
      setMessage("⚠️ erreur survenu, ressayer encore");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={show} onHide={() => false} centered>
      <Modal.Header closeButton onClick={() => setShow(false)}>
        <Modal.Title>Verification Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Entrez le code à 6 chiffre .</p>
        <Form.Control
          type="text"
          placeholder="Enter code"
          value={codeCheckMail}
          onChange={(e) => setCodeCheckMail(e.target.value)}
          maxLength={6}
          className="mb-3 text-center"
        />
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" /> Verification...
          </div>
        ) : (
          <Button
            variant="primary"
            className="w-100"
            onClick={handleVerify}
          >
            Verifier code
          </Button>
        )}

        {message && <p className="mt-3 text-center">{message}</p>}
      </Modal.Body>
    </Modal>
  );
}

/**
 * send email for contact
 * @param {string} userEmail 
 * @param {string} subject 
 * @param {string} text 
 * @param {object} user 
 * @returns 
 */
export const sendMail = async (userEmail, subject = "Bibliotheque unikin connection expire dans 10 min ",
  text = "cet email provient de site bibliotheque unikin en ligne  pour s'authentifier",
  description = "Bonjour, nourissez votre savoir votre partenaire de tout les temps",
  user = null) => {
  try {
    const data = await fetch(`/api/email`, {
      method: "POST", body: JSON.stringify({
        userEmail, subject, text, user, description
      })
    })
    if (!data.ok) {
      return null
    }
    return await data.json()
  } catch (error) {
    return null
  }
}

export async function getAuth() {
  try {
    const data = await fetch("/api/email", { method: "GET" })
    if (!data.ok) {
      return null
    }
    const res = await data.json()
    return res.user
  } catch (error) {
    return null
  }
}

export const deleteCookie = async (setShowModalMessage, showModalMessage) => {
  try {
    const data = await fetch("/api/email", { method: "DELETE" })
    if (!data.ok) {
      setShowModalMessage(true)
        (<div>
          <ModalMessage message={"error"} setShowMessageModal={setShowModalMessage} showMessageModal={showModalMessage} />
        </div>
        )
    }
    signOut({ callbackUrl: "/" })
  } catch (error) {
    throw error
  }
}
