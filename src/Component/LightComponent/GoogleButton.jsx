import Button from "react-bootstrap/Button";

export default function GoogleButton({ onClick }) {
    return (
        <Button
            variant="light"
            onClick={onClick}
            className="d-flex align-items-center justify-content-center gap-2 border w-100"
            style={{ padding: "10px", borderRadius: "8px" }}
        >
            <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                width="20"
                height="20"
            />
            <span className="fw-medium text-dark">
                Continuer avec google
            </span>
        </Button>
    );
}