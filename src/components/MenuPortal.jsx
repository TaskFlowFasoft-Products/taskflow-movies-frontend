import { createPortal } from "react-dom";

const MenuPortal = ({ children }) => {
  return createPortal(children, document.body);
};

export default MenuPortal;
