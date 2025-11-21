import Form from "react-bootstrap/Form";

export default function SearchBar({ search, setSearch }) {
    return (
        <Form className="mb-4">
            <div className="border border-1 rounded-2">
                <Form.Control
                    className="border border-0"
                    type="text"
                    placeholder="Search for a book..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </Form>
    );
}
