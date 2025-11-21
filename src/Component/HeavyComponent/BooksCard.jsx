
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
  const [canDownload, setCanDownload] = useState({ sendCode: false, confirCode: false });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  const [currentPdfBuy, setCurrentPdfBuy] = useState({ show: false, url: "" });
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

  const handleRead = async (bk) => {
    if (!user) return router.push("/auth");
    if (user.idSub) {
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

  const handleBuy = async (book) => {
    if (!user) return router.push("/auth");
    console.log("user", user, "book", book)
    try {
      if (user) {
        const res = await fetch("/api/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, bookId: book.id_book }),
        });
        const data = await res.json()
        if (!res.ok) {
          setCanDownload({ sendCode: false, confirCode: true });
        } else {
          console.log(data, 'data after purchase')
          if (data.status && data.purchase[0].id_purchase) {
            setCanDownload({ sendCode: false, confirCode: false })
            setCurrentPdfBuy({ show: true, url: book.pdf_url })
          }
        }
      } else {
        router.push("/auth")
      }
    } catch (error) {

    }

  };

  const handleDownload = async () => {
    const sendEmail = await sendMail(user ? user.email : null, "ACHETEZ UN OUVRAGE DANS LA BIBLIOTHEQUE", "vous avez récu cet email pour demande d'un abbonement. ce que vous" +
      " devez faire maintenant est d'aller dans l'application web BIBLIOTHEQUE ONLINE pour remplir le code ci-dessous", "une fois finir le processus del'achat vous pouvez achetez pour lire les ouvrages", user ? user.email : null)
    console.log(" result mail send")
    if (sendEmail) {
      alert("send mail")
      setCanDownload({ sendCode: false, confirCode: true })
    } else {
      alert(" no send mail")

      console.log(" result mail send")
      alert("réssayer mail non envoyer")
      setCanDownload({ sendCode: true, confirCode: false });
    }
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
                        if (user) {
                          if (user.idSub) {
                            handleRead(bk)
                          } else {
                            setShowModal({ sendCode: true, subscribed: false })
                          }
                        } else {
                          router.push("/auth")
                        }
                      }}>
                        Read
                      </Button>

                      <Button variant="success" onClick={() => {
                        setCanDownload({ sendCode: true, confirCode: false })
                        setExpiredDate("")
                        setCodeSub("")

                      }}
                        disabled={canDownload.sendCode}

                      >
                        {!canDownload.sendCode && "Buy / Download"}
                        {canDownload.sendCode && <div className='spinner spinner-border-sm'></div>}
                      </Button>
                      {/* for buy and download */}
                      <PdfModal
                        show={currentPdfBuy.show}
                        fileUrl={currentPdfBuy.url}
                        onClose={() => setShowPdfModal(false)}
                      />
                      {/* for read book */}
                      <PdfModal
                        show={showPdfModal}
                        fileUrl={currentPdf}
                        onClose={() => setShowPdfModal(false)}
                      />
                      {/* process of read book */}
                      <ModalSubscribe
                        showModalSub={showModal} setShowModalSub={setShowModal}
                        expiredDate={expiredDate} setExpiredDate={setExpiredDate}
                        user={user}
                        handleRead={handleRead}
                        checkSubscription={checkSubscription}
                        codeSub={codeSub} setCodeSub={setCodeSub}
                        bk={bk}
                      />
                      {/* process of buy */}
                      <ModalBuy
                        canDownload={canDownload} setCanDownload={setCanDownload}
                        expiredDate={expiredDate} setExpiredDate={setExpiredDate}
                        user={user}
                        handleBuy={handleBuy}
                        handleDownload={handleDownload}
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

        <> {showModalSub.sendCode && <form onSubmit={(e) => e.preventDefault()}>
          <p>Enter your Visa card details to subscribe or buy the book:</p>

          <input type="text" placeholder="Card Number" disabled={canDownload.sendCode} className="form-control mb-2" required />
          <input type="text" placeholder="Expiry MM/YY" disabled={canDownload.sendCode} className="form-control mb-2" required />
          <input type="text" placeholder="CVV" disabled={canDownload.sendCode} className="form-control mb-2" required />
          <label htmlFor="expiredDate"></label> <input type="date" form="expiredDate" disabled={canDownload.sendCode} placeholder="dateExpire" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />
        </form>}
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

export const ModalBuy = ({ canDownload, setCanDownload, expiredDate, setExpiredDate, user, handleDownload, handleBuy, codeSub, setCodeSub, bk }) => {

  return (
    <Modal show={canDownload.sendCode || canDownload.confirCode} onHide={() => setCanDownload({ sendCode: false, confirCode: false })}>
      <Modal.Header closeButton>
        <Modal.Title>{canDownload.sendCode ? "ACHETER UN OUVRAGE DANS BIBLIOTHEQUE EN LINE" : canDownload.confirCode ? `CONFIRMER LE CODE ENVOYER DANS ${user.email}` : ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <> {canDownload.sendCode && <form onSubmit={(e) => e.preventDefault()}>
          <p>Enter your Visa card details to subscribe or buy the book:</p>
          <input type="text" placeholder="Card Number" className="form-control mb-2" required />
          <input type="text" placeholder="Expiry MM/YY" className="form-control mb-2" required />
          <input type="text" placeholder="CVV" className="form-control mb-2" required />
          <input type="date" placeholder="dateExpire" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} className="form-control mb-2" required />
        </form>}
          {canDownload.confirCode && <input type="text" placeholder="code de confirmation à l'achat de l'ouvrage" value={codeSub} onChange={(e) => setCodeSub(e.target.value)} className="form-control mb-2" required />}            </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setCanDownload({ sendCode, confirCode: false })}>
          Fermer
        </Button>
        {canDownload.sendCode ? (
          <Button variant="success"
            onClick={() => {
              handleDownload()
            }}
          >
            Aheter
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={() => handleBuy(bk)}
          >
            Confirmer votre achat
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}