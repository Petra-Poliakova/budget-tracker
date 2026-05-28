import type { SvgIconComponent } from "@mui/icons-material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

type ExpenseCategory = {
    id: number;
    label: string;
    value: string;
    Icon: SvgIconComponent;
};

export const expenseCategories : ExpenseCategory[] = [
    {id: 1, label:"Housing", value: "housing", Icon: HomeOutlinedIcon},
    {id: 2, label:"Groceries", value:"groceries", Icon: ShoppingCartOutlinedIcon},
    {id: 3, label:"Transport", value:"transport", Icon: DirectionsCarOutlinedIcon},
    {id: 4, label:"Health", value:"health", Icon: LocalHospitalOutlinedIcon},
    {id: 5, label:"Restaurants", value:"restaurants", Icon: RestaurantOutlinedIcon},
    {id: 6, label:"Entertainment", value:"entertainment", Icon: MovieOutlinedIcon},
    {id: 7, label:"Utilities", value:"utilities", Icon: BoltOutlinedIcon },
    {id: 8, label:"Other", value:"other", Icon: MoreHorizOutlinedIcon},
];