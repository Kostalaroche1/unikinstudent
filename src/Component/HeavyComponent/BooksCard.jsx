
"use client";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import { useUserContext } from "../ContextComponent/UserAuth";
import { sendMail } from "./AuthForm";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// Dynamically import PdfModal, only in browser
const PdfModal = dynamic(() => import("./PdfModal"), {
  ssr: false,
});

export default function BookCard({ book }) {
  const { user } = useUserContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState({ sendCode: false, subscribed: false });
  const [canDownload, setCanDownload] = useState({ send: false, subscribed: false });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  const [expiredDate, setExpiredDate] = useState("")
  const { data: session } = useSession()
  const [codeSub, setCodeSub] = useState("")

  const checkSubscription = async () => {
    console.log(user)
    if (!user) {
      // alert("vous devez créer un compte  ou se connecter avant de s'abonner")
      return router.push("/auth")
    }
    const sub = await fetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify({ userId: user.id ? user.id : null, expiredDate }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(sub, "after subscription")
    if (!sub.ok) {
      return alert("error")
    }
    const data = await sub.json()
    if (data.status) {
      alert("vous vous venez d'etre abonner")
      setCodeSub("")
      setTimeout(() => {
        setShowModal({ sendCode: false, subscribed: false })
        setShowPdfModal(true)
      }, 4000);
    }
    // setCanDownload(true);
  };

  const getCheckSubscription = async () => {

    if (!user) {
      return false
    }
    const res = await fetch(`/api/subscription?userId=${user.id}`);
    const data = await res.json();
    return data.subscribed || false;

  }

  const handleRead = async (bk) => {
    if (!user) return router.push("/auth");
    if (user.idSub) {
      // const blod = await fetch(book.pdf_url)
      // const blodURL = URL.createObjectURL(blod)
      // alert("url blod inside handleRead", blodURL)
      const url = bk.pdf_url?.trim()
      if (url) {
        // alert(url)
        setCurrentPdf(url);
        setShowPdfModal(true);
        return;
      }
      // return router.push(`/book/${bk.id}`);
    } else {
      if (user) {
        const sendEmail = await sendMail(user ? user.email : null, "ABONNEMENT DANS LA BIBLIOTHEQUE", "vous avez récu cet email pour demande d'un abbonement. ce que vous" +
          " devez faire maintenant est d'aller dans l'application web BIBLIOTHEQUE ONLINE pour remplir le code ci-dessous", "une fois finir le processus del'abonnement vous devenez eligible pour lire les ouvrages", user ? user.email : null)
        setShowModal({ sendCode: true, subscribed: false });
        console.log(" result mail send")
        if (sendEmail) {
          setShowModal({ sendCode: false, subscribed: true })
        } else {
          console.log(" result mail send")
          alert("réssayer mail non envoyer")
          setShowModal({ sendCode: true, subscribed: false });
        }
      } else {
        alert("vous devez vous connectez ou créer un compte pour s'abonnez")
        router.push("/auth")
      }
    }
  };

  const handleBuy = async () => {
    // if (!user) return router.push("/auth");
    // const subscribed = await getCheckSubscription();
    // if (subscribed) {
    //   const res = await fetch("/api/purchase", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ userId: 12, bookId: 4 }),
    //   });
    //   const data = await res.json()
    //   if (!res.ok) {
    //     setCanDownload({ send: false, subscribed: true });
    //   }
    // }

    setCanDownload({ send: true, subscribed: false })

  };

  const handleDownload = () => {
    window.open(book.pdf_url, "_blank"); // open PDF in new tab for download
  };

  return (
    <div className="container w-100">
      {
        Array.isArray(book) && book.length !== 0 ?
          <div className="row">
            {book.map((bk, index) => (
              <div className="col-lg-4 col-12" key={index}>
                <Card style={{ marginBottom: '13px' }}>
                  <Card.Img
                    variant="top"
                    src={bk.image || "/bietuphoto/book.png"}
                    style={{ height: "250px", width: '320px', objectFit: "cover" }}
                  />
                  <Card.Body >
                    <Card.Title>{bk.title}</Card.Title>
                    <Card.Text>Author: {bk.author}</Card.Text>
                    <Card.Text>Price: ${bk.price}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={() => {
                        if (user.idSub) {
                          handleRead(bk)
                        } else {
                          setShowModal({ sendCode: true, subscribed: false })
                        }
                      }}>
                        Read
                      </Button>

                      <Button variant="success" onClick={() => setShowModal({ sendCode: !showModal.sendCode, subscribed: false })}>
                        Buy / Download
                      </Button>


                      <PdfModal
                        show={showPdfModal}
                        fileUrl={currentPdf}
                        onClose={() => setShowPdfModal(false)}
                      />
                      <ModalSubscribe
                        showModalSub={showModal} setShowModalSub={setShowModal}
                        expiredDate={expiredDate} setExpiredDate={setExpiredDate}
                        user={user}
                        handleRead={handleRead}
                        checkSubscription={checkSubscription}
                        codeSub={codeSub} setCodeSub={setCodeSub}
                        bk={bk}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}

          </div>
          :
          ""
      }
      {/* Modal */}
      {/* <Modal show={showModal.sendCode || showModal.subscribed} onHide={() => setShowModal({ sendCode: false, subscribed: false })}>
        <Modal.Header closeButton>
          <Modal.Title>{showModal.sendCode ? "ABONNEZ-VOUS DANS BIBLIOTHEQUE EN LINE" : showModal.subscribed ? `CONFIRMER LE CODE ENVOYER DANS ${user.email}` : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {canDownload ? (
            <p>You can now download your book:</p>
          ) : (
            <> {showModal.sendCode && <>
              <p>Enter your Visa card details to subscribe or buy the book:</p>
              <input type="text" placeholder="Card Number" className="form-control mb-2" required />
              <input type="text" placeholder="Expiry MM/YY" className="form-control mb-2" required />
              <input type="text" placeholder="CVV" className="form-control mb-2" required />
              <input type="date" placeholder="dateExpire" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />
            </>}
              {showModal.subscribed && <input type="date" placeholder="code de confirmation à l'abonnement" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />}            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          {showModal.sendCode ? (
            <Button variant="success"
              onClick={handleRead}
            >
              Abonner
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={checkSubscription}
            >
              Confirmer votre Abonnement
            </Button>
          )}
        </Modal.Footer>
      </Modal> */}



      {/* PDF Reader Modal */}
      {/* <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="xxl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Read Book</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh", padding: 0, border: "3px dashed yellow" }}>
          {currentPdf ? (
            <iframe
              src={currentPdf + "#toolbar=0"}
              style={{ width: "100%", height: "100%", border: "" }}
              allow="fullscreen"
            ></iframe>
          ) : (
            <p>Pas de livre à lire</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPdfModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

    </div>
  );
}


export const ModalSubscribe = ({ showModalSub, setShowModalSub, expiredDate, setExpiredDate,
  codeSub, setCodeSub, user, handleRead, checkSubscription, bk }) => {






  return (
    <Modal show={showModalSub.sendCode || showModalSub.subscribed} onHide={() => true}>
      <Modal.Header closeButton>
        <Modal.Title>{showModalSub.sendCode ? "ABONNEZ-VOUS DANS BIBLIOTHEQUE EN LINE" : showModalSub.subscribed ? `CONFIRMER LE CODE ENVOYER DANS ${user.email}` : ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <> {showModalSub.sendCode && <>
          <p>Enter your Visa card details to subscribe or buy the book:</p>
          <input type="text" placeholder="Card Number" className="form-control mb-2" required />
          <input type="text" placeholder="Expiry MM/YY" className="form-control mb-2" required />
          <input type="text" placeholder="CVV" className="form-control mb-2" required />
          <label htmlFor="expiredDate"></label> <input type="date" form="expiredDate" placeholder="dateExpire" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />
        </>}
          {showModalSub.subscribed && <input type="text" placeholder="code de confirmation à l'abonnement" value={codeSub} onChange={(e) => setCodeSub(e.target.value)} className="form-control mb-2" required />}            </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModalSub({ sendCode: false, subscribed: false })}>
          Fermer
        </Button>
        {showModalSub.sendCode ? (
          <Button variant="success"
            onClick={() => handleRead(bk)}
          >
            Abonner
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={checkSubscription}
          >
            Confirmer votre Abonnement
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export const ModalBuy = ({ showModalSub, setShowModalSub, expiredDate, setExpiredDate, user, handleRead, checkSubscription }) => {

  return (
    <Modal show={showModalSub.sendCode || showModalSub.subscribed} onHide={() => setShowModalSub({ sendCode: false, subscribed: false })}>
      <Modal.Header closeButton>
        <Modal.Title>{showModalSub.sendCode ? "ABONNEZ-VOUS DANS BIBLIOTHEQUE EN LINE" : showModalSub.subscribed ? `CONFIRMER LE CODE ENVOYER DANS ${user.email}` : ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <> {showModalSub.sendCode && <>
          <p>Enter your Visa card details to subscribe or buy the book:</p>
          <input type="text" placeholder="Card Number" className="form-control mb-2" required />
          <input type="text" placeholder="Expiry MM/YY" className="form-control mb-2" required />
          <input type="text" placeholder="CVV" className="form-control mb-2" required />
          <input type="date" placeholder="dateExpire" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />
        </>}
          {showModalSub.subscribed && <input type="date" placeholder="code de confirmation à l'abonnement" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />}            </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModalSub({ sendCode, subscribed: false })}>
          Fermer
        </Button>
        {showModalSub.sendCode ? (
          <Button variant="success"
            onClick={handleRead}
          >
            Abonner
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={checkSubscription}
          >
            Confirmer votre Abonnement
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}