import {Box, MenuItem, Stack, Typography, FormControl} from "@mui/material";
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { expenseCategories } from '@/constants/expenseCategories';

// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
// import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
// import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
// import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
// import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
// import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

type CategoryDropDownProps = {
    categoryLabel: string,
    categoryValue: string;
    onCategoryChange: (value: string) => void;
};

export const CategoryDropDown = ({ categoryLabel, categoryValue, onCategoryChange }: CategoryDropDownProps) => {

// const expenseCategories = [
//         {id: 1, label:"Housing", value: "housing", icon: <HomeOutlinedIcon fontSize="small" />},
//         {id: 2, label:"Groceries", value:"groceries",icon: <ShoppingCartOutlinedIcon fontSize="small" />},
//         {id: 3, label:"Transport", value:"transport", icon: <DirectionsCarOutlinedIcon fontSize="small" />},
//         {id: 4, label:"Health", value:"health", icon: <LocalHospitalOutlinedIcon fontSize="small" />},
//         {id: 5, label:"Restaurants", value:"restaurants", icon: <RestaurantOutlinedIcon fontSize="small" />},
//         {id: 6, label:"Entertainment", value:"entertainment", icon: <MovieOutlinedIcon fontSize="small" />},
//         {id: 7, label:"Utilities", value:"utilities", icon: <BoltOutlinedIcon fontSize="small" /> },
//         {id: 8, label:"Other", value:"other", icon: <MoreHorizOutlinedIcon fontSize="small" />},
//     ];

   const selectedCategory = expenseCategories.find((category) => category.value === categoryValue);
   //const Icon = selectedCategory?.Icon

    const handleCategoryChange =(e: SelectChangeEvent) => {
       onCategoryChange( e.target.value);
   }

    return (
        <Stack spacing={1}>
            <Typography component="label" htmlFor="expense-categories" sx={{fontSize: 14, fontWeight: 500, color: "var( --color-text-main)",}} >
                {categoryLabel}
            </Typography>
            <FormControl fullWidth>
                <Select
                    id="expense-categories"
                    value={categoryValue} onChange={handleCategoryChange}
                    sx={{height: 42, borderRadius: "16px",}}
                    displayEmpty
                    //renderValue={(selected) => { if (selected.length === 0) { return <em>Select category</em>; } return expenseCategories.find((category) => category.value === selected)?.label; }}
                    renderValue={ () => {
                        if(!selectedCategory) {
                            return <em>Select category</em>;
                        }
                        const Icon = selectedCategory.Icon
                        return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                 <Icon fontSize="small" />
                                <span>{selectedCategory.label}</span>
                            </Box>
                        );
                    } }
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="" disabled><em>Select category</em></MenuItem>
                    {expenseCategories.map(category => {
                        const Icon = category.Icon;
                        return (
                            <MenuItem key={category.id} value={category.value}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Icon fontSize="small" />
                                    <span>{category.label}</span>
                                </Box>
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Stack>
    );
};

