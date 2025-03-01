import { useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useTransactionContext } from "../context/TransactionContext";
import { Pie } from "react-chartjs-2";
import "./ChartAnalysis.css";
import { MdLaunch } from "react-icons/md";
import { ChartAnalysisConstants } from "../constants";
import ReactModal from "react-modal";
import ChartAnalysisModal from "./ChartAnalysisModal";
import { filteringData } from "../utils/Formatting";

Chart.register(CategoryScale);
type ExpenseData = {
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemText: string;
  itemAmount: number;
};
type IncomeData = {
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemAmount: number;
};

const ChartAnalysis = () => {
  const [ModalIsOpen, setIsOpen] = useState(false);
  const [chartCategory, setChartCategory] = useState("expense");
  const { state } = useTransactionContext();
  const { expenseData, selectedDate, incomeData } = state;
  const [filteredExpenseData, setFilteredExpenseData] = useState<ExpenseData[]>(
    []
  );
  const [filteredIncomeData, setFilteredIncomeData] = useState<IncomeData[]>(
    []
  );

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const filteredExpenseDataMemo = useMemo(
    () => filteringData(expenseData, selectedDate),
    [expenseData, selectedDate]
  );
  const filteredIncomeDataMemo = useMemo(
    () => filteringData(incomeData, selectedDate),
    [incomeData, selectedDate]
  );

  function getRGBColor(index: number) {
    const red = Math.floor((index + 10) * 30) % 256;
    const green = Math.floor((index + 10) * 70) % 256;
    const blue = Math.floor((index + 10) * 100) % 256;
    return `${red}, ${green}, ${blue}, 1`;
  }

  const customStyles = {
    content: {
      fontFamily: "Yatra One",
    },
  };

  const ExpenseCategoryTotalAmounts: { [key: string]: number } =
    filteredExpenseDataMemo.reduce((totals, { itemCategory, itemAmount }) => {
      if (totals[itemCategory]) {
        totals[itemCategory] += itemAmount;
      } else {
        totals[itemCategory] = itemAmount;
      }

      return totals;
    }, {} as { [key: string]: number });

  const IncomeCategoryTotalAmounts: { [key: string]: number } =
    filteredIncomeDataMemo.reduce((totals, { itemCategory, itemAmount }) => {
      if (totals[itemCategory]) {
        totals[itemCategory] += itemAmount;
      } else {
        totals[itemCategory] = itemAmount;
      }

      return totals;
    }, {} as { [key: string]: number });

  const chartData = {
    labels:
      chartCategory === "expense"
        ? Object.keys(ExpenseCategoryTotalAmounts)
        : Object.keys(IncomeCategoryTotalAmounts),
    datasets: [
      {
        label: chartCategory === "expense" ? "Expense" : "Income",
        data:
          chartCategory === "expense"
            ? Object.values(ExpenseCategoryTotalAmounts)
            : Object.values(IncomeCategoryTotalAmounts),
        backgroundColor:
          chartCategory === "expense"
            ? Object.keys(ExpenseCategoryTotalAmounts).map(
                (category, index) => `rgba(${getRGBColor(index)})`
              )
            : Object.keys(IncomeCategoryTotalAmounts).map(
                (category, index) => `rgba(${getRGBColor(index)})`
              ),
        radius: 100,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text:
          chartCategory === "expense"
            ? "Expenses by Category"
            : "Income by Category",
      },
    },
  };

  return (
    <div className="chart container-fluid border border-dark">
      <div className="d-flex justify-content-end align-items-center">
        <h2 className="ms-4 mt-2">
          {ChartAnalysisConstants.ChartAnalysisTitle}
        </h2>
        <div className="btn-group ms-4">
          <button
            className={
              chartCategory === "income"
                ? "btn border border-dark bg-dark text-white"
                : "btn border border-dark"
            }
            onClick={() => setChartCategory("income")}
          >
            {ChartAnalysisConstants.IncomeButton}
          </button>
          <button
            className={
              chartCategory === "expense"
                ? "btn border border-dark bg-dark text-white"
                : "btn border border-dark"
            }
            onClick={() => setChartCategory("expense")}
          >
            {ChartAnalysisConstants.Expensebutton}
          </button>
        </div>
      </div>
      <div className="container">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};
export { ChartAnalysis };
