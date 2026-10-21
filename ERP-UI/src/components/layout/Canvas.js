import { Offcanvas } from "react-bootstrap";
import { memo } from "react";

const Canvas = (props) => {
  const { showCanvas, handleClose, title, canvasStyle } = props;
  return (
    <Offcanvas
      show={showCanvas}
      onHide={handleClose}
      placement="end"
      className={canvasStyle}
      backdrop="static"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{props.children}</Offcanvas.Body>
    </Offcanvas>
  );
};

Canvas.defaultProps = {
  title: "",
  canvasStyle: "w-50",
};

export default memo(Canvas);
