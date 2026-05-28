import type {ChangeEvent} from 'react';
import {Stack, TextField, Typography} from "@mui/material";

type TExpenseInputProps = {
    expenseId: string,
    expenseLabel: string;
    expenseValue: string;
    onExpenseChange: (value: string) => void;
    expenseType?: string;
    expensePlaceholder?:string;
    error?: boolean;
    helperText?: string;
}

export const ExpenseInput = ({expenseId, expenseLabel, expenseValue, onExpenseChange, expenseType, expensePlaceholder, error, helperText } : TExpenseInputProps) => {

    const handleExpenseChange =(event: ChangeEvent<HTMLInputElement>) => {
        onExpenseChange(event.target.value)
    }

    return (
        <Stack spacing={1}>
            <Typography component="label" htmlFor={expenseId} sx={{fontSize: 14, fontWeight: 500, color: "text.primary",}} >
                {expenseLabel}
            </Typography>
            <TextField id={expenseId} fullWidth variant="outlined" type={expenseType} placeholder={expensePlaceholder} size="small" value={expenseValue ?? ""} onChange={handleExpenseChange} error={error} helperText={helperText} sx={{'& .MuiOutlinedInput-root': {borderRadius:'16px'}}}/>
        </Stack>
    );
};
