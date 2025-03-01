import {
  ExpenseData,
  IncomeData,
  TransactionStateType,
} from "../state/TransactionState";

export type TransactionActionType =
  | {
      type: "SET_INCOME_DATA";
      payload: IncomeData[];
    }
  | {
      type: "SET_EXPENSE_DATA";
      payload: ExpenseData[];
    }
  | {
      type: "SET_DATE";
      payload: Date;
    };

export const TransactionReducer = (
  state: TransactionStateType,
  action: TransactionActionType
) => {
  switch (action.type) {
    case "SET_INCOME_DATA": {
      return {
        ...state,
        incomeData: action.payload,
      };
    }
    case "SET_EXPENSE_DATA": {
      return {
        ...state,
        expenseData: action.payload,
      };
    }
    case "SET_DATE": {
      return {
        ...state,
        selectedDate: action.payload,
      };
    }
    default:
      return state;
  }
};
