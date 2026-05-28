import {Box, MenuItem, Stack, Typography, FormControl} from "@mui/material";
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { expenseCategories } from '@/constants/expenseCategories';

type CategoryDropDownProps = {
    categoryLabel: string,
    categoryValue: string;
    onCategoryChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
};

export const CategoryDropDown = ({ categoryLabel, categoryValue, onCategoryChange, error, helperText }: CategoryDropDownProps) => {

   const selectedCategory = expenseCategories.find((category) => category.value === categoryValue);

    const handleCategoryChange =(e: SelectChangeEvent) => {
       onCategoryChange( e.target.value);
   }

    return (
        <Stack spacing={1}>
            <Typography component="label" htmlFor="expense-categories" sx={{fontSize: 14, fontWeight: 500, color: "var( --color-text-main)",}} >
                {categoryLabel}
            </Typography>
            <FormControl fullWidth error={error}>
                <Select
                    id="expense-categories"
                    value={categoryValue} onChange={handleCategoryChange}
                    sx={{height: 42, borderRadius: "16px",}}
                    displayEmpty
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
                {helperText && <Typography variant="caption" color="error">{helperText}</Typography>}
            </FormControl>
        </Stack>
    );
};

