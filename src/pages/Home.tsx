import  { useState } from "react";
import {BudgetInputs} from "@/components/BudgetInputs.tsx";
import {HeroIntro} from "@/components/HeroIntro.tsx";
import {SummaryCard, type TSummaryCardProps} from "@/components/SummaryCard";
import {CategoryDropDown} from "@/components/CategoryDropDown";
import {ExpenseInput} from "@/components/ExpenseInput"

import {formatCurrency} from '@/utils/formatCurrency'

import { useLocalStorage } from "@/hooks/useLocalStorage";

import {expenseCategories} from "@/constants/expenseCategories";

import { styled } from '@mui/material/styles';
import {Container, Grid, Paper, Typography, Table, TableContainer, TableBody, TableCell, tableCellClasses, TableHead, TableRow, Button} from "@mui/material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { v4 as uuidv4 } from "uuid";

import "./Home.scss";

type TExpenses ={
    id: string | null,
    category: string | null,
    name: string | null,
    amount: number | null,
}

type TBudgetData = {
    monthlyIncome: number | null;
    savingsGoal: number | null;
    expenses: TExpenses [];
}

const defaultBudgetData: TBudgetData = {
    monthlyIncome: 0,
    savingsGoal: 0,
    expenses: [],
};

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--color-table-head-bg)',
    },
}));

export const Home = () => {
    const [budgetData, setBudgetData] = useLocalStorage<TBudgetData>('budget-tracker', defaultBudgetData);
    const [formExpenses, setFormExpenses] = useState<TExpenses>({id: "", category: "", name: "", amount: 0})

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
            value: formatCurrency(budgetData.monthlyIncome),
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

    const handleMonthlyIncome = (monthlyIncome: number)=> {
        setBudgetData((currentData) => ({
            ...currentData,
            monthlyIncome,
        }));
    }

    const handleSavingsGoal = (savingsGoal: number) => {
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

    const handleNameChange = (name: string) => {
        setFormExpenses((currentData) => ({
            ...currentData, name
        }));
    }

    const handleAmountChange = (amount: number) => {
        setFormExpenses((currentData) => ({
            ...currentData, amount
        }));
    }

    const handleAddFormExpenses = () => {
        const newExpenses: TExpenses = {
            id: uuidv4(),
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
            category: "",
            name: "",
            amount: null,
        })
    }


    return (
        <Container maxWidth="xl">
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
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', minWidth: 0 }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>List of expenses</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            Manage and track all monthly household items.
                        </Typography>
                        <TableContainer sx={{ border:'1px solid var(--color-text-secondary)', borderRadius: 3, overflowX: 'auto', width:'100%'}}>
                            <Table sx={{ minWidth: 350 }} aria-label="expenses table">
                                <TableHead >
                                    <TableRow>
                                        <StyledTableCell>Category</StyledTableCell>
                                        <StyledTableCell>Item</StyledTableCell>
                                        <StyledTableCell>Amount</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {budgetData.expenses.map((expense)=> {
                                        const category = expenseCategories.find(
                                            (category) => category.value === expense.category
                                        );
                                        const Icon = category?.Icon
                                        return (
                                            <TableRow key={expense.id}>
                                            <TableCell> {Icon && <Icon fontSize="small" />} {category?.label ?? expense.category}</TableCell>
                                            <TableCell>{expense.name}</TableCell>
                                            <TableCell>{formatCurrency(expense.amount)}</TableCell>
                                            <TableCell><DeleteOutlinedIcon/></TableCell>
                                        </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Add expense</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A new item is immediately included in the overview.
                        </Typography>
                        <Grid sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <CategoryDropDown categoryLabel='Category' categoryValue={formExpenses.category ?? ""} onCategoryChange={handleCategoryChange}/>
                            <ExpenseInput expenseId='item-name' expenseLabel='Item name' expensePlaceholder='e.g. Food' expenseValue={formExpenses.name ?? ""} expenseType = 'text' onExpenseChange={handleNameChange}/>
                            <ExpenseInput expenseId='item-amount' expenseLabel='Amount in €' expenseValue={formExpenses.amount ?? ""} expenseType = 'number' onExpenseChange={handleAmountChange}/>
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

                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                    <Paper sx={{padding:2.5, borderRadius: 3, boxShadow: "var(--shadow)", height: "100%", width: "100%", minWidth: 0, boxSizing: "border-box"}}>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Summary</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            The most important data for the current month.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
