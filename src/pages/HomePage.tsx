import { useState } from "react";
import {
  IncomeTracker,
  ExpenseTracker,
  ChartAnalysis,
  AddTransactionModal,
} from "../components";
import { DatePicker } from "../utils";
import ReactModal from "react-modal";
import "react-day-picker/dist/style.css";
import { HomeConstants } from "../constants";
import { TransactionProvider } from "../context/TransactionContext";

const HomePage = () => {
  const [ModalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const customStyles = {
    content: {
      fontFamily: "Yatra One",
    },
  };

  return (
    <div className="container-fluid overflow-hidden">
      <TransactionProvider>
        <h1 className="text-center">{HomeConstants.HomeTitle}</h1>
        <div className="mt-4">
          <DatePicker />
        </div>
        <div className="row gx-5 gy-5 pt-3">
          <div className="col-lg-4 col-sm-12 col-md-6">
            <IncomeTracker />
          </div>
          <div className="col-lg-4 col-sm-12 col-md-6">
            <ExpenseTracker />
          </div>
          <div className="col-lg-4 col-sm-12 col-md-6">
            <ChartAnalysis />
          </div>
        </div>

        <button className="btn border border-dark mt-4" onClick={openModal}>
          {HomeConstants.Home_Submit_Button}
        </button>
        <ReactModal
          isOpen={ModalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <AddTransactionModal
            ModalIsOpen={ModalIsOpen}
            closeModal={closeModal}
            editMode={false}
            editTransactionData={null}
          />
        </ReactModal>
      </TransactionProvider>
    </div>
  );
};

export { HomePage };
