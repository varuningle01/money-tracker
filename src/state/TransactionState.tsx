export type IncomeData = {
  _id: string;
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemAmount: number;
  itemText: string;
};
export type ExpenseData = {
  _id: string;
  itemEntryDate: string;
  moneyCategory: string;
  itemCategory: string;
  itemAmount: number;
  itemText: string;
};

export type TransactionStateType = {
  incomeData: IncomeData[];
  expenseData: ExpenseData[];
  selectedDate: Date;
};

export const TransactionState: TransactionStateType = {
  incomeData: [],
  expenseData: [],
  selectedDate: new Date(),
};
