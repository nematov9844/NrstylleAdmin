import { nanoid } from "nanoid";
import Umumiy from "../pages/Umumiy/Umumiy";
import Bloklangan from "../pages/Bloklangan/Bloklangan";
import Managerlar from "../pages/Managerlar/Managerlar";
import Employee from "../pages/home/Employee";
import Vazifalar from "../pages/Vazifalar/Vazifalar";
import Sozlamalar from "../pages/Sozlamalar/Sozlamalar";
import UserDetails from "../pages/UserDetails/UserDetails";

interface RouterType {
  component: React.FC;
  path?: string;
  id: string;
}

export const mainRoutes: RouterType[] = [
  {
    component: Umumiy,
    path: "umumiy",
    id: nanoid(),
  },
  {
    component: Bloklangan,
    path: "bloklangan",
    id: nanoid(),
  },
  {
    component: Managerlar,
    path: "managerlar",
    id: nanoid(),
  },
  {
    component: Employee,
    path: "employee",
    id: nanoid(),
  },
  {
    component: Vazifalar,
    path: "vazifalar",
    id: nanoid(),
  },
  {
    component: Sozlamalar,
    path: "sozlamalar",
    id: nanoid(),
  },
  {
    path: "user-details/:type/:id",
    component: UserDetails,
    id: nanoid(),
  },
];
