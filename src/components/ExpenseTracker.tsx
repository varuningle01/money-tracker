import { useMemo } from "react";
import { useTransactionContext } from "../context/TransactionContext";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import "./ExpenseTracker.css";
import { ExpenseConstants } from "../constants";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { ConfirmationDialog } from "../utils/ConfirmationDialogBox";
import { AddTransactionModal } from "./AddTransactionModal";
import ReactModal from "react-modal";
import {
  calculateTotalIncome,
  deleteTransactionData,
  filteringData,
} from "../utils/Formatting";
import { mockTransactions } from "../data/mockTransactionData";

type ExpenseData = {
  _id: string;
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemAmount: number;
  itemText: string;
};

const ExpenseTracker = () => {
  const [ModalIsOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTransactionData, setEditTransactionData] =
    useState<ExpenseData | null>(null);
  const { state, dispatch } = useTransactionContext();
  const { expenseData, selectedDate, incomeData } = state;
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
    () => filteringData(expenseData, selectedDate),
    [expenseData, selectedDate]
  );
  console.log(filteredData);

  const totalexpense = useMemo(
    () => calculateTotalIncome(filteredData),
    [expenseData, selectedDate]
  );
  const fetchTransactionData = async () => {
    try {
      const response = localStorage.getItem("transactions");
      if (response?.length) {
        const parsedTransactions = JSON.parse(response);
        console.log(parsedTransactions);
        const expenseData = parsedTransactions.filter(
          (txn: ExpenseData) => txn.moneyCategory === "expense"
        );
        console.log(expenseData);
        dispatch({ type: "SET_EXPENSE_DATA", payload: expenseData });
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
      <h2 className="text-center">{ExpenseConstants.ExpenseTitle}</h2>
      <div className="d-flex justify-content-evenly">
        <p>{ExpenseConstants.TotalExpenseText}</p>
        <p>
          {ExpenseConstants.Currency}
          {totalexpense}
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
              ...expenseData,
              ...incomeData,
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

export { ExpenseTracker };
