import React, { createContext, useContext, useReducer } from "react";
import {
  TransactionState,
  TransactionStateType,
} from "../state/TransactionState";
import { TransactionActionType, TransactionReducer } from "../reducer/Reducer";

type TransactionContextType = {
  state: TransactionStateType;
  dispatch: React.Dispatch<TransactionActionType>;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useMoneyContext must be used within a MoneyProvider");
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(TransactionReducer, TransactionState);

  return (
    <TransactionContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
