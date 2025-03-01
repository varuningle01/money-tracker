import { useState, useEffect } from "react";
import { IncomeCategory, ExpenseCategory } from "../data";
import { useTransactionContext } from "../context/TransactionContext";
import { AddMoneyModalConstants } from "../constants";
import { MdClose } from "react-icons/md";

type ExpenseData = {
  _id: string;
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemText: string;
  itemAmount: number;
};
type ModalProps = {
  ModalIsOpen: boolean;
  closeModal: () => void;
  editMode: boolean;
  editTransactionData: ExpenseData | null;
};

const AddTransactionModal = ({
  ModalIsOpen,
  closeModal,
  editMode,
  editTransactionData,
}: ModalProps) => {
  const { state } = useTransactionContext();
  const { selectedDate } = state;

  const [moneyCategory, setMoneyCategory] = useState("income");
  const [formData, setFormData] = useState({
    itemEntryDate: selectedDate,
    itemCategory: "",
    itemText: "",
    itemAmount: 0,
  });

  const handleIncomeCategory: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setMoneyCategory("income");
  };

  const handleExpenseCategory: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    setMoneyCategory("expense");
  };

  const handleItemCategory: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setFormData({ ...formData, itemCategory: e.target.value });
  };

  const handleItemText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, itemText: e.target.value });
  };

  const handleItemAmount: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const amount = parseFloat(e.target.value);
    setFormData({ ...formData, itemAmount: amount });
  };

  useEffect(() => {
    if (editMode && editTransactionData) {
      setMoneyCategory(editTransactionData.moneyCategory);
      setFormData({
        itemEntryDate: selectedDate,
        itemCategory: editTransactionData.itemCategory,
        itemText: editTransactionData.itemText,
        itemAmount: editTransactionData.itemAmount,
      });
    } else {
      setMoneyCategory("income");
      setFormData({
        itemEntryDate: selectedDate,
        itemCategory: "",
        itemText: "",
        itemAmount: 0,
      });
    }
  }, [editMode, editTransactionData, selectedDate]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const newItem = {
      _id: crypto.randomUUID(),
      moneyCategory: moneyCategory,
      itemEntryDate: formData.itemEntryDate,
      itemCategory: formData.itemCategory,
      itemText: formData.itemText,
      itemAmount: formData.itemAmount,
    };

    try {
      let updatedTransactions = [];
      if (editMode && editTransactionData) {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions);
          updatedTransactions = parsedTransactions.map((txn: any) =>
            txn._id === editTransactionData._id
              ? { ...newItem, _id: txn._id }
              : txn
          );
        }
        localStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );
        window.dispatchEvent(new CustomEvent("Transactions Updated"));
      } else {
        const transactions = localStorage.getItem("transactions");
        if (transactions) {
          const updatedTransactions = [...JSON.parse(transactions), newItem];
          localStorage.setItem(
            "transactions",
            JSON.stringify(updatedTransactions)
          );
          window.dispatchEvent(new CustomEvent("Transactions Updated"));
        } else {
          localStorage.setItem("transactions", JSON.stringify([newItem]));
          window.dispatchEvent(new CustomEvent("Transactions Updated"));
        }
      }
    } catch (error) {
      console.log(error);
      console.error("An Error occurred: ", error);
    }

    setFormData({
      itemEntryDate: selectedDate,
      itemCategory: "",
      itemText: "",
      itemAmount: 0,
    });
    closeModal();
  };

  return (
    <div
      className={`container-fluid mx-auto text-center ${
        ModalIsOpen ? "d-block" : "d-none"
      }`}
    >
      <span className="d-flex justify-content-end">
        <MdClose onClick={closeModal} fontSize={25} />
      </span>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center">
          <button
            className={
              moneyCategory === "income"
                ? "btn border border-dark me-3 bg-dark text-white"
                : "btn border border-dark me-3"
            }
            onClick={handleIncomeCategory}
          >
            {AddMoneyModalConstants.IncomeTitle}
          </button>
          <button
            className={
              moneyCategory === "expense"
                ? "btn border border-dark bg-dark text-white"
                : "btn border border-dark"
            }
            onClick={handleExpenseCategory}
          >
            {AddMoneyModalConstants.ExpenseTitle}
          </button>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <select
            className="form-control border border-dark me-3"
            aria-label="Default select example"
            value={formData.itemCategory}
            onChange={handleItemCategory}
          >
            <option>{AddMoneyModalConstants.Select_Category}</option>
            {moneyCategory === "income"
              ? IncomeCategory.map((element, index) => {
                  return (
                    <option key={element.id} value={element.category_name}>
                      {element.category_icon}
                      {element.category_name}
                    </option>
                  );
                })
              : ExpenseCategory.map((element, index) => {
                  return (
                    <option key={element.id} value={element.category_name}>
                      <div>
                        <span className="me-5">{element.category_icon}</span>
                        <span>{element.category_name}</span>
                      </div>
                    </option>
                  );
                })}
          </select>
          <input
            className="form-control border border-dark me-3"
            type="text"
            placeholder="Enter text"
            onChange={handleItemText}
            value={formData.itemText}
          ></input>
          <input
            className="form-control border border-dark"
            type="number"
            placeholder="Enter Amount"
            onChange={handleItemAmount}
            value={formData.itemAmount}
          ></input>
        </div>
        <button type="submit" className="btn border border-dark mt-3">
          {editMode
            ? AddMoneyModalConstants.Update_Button
            : AddMoneyModalConstants.Submit_Button}
        </button>
      </form>
    </div>
  );
};

export { AddTransactionModal };
