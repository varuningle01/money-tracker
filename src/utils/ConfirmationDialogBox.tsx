import React from "react";
import "./ConfirmationDialogBox.css";
import { MdDone, MdClose } from "react-icons/md";

type ConfirmationDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirmation-dialog">
      <p>{message}</p>
      <div className="confirmation-buttons">
        <button className="btn border border-dark me-3" onClick={onConfirm}>
          <MdDone />
        </button>
        <button className="btn border border-dark me-3" onClick={onCancel}>
          <MdClose />
        </button>
      </div>
    </div>
  );
};

export { ConfirmationDialog };
