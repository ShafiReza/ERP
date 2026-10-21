import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer bg-white border mt-auto py-3">
      <Container>
        <span className="text-muted">Version: 1.0</span>
        <span className="text-muted float-end">
          Developed By: Ntitas IT Ltd.
        </span>
      </Container>
    </footer>
  );
};

export default Footer;
