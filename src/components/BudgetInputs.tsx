import type {ChangeEvent} from "react";
import {Grid, Stack, Paper, TextField, Typography} from "@mui/material";

type BudgetInputsProps = {
    income: number | null;
    savingsGoal: number | null;
    onIncomeChange: (value: number | null) => void;
    onSavingsGoalChange: (value: number | null) => void;
};

const parseNumberInput = (value: string) => {
    if (value === "") return null;

    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) return null;
    return parsedValue;
};

export const BudgetInputs = ({income, savingsGoal, onIncomeChange, onSavingsGoalChange,}: BudgetInputsProps) => {
    const handleIncomeChange = (event: ChangeEvent<HTMLInputElement>) => {
        onIncomeChange(parseNumberInput(event.target.value));
    };

    const handleSavingsGoalChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSavingsGoalChange(parseNumberInput(event.target.value));
    };

    return (
        <Paper sx={{p: 2, borderRadius: 3, boxShadow: "var(--shadow)"}}>
            <Grid container spacing={2}>
                <Grid size={{xs: 12, sm: 6}}>
                    <Stack spacing={1}>
                        <Typography component="label" htmlFor="monthly-income" sx={{fontSize: 14, fontWeight: 500, color: "text.primary",}} >
                            Monthly income
                        </Typography>
                        <TextField 
                            id="monthly-income" 
                            fullWidth variant="outlined" 
                            type='number'
                            slotProps={{ htmlInput: { min: 0 } }}
                            size="small" 
                            placeholder="0" 
                            value={income ?? ""} 
                            onChange={handleIncomeChange}/>
                    </Stack>
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <Stack spacing={1}>
                        <Typography component="label" htmlFor="savings-goal" sx={{fontSize: 14, fontWeight: 500, color: "text.primary",}} >
                            Savings goal
                        </Typography>
                        <TextField 
                            id="savings-goal" 
                            fullWidth 
                            variant="outlined" 
                            type='number' 
                            slotProps={{ htmlInput: { min: 0 } }}
                            size="small" 
                            placeholder="0" 
                            value={savingsGoal ?? ""} 
                            onChange={handleSavingsGoalChange}/>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};
