import React from "react";
import { MdClose } from "react-icons/md";

type ModalProps = {
  ModalIsOpen: boolean;
  closeModal: () => void;
};

const ChartAnalysisModal = ({ ModalIsOpen, closeModal }: ModalProps) => {
  return (
    <div
      className={`container-fluid mx-auto text-center ${
        ModalIsOpen ? "d-block" : "d-none"
      }`}
    >
      <span className="d-flex justify-content-end">
        <MdClose onClick={closeModal} fontSize={25} />
      </span>
    </div>
  );
};

export default ChartAnalysisModal;
