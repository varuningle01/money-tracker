import { format } from "date-fns";
import { ExpenseData, IncomeData } from "../state/TransactionState";

export const filteringData = (
  data: IncomeData[] | ExpenseData[],
  selectedDate: Date
) => {
  const filteredData = data.filter((element) => {
    return (
      format(new Date(element.itemEntryDate), "dd/MM/yyyy") ===
      format(selectedDate, "dd/MM/yyyy")
    );
  });
  return filteredData;
};

export const calculateTotalIncome = (
  filteredData: IncomeData[] | ExpenseData[]
) => {
  let total = 0;
  filteredData.forEach((ele) => {
    total = total + Number(ele.itemAmount);
  });
  return total;
};

export const deleteTransactionData = (
  transactionId: string,
  data: IncomeData[] | ExpenseData[]
) => {
  try {
    const updatedTransactions = data.filter((txn) => txn._id !== transactionId);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    window.dispatchEvent(new CustomEvent("Transactions Updated"));
  } catch (error) {
    console.error("Errror deleting transaction");
  }
};
