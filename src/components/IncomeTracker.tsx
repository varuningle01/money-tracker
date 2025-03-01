import { useState, useMemo, useEffect } from "react";
import { useTransactionContext } from "../context/TransactionContext";
import axios from "axios";
import { IncomeConstants } from "../constants";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { ConfirmationDialog } from "../utils/ConfirmationDialogBox";
import ReactModal from "react-modal";
import { AddTransactionModal } from "./AddTransactionModal";
import {
  calculateTotalIncome,
  deleteTransactionData,
  filteringData,
} from "../utils/Formatting";
import "./IncomeTracker.css";
import { mockTransactions } from "../data/mockTransactionData";

type IncomeData = {
  _id: string;
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemAmount: number;
  itemText: string;
};

const IncomeTracker = () => {
  const [ModalIsOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTransactionData, setEditTransactionData] =
    useState<IncomeData | null>(null);
  const { state, dispatch } = useTransactionContext();
  const { incomeData, selectedDate, expenseData } = state;
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEditTransaction = async (transactionId: string) => {
    try {
      const response = localStorage.getItem("transactions");
      if (response) {
        const parsedTransactions = JSON.parse(response);
        const transaction = parsedTransactions.find(
          (txn: { _id: string }) => txn._id === transactionId
        );
        setEditTransactionData(transaction);
        setEditMode(true);
        openModal();
      }
    } catch (error) {
      console.log("Error Occurred : ", error);
    }
  };

  const handleDeleteConfirmation = (transactionId: string) => {
    setShowConfirmationDialog(true);
    setTransactionIdToDelete(transactionId);
  };

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false);
    setTransactionIdToDelete("");
  };

  const filteredData = useMemo(
    () => filteringData(incomeData, selectedDate),
    [incomeData, selectedDate]
  );

  const totalincome = useMemo(
    () => calculateTotalIncome(filteredData),
    [incomeData, selectedDate]
  );
  const fetchTransactionData = () => {
    try {
      const response = localStorage.getItem("transactions");
      if (response?.length) {
        const parsedTransactions = JSON.parse(response);
        const incomeData = parsedTransactions.filter(
          (txn: IncomeData) => txn.moneyCategory === "income"
        );
        dispatch({ type: "SET_INCOME_DATA", payload: incomeData });
      } else {
        console.log("Error in getting the transaction data");
      }
    } catch (error) {
      console.log("Error Occured : ", error);
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchTransactionData();
    const handleTransactionUpdate = () => fetchTransactionData();
    window.addEventListener("Transactions Updated", handleTransactionUpdate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(mockTransactions));
  }, []);

  const customStyles = {
    content: {
      fontFamily: "Yatra One",
    },
  };

  return (
    <div className="content container-fluid border border-dark">
      <h2 className="text-center">{IncomeConstants.IncomeTitle}</h2>

      <div className="d-flex justify-content-evenly">
        <p>{IncomeConstants.TotalIncomeText}</p>
        <p>
          {IncomeConstants.Currency}
          {totalincome}
        </p>
      </div>
      <div className="overflow-scroll">
        {filteredData.map((element) => {
          return (
            <div key={element._id} className="d-flex row">
              <p className="col-4">{element.itemText}</p>
              <p className="col-4">{element.itemAmount}</p>
              <span className="col-4">
                <MdModeEdit
                  type="button"
                  className="me-3"
                  onClick={() => handleEditTransaction(element._id)}
                />

                <MdDelete
                  type="button"
                  onClick={() => handleDeleteConfirmation(element._id)}
                />
              </span>
              <hr />
            </div>
          );
        })}
      </div>
      {showConfirmationDialog && (
        <ConfirmationDialog
          message="Are you sure you want to delete this transaction?"
          onConfirm={() => {
            deleteTransactionData(transactionIdToDelete, [
              ...incomeData,
              ...expenseData,
            ]);
            setShowConfirmationDialog(false);
          }}
          onCancel={handleCancelDelete}
        />
      )}
      <ReactModal
        isOpen={ModalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <AddTransactionModal
          ModalIsOpen={ModalIsOpen}
          closeModal={closeModal}
          editMode={editMode}
          editTransactionData={editTransactionData}
        />
      </ReactModal>
    </div>
  );
};

export { IncomeTracker };
