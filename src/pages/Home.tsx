import  { useState, useCallback } from "react";
import {BudgetInputs} from "@/components/BudgetInputs.tsx";
import {HeroIntro} from "@/components/HeroIntro.tsx";
import {SummaryCard, } from "@/components/SummaryCard";
import {CategoryDropDown} from "@/components/CategoryDropDown";
import {ExpenseInput} from "@/components/ExpenseInput";
import {ExpensesTable,  type TExpense} from "@/components/ExpensesTable";
import {MonthlySummary} from "@/components/MonthlySummary";
import {BudgetLinearProgress} from "@/components/BudgetLinearProgress";
import {DashboardCard} from "@/components/DashboardCard";

import {formatCurrency} from '@/utils/formatCurrency'
import {useBudgetOverview} from "@/hooks/useBudgetOverview.tsx";
import {expenseCategories} from "@/constants/expenseCategories";

import { Container, Grid, Typography, Button, Box } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { v4 as uuid4 } from "uuid";

export const Home = () => {
    //const [budgetData, setBudgetData] = useLocalStorage<TBudgetData>('budget-tracker', defaultBudgetData);
    const [formExpenses, setFormExpenses] = useState<TExpense>({id: "", category: null, name: null, amount: null});
    const [formErrors, setFormErrors] = useState<{category:boolean; amount: boolean}>({category: false, amount: false});
    const {
        budgetData,
        setBudgetData,
        monthlyExpenses,
        balance,
        displayedExpensesPercentage,
        displayedBalancePercentage,
        expensesProgressValue,
        reserveProgressValue,
        categoryProgressOverview,
        kpiData,
        clampProgressValue,
    } = useBudgetOverview();

    const validate = (): boolean => {
    const errors = {
        category: !formExpenses.category,
        amount: !formExpenses.amount || formExpenses.amount <= 0,
    };
    
    setFormErrors(errors);
    return !errors.category && !errors.amount;
    };

    const handleMonthlyIncome = useCallback((value: number | null)=> {
        setBudgetData((prev) => ({ ...prev, monthlyIncome: value }));
    },[setBudgetData]);

    const handleSavingsGoal = useCallback((value: number | null) => {
        setBudgetData((prev) => ({ ...prev, savingsGoal: value }));
    },[setBudgetData])

    const handleCategoryChange = useCallback((category: string) => {
        setFormExpenses((prev) => ({ ...prev, category }));
    },[]);

    const handleNameChange = useCallback((name: string) => {
        setFormExpenses((prev) => ({ ...prev, name: name }));
    },[]);

    const handleAmountChange = useCallback((amount: string | number) => {
        setFormExpenses((prev) => ({ ...prev, amount: Number(amount) }));
    },[]);

    const handleAddFormExpenses = useCallback(() => {
        if (!validate()) return;

        setBudgetData((prev) => ({
            ...prev,
            expenses: [...prev.expenses, { ...formExpenses, id: uuid4() }],
        }));
 
        setFormExpenses({ id: "", category: null, name: null, amount: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formExpenses, setBudgetData]);

    const handleDeleteExpense = useCallback((expenseId: string) => {
        setBudgetData((prev) => ({
            ...prev,
            expenses: prev.expenses.filter((expense) => expense.id !== expenseId ) 
        }));
    }, [setBudgetData]);

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
                    <DashboardCard>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>List of expenses</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            Manage and track all monthly household items.
                        </Typography>
                        <ExpensesTable
                            expenses={budgetData.expenses}
                            onDeleteExpense={handleDeleteExpense}
                        />
                    </DashboardCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                    <DashboardCard>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Add expense</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A new item is immediately included in the overview.
                        </Typography>
                        <Grid sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <CategoryDropDown categoryLabel='Category' categoryValue={formExpenses.category ?? ""} error={formErrors.category} helperText={formErrors.category ? 'Category is required' : ''} onCategoryChange={handleCategoryChange}/>
                            <ExpenseInput expenseId='item-name' expenseLabel='Item name' expensePlaceholder='e.g. Food' expenseValue={formExpenses.name ?? ""} expenseType = 'text' onExpenseChange={handleNameChange}/>
                            <ExpenseInput expenseId='item-amount' expenseLabel='Amount in €' expensePlaceholder='0' expenseValue={formExpenses.amount !== null ? String(formExpenses.amount) : ""} expenseType = 'number' error={formErrors.amount} helperText={formErrors.amount ? 'Amount must be greater than 0' : ''} onExpenseChange={handleAmountChange}/>
                            <Button
                                variant='contained'
                                startIcon={<AddOutlinedIcon sx={{color: 'var(--color-white)'}}/>}
                                sx={{backgroundColor: 'var(--color-primary)', borderRadius: '16px'}}
                                onClick={handleAddFormExpenses}
                            >
                                Add Item
                            </Button>
                        </Grid>
                    </DashboardCard>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{mt: 3, alignItems: 'stretch' }} >
                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <DashboardCard>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Budget usage</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A percentage view of how much of income is already covered by expenses.
                        </Typography>
                        <Grid sx={{mb:2}}>
                            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mb:1}}>
                                <Typography variant='body2' sx={{color:'var(--color-text-secondary)', fontWeight: 500,}}>Expenses</Typography>
                                <Typography variant='body2' sx={{color:'var(--color-text-secondary)', fontWeight: 500,}}>{displayedExpensesPercentage}%</Typography>
                            </Box>
                            <BudgetLinearProgress progressValue={expensesProgressValue}/>
                        </Grid>
                        <Grid sx={{mb:4}}>
                            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mb:1}}>
                                <Typography variant='body2' sx={{color:'var(--color-text-secondary)', fontWeight: 500,}}>Available reserve</Typography>
                                <Typography variant='body2' sx={{color:'var(--color-text-secondary)', fontWeight: 500,}}>{displayedBalancePercentage}%</Typography>
                            </Box>
                            <BudgetLinearProgress progressValue={reserveProgressValue}/>
                        </Grid>
                        <Box sx={{backgroundColor:'var(--color-bg-soft)', px: 2, py:1, borderRadius: 3, }}>
                            The budget is currently {balance > 0 ? <strong>in surplus</strong> : <strong>in deficit</strong>}.
                            {balance >= 0
                                ? <> After covering all expenses, {formatCurrency(balance)} remains.</>
                                : <> Expenses exceed income by {formatCurrency(Math.abs(balance))}.</>}
                        </Box>
                    </DashboardCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <DashboardCard>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Breakdown by category</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            A simple overview without an external chart library
                        </Typography>
                        {categoryProgressOverview.map((item) => {
                            const category = expenseCategories.find(
                                (category) => category.value === item.category
                            );

                            const Icon = category?.Icon;
                            return (
                                <Grid key={item.category} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, }} >
                                        <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: 1,}} >
                                            {Icon && <Icon fontSize="small" />}
                                            {category?.label ?? item.category}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", fontWeight: 500 }} >
                                            {item.percentage}%
                                        </Typography>
                                    </Box>
                                    <BudgetLinearProgress progressValue={clampProgressValue(item.percentage)} />
                                </Grid>
                            );
                        })}
                    </DashboardCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4, }} sx={{ display: 'flex' }}>
                    <DashboardCard>
                        <Typography variant="h6" sx={{color:'var(--color-text-main)', fontWeight: 600}}>Summary</Typography>
                        <Typography variant="body2" sx={{color: 'var(--color-text-secondary)', mb:2}}>
                            The most important data for the current month.
                        </Typography>
                        <MonthlySummary totalIncome={budgetData.monthlyIncome ?? 0} totalExpenses={monthlyExpenses} monthlyBalance={balance} savingsGoal={budgetData.savingsGoal ?? 0} />
                    </DashboardCard>
                </Grid>

            </Grid>
        </Container>
    );
};
