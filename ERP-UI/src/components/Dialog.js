import { Modal } from "react-bootstrap";

const ModalDialog = (props) => {
  return (
    <Modal
      show={props.showDialog}
      onHide={props.handleDialogNo}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ModalDialog;
