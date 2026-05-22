import  { useState } from "react";
import {BudgetInputs} from "@/components/BudgetInputs.tsx";
import {HeroIntro} from "@/components/HeroIntro.tsx";
import {SummaryCard, type TSummaryCardProps} from "@/components/SummaryCard";
import {CategoryDropDown} from "@/components/CategoryDropDown";
import {ExpenseInput} from "@/components/ExpenseInput";
import {ExpensesTable,  type TExpense} from "@/components/ExpensesTable";
import {MonthlySummary} from "@/components/MonthlySummary";
import {BudgetLinearProgress} from "@/components/BudgetLinearProgress";

import {formatCurrency} from '@/utils/formatCurrency'
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Container, Grid, Paper, Typography, Button, } from "@mui/material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { v4 as uuid4 } from "uuid";

import "./Home.scss";

type TBudgetData = {
    monthlyIncome: number | null;
    savingsGoal: number | null;
    expenses: TExpense[];
}

const defaultBudgetData: TBudgetData = {
    monthlyIncome: null,
    savingsGoal: null,
    expenses: [],
};

export const Home = () => {
    const [budgetData, setBudgetData] = useLocalStorage<TBudgetData>('budget-tracker', defaultBudgetData);
    const [formExpenses, setFormExpenses] = useState<TExpense>({id: "", category: null, name: null, amount: null});
    const [formErrors, setFormErrors] = useState<{category:boolean; amount: boolean}>({category: false, amount: false});

    const monthlyIncome = budgetData.monthlyIncome ?? 0;
    const savingsGoal = budgetData.savingsGoal ?? 0;
    const monthlyExpenses = budgetData.expenses.reduce((total, expense) => {
        return total + Number(expense.amount ?? 0);
    }, 0);
    const balance = monthlyIncome - monthlyExpenses;
    const afterSavingsGoal = balance - savingsGoal;
    const monthlyExpensesPercentage = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;

    const kpiData : TSummaryCardProps[] = [
        {
            title: "Monthly Income",
            value: formatCurrency(budgetData.monthlyIncome ?? 0),
            description: "Total household income",
            icon: <BusinessCenterIcon sx={{color:'var(--color-primary)'}}/>
        },
        {
            title: "Monthly Expenses",
            value: formatCurrency(monthlyExpenses),
            description: `${monthlyExpensesPercentage.toFixed(0)}% of income`,
            icon: <TrendingDownIcon sx={{color:'var(--color-primary)'}}/>
        },
        {
            title: "Balance",
            value: formatCurrency(balance),
            description: "Amount left after expenses",
            icon: <TrendingUpIcon sx={{color:'var(--color-primary)'}}/>
        },
        {
            title: "After Savings Goal",
            value: formatCurrency(afterSavingsGoal),
            description: "Balance after setting savings aside",
            icon: <SavingsOutlinedIcon sx={{color:'var(--color-primary)'}}/>
        },
    ]

    const validate = (): boolean => {
    const errors = {
        category: !formExpenses.category,
        amount: !formExpenses.amount || formExpenses.amount <= 0,
    };
    
    setFormErrors(errors);
    return !errors.category && !errors.amount;
};

    const handleMonthlyIncome = (monthlyIncome: number | null)=> {
        setBudgetData((currentData) => ({
            ...currentData,
            monthlyIncome,
        }));
    }

    const handleSavingsGoal = (savingsGoal: number | null) => {
        setBudgetData((currentData) => ({
            ...currentData,
            savingsGoal,
        }));
    }

    const handleCategoryChange = (category: string) => {
        setFormExpenses((currentData) => ({
            ...currentData, category
        }));
    };

    const handleNameChange = (name: string | number) => {
        setFormExpenses((currentData) => ({
            ...currentData, name: typeof name === 'string' ? name : String(name)
        }));
    }

    const handleAmountChange = (amount: string | number) => {
        setFormExpenses((currentData) => ({
            ...currentData, amount: typeof amount === 'string' ? Number(amount) : amount
        }));
    }

    const handleAddFormExpenses = () => {
        if (!validate()) return;

        const newExpenses: TExpense = {
            id: uuid4(),
            category: formExpenses.category,
            name: formExpenses.name,
            amount: formExpenses.amount,
        }

        setBudgetData((currentData) => ({
            ...currentData,
            expenses: [...currentData.expenses, newExpenses]
        }));

        setFormExpenses({
            id: "",
            category: null,
            name: null,
            amount: null,
        })
    }

    const handleDeleteExpense = (expenseId: string) => {
        setBudgetData((prevBudgetData) => ({
            ...prevBudgetData,
            expenses: prevBudgetData.expenses.filter(
                (expense) => expense.id !== expenseId
            )
        }))
    }

    return (
        <Container maxWidth="xl" sx={{mb:2}}>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 6}}>
                    <HeroIntro/>
                </Grid>

                <Grid size={{xs: 12, md: 6}}>
                    <BudgetInputs
                        income={budgetData.monthlyIncome}
                        savingsGoal={budgetData.savingsGoal}
                        onIncomeChange={handleMonthlyIncome}
                        onSavingsGoalChange={handleSavingsGoal}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
                {kpiData.map((i) => (
                    <Grid key={i.title} size={{xs: 12, md: 6, lg: 3}} sx={{ display: 'flex', minWidth: 0 }} >
                        <SummaryCard title={i.title} value={i.value} description={i.description} icon={i.icon}/>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minWidth: 0 }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>List of expenses</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            Manage and track all monthly household items.
                        </Typography>
                        <ExpensesTable
                            expenses={budgetData.expenses}
                            onDeleteExpense={handleDeleteExpense}
                        />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Add expense</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A new item is immediately included in the overview.
                        </Typography>
                        <Grid sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <CategoryDropDown categoryLabel='Category' categoryValue={formExpenses.category ?? ""} error={formErrors.category} helperText={formErrors.category ? 'Category is required' : ''} onCategoryChange={handleCategoryChange}/>
                            <ExpenseInput expenseId='item-name' expenseLabel='Item name' expensePlaceholder='e.g. Food' expenseValue={formExpenses.name ?? ""} expenseType = 'text' onExpenseChange={handleNameChange}/>
                            <ExpenseInput expenseId='item-amount' expenseLabel='Amount in €' expensePlaceholder='0' expenseValue={formExpenses.amount ?? ""} expenseType = 'number' error={formErrors.amount} helperText={formErrors.amount ? 'Amount must be greater than 0' : ''} onExpenseChange={handleAmountChange}/>
                            <Button
                                variant='contained'
                                startIcon={<AddOutlinedIcon sx={{color: 'var(--color-white)'}}/>}
                                sx={{backgroundColor: 'var(--color-primary)', borderRadius: '16px'}}
                                onClick={handleAddFormExpenses}
                            >
                                Add Item
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Budget usage</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A percentage view of how much of income is already covered by expenses.
                        </Typography>
                        <BudgetLinearProgress progressValue={61}/>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Breakdown by category</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A simple overview without an external chart library
                        </Typography>

                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Summary</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            The most important data for the current month.
                        </Typography>
                        <MonthlySummary totalIncome={formatCurrency(budgetData.monthlyIncome ?? 0)} totalExpenses={formatCurrency(monthlyExpenses)} monthlyBalance={formatCurrency(balance)} savingsGoal={formatCurrency(budgetData.savingsGoal ?? 0)} />
                    </Paper>
                </Grid>

            </Grid>
        </Container>
    );
};
