import { GiKnifeFork } from "react-icons/gi";
import { FaGasPump } from "react-icons/fa";
import { IoGiftSharp } from "react-icons/io5";
import { MdPhoneIphone } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { LuGamepad } from "react-icons/lu";
import { MdOutlineHealthAndSafety } from "react-icons/md";

export const ExpenseCategory = [
  {
    id: 1,
    category_icon: <GiKnifeFork />,
    category_name: "Food and Dining",
  },
  {
    id: 2,
    category_icon: <FaGasPump />,
    category_name: "Petrol/Gas",
  },
  {
    id: 3,
    category_icon: <IoGiftSharp />,
    category_name: "Gifts and Donations",
  },
  {
    id: 4,
    category_icon: <MdPhoneIphone />,
    category_name: "Mobile",
  },
  {
    id: 5,
    category_icon: <GiTakeMyMoney />,
    category_name: "Investment",
  },
  {
    id: 6,
    category_icon: <LuGamepad />,
    category_name: "Games",
  },
  {
    id: 7,
    category_icon: <MdOutlineHealthAndSafety />,
    category_name: "Personal Care",
  },
];
