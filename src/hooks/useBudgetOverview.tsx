import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage.ts";
import { formatCurrency } from "@/utils/formatCurrency";
import { expenseCategories } from "@/constants/expenseCategories";
import type { TExpense } from "@/components/ExpensesTable.tsx";
import type { TSummaryCardProps } from "@/components/SummaryCard";

import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

export type TBudgetData = {
    monthlyIncome: number | null;
    savingsGoal: number | null;
    expenses: TExpense[];
}

export const defaultBudgetData: TBudgetData = {
    monthlyIncome: null,
    savingsGoal: null,
    expenses: [],
};

const clampProgressValue = (value: number) => Math.min(Math.max(value, 0), 100);

export const useBudgetOverview = () => {
    const [budgetData, setBudgetData, removeBudgetData] = useLocalStorage<TBudgetData>('budget-tracker', defaultBudgetData);

    const monthlyIncome = budgetData.monthlyIncome ?? 0;
    const savingsGoal = budgetData.savingsGoal ?? 0;

    const monthlyExpenses = useMemo(() => {
        return budgetData.expenses.reduce((total, expense) => total + Number(expense.amount ?? 0), 0);
    },[budgetData.expenses])

    const balance = monthlyIncome - monthlyExpenses;
    const afterSavingsGoal = balance - savingsGoal;
    const monthlyExpensesPercentage = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
    const monthlyBalancePercentage = monthlyIncome > 0 ? (balance / monthlyIncome) * 100 : 0;

    const displayedExpensesPercentage = Number(monthlyExpensesPercentage.toFixed(1));
    const expensesProgressValue = clampProgressValue(displayedExpensesPercentage);

    const displayedBalancePercentage = Number(monthlyBalancePercentage.toFixed(1));
    const reserveProgressValue = clampProgressValue(displayedBalancePercentage);

    const categoryProgressOverview = useMemo(() => {
        return Object.values(
            budgetData.expenses.reduce< Record<string, { category: string; amount: number }>>((acc, expense) => {
                const category = expense.category ?? "Uncategorized";
                const amount = Number(expense.amount ?? 0);

                acc[category] ??= { category, amount: 0,  };
                acc[category].amount += amount;

                return acc;
            }, {})
        ).map((item) => {
            const category = expenseCategories.find(
                (expenseCategory) => expenseCategory.value === item.category
            );
            return {
                category: item.category,
                label: category?.label ?? item.category,
                Icon: category?.Icon,
                amount: item.amount,
                percentage: monthlyIncome > 0 ? Number(((item.amount / monthlyIncome) * 100).toFixed(1)) : 0,
        }
    }).sort((a, b) => b.percentage - a.percentage);
    },[budgetData.expenses, monthlyIncome])

    const kpiData : TSummaryCardProps[] = useMemo(() =>
        [
            {
                title: "Monthly Income",
                value: formatCurrency(monthlyIncome ?? 0),
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
        ],
        [monthlyIncome, monthlyExpenses, monthlyExpensesPercentage, balance, afterSavingsGoal]
    );

    return {
        budgetData,
        setBudgetData,
        removeBudgetData,

        monthlyIncome,
        savingsGoal,
        monthlyExpenses,
        balance,
        afterSavingsGoal,

        monthlyExpensesPercentage,
        monthlyBalancePercentage,
        displayedExpensesPercentage,
        displayedBalancePercentage,
        expensesProgressValue,
        reserveProgressValue,

        categoryProgressOverview,
        kpiData,
        clampProgressValue,
    };
}