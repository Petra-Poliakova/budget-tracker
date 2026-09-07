import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useBudgetOverview, defaultBudgetData, type TBudgetData } from '@/hooks/useBudgetOverview';
import type { TExpense } from '@/components/ExpensesTable';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock the useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
    useLocalStorage: vi.fn(),
}));

describe('useBudgetOverview', () => {
    const mockSetBudgetData = vi.fn();
    const mockRemoveBudgetData = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial state', () => {
        it('should return default values when budget data is empty', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyIncome).toBe(0);
            expect(result.current.savingsGoal).toBe(0);
            expect(result.current.monthlyExpenses).toBe(0);
            expect(result.current.balance).toBe(0);
            expect(result.current.afterSavingsGoal).toBe(0);
            expect(result.current.monthlyExpensesPercentage).toBe(0);
            expect(result.current.monthlyBalancePercentage).toBe(0);
        });

        it('should handle null income and savings goal correctly', () => {
            const budgetData: TBudgetData = {
                monthlyIncome: null,
                savingsGoal: null,
                expenses: [],
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyIncome).toBe(0);
            expect(result.current.savingsGoal).toBe(0);
        });

        it('should return 4 KPI cards in kpiData', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.kpiData).toHaveLength(4);
            expect(result.current.kpiData[0].title).toBe('Monthly Income');
            expect(result.current.kpiData[1].title).toBe('Monthly Expenses');
            expect(result.current.kpiData[2].title).toBe('Balance');
            expect(result.current.kpiData[3].title).toBe('After Savings Goal');
        });
    });

    describe('Calculation logic', () => {
        it('should calculate balance and afterSavingsGoal correctly', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
                { id: '2', category: 'groceries', name: 'Food', amount: 200 },
                { id: '3', category: 'transport', name: 'Gas', amount: 100 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 300,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpenses).toBe(800);
            expect(result.current.balance).toBe(1200);
            expect(result.current.afterSavingsGoal).toBe(900);
        });

        it('should calculate monthlyExpensesPercentage correctly', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 600 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 200,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpensesPercentage).toBe(30);
            expect(result.current.displayedExpensesPercentage).toBe(30);
        });

        it('should handle decimal percentages correctly', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 333 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1000,
                savingsGoal: 100,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            // 333 / 1000 * 100 = 33.3
            expect(result.current.displayedExpensesPercentage).toBe(33.3);
        });

        it('should handle expenses with null or undefined amounts', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
                { id: '2', category: 'groceries', name: 'Food', amount: null },
                { id: '3', category: 'transport', name: 'Gas', amount: 200 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1500,
                savingsGoal: 100,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpenses).toBe(700);
        });
    });

    describe('Edge cases', () => {
        it('should handle monthlyIncome of 0 without division by zero errors', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 0,
                savingsGoal: 0,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpensesPercentage).toBe(0);
            expect(result.current.monthlyBalancePercentage).toBe(0);
            expect(result.current.displayedExpensesPercentage).toBe(0);
        });

        it('should clamp progress values when expenses exceed income (>100%)', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 2500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1000,
                savingsGoal: 100,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpensesPercentage).toBe(250);
            expect(result.current.displayedExpensesPercentage).toBe(250);
            // Progress value should be clamped to 100
            expect(result.current.expensesProgressValue).toBe(100);
        });

        it('should handle negative balance correctly', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 1500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1000,
                savingsGoal: 200,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.balance).toBe(-500);
            expect(result.current.afterSavingsGoal).toBe(-700);
            expect(result.current.reserveProgressValue).toBe(0);
        });

        it('should handle empty expenses array', () => {
            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 500,
                expenses: [],
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.monthlyExpenses).toBe(0);
            expect(result.current.balance).toBe(2000);
            expect(result.current.categoryProgressOverview).toHaveLength(0);
        });

        it('should handle uncategorized expenses', () => {
            const expenses: TExpense[] = [
                { id: '1', category: null, name: 'Mystery expense', amount: 100 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1000,
                savingsGoal: 100,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.categoryProgressOverview).toHaveLength(1);
            expect(result.current.categoryProgressOverview[0].category).toBe('Uncategorized');
            expect(result.current.categoryProgressOverview[0].label).toBe('Uncategorized');
        });
    });

    describe('Category progress overview', () => {
        it('should group expenses by category correctly', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
                { id: '2', category: 'housing', name: 'Utilities', amount: 100 },
                { id: '3', category: 'groceries', name: 'Food', amount: 200 },
                { id: '4', category: 'transport', name: 'Gas', amount: 50 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 300,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.categoryProgressOverview).toHaveLength(3);
            
            const housingCategory = result.current.categoryProgressOverview.find(
                (cat) => cat.category === 'housing'
            );
            expect(housingCategory?.amount).toBe(600);
            expect(housingCategory?.percentage).toBe(30);
        });

        it('should sort categories by percentage in descending order', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'transport', name: 'Gas', amount: 100 },
                { id: '2', category: 'housing', name: 'Rent', amount: 800 },
                { id: '3', category: 'groceries', name: 'Food', amount: 300 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 200,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.categoryProgressOverview[0].category).toBe('housing');
            expect(result.current.categoryProgressOverview[1].category).toBe('groceries');
            expect(result.current.categoryProgressOverview[2].category).toBe('transport');
        });

        it('should include category label and icon from expenseCategories', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 1000,
                savingsGoal: 100,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            const housingCategory = result.current.categoryProgressOverview[0];
            expect(housingCategory.label).toBe('Housing');
            expect(housingCategory.Icon).toBeDefined();
        });

        it('should handle zero income when calculating category percentages', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 0,
                savingsGoal: 0,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.categoryProgressOverview[0].percentage).toBe(0);
        });
    });

    describe('KPI Data', () => {
        it('should format currency values correctly in kpiData', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 500 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 300,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.kpiData[0].value).toContain('2');
            expect(result.current.kpiData[0].value).toContain('000');
            expect(result.current.kpiData[1].value).toContain('500');
            expect(result.current.kpiData[2].value).toContain('1');
            expect(result.current.kpiData[2].value).toContain('500');
            expect(result.current.kpiData[3].value).toContain('1');
            expect(result.current.kpiData[3].value).toContain('200');
        });

        it('should include icons in all KPI cards', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            result.current.kpiData.forEach((kpi) => {
                expect(kpi.icon).toBeDefined();
            });
        });

        it('should update KPI descriptions based on calculations', () => {
            const expenses: TExpense[] = [
                { id: '1', category: 'housing', name: 'Rent', amount: 400 },
            ];

            const budgetData: TBudgetData = {
                monthlyIncome: 2000,
                savingsGoal: 300,
                expenses,
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            const expensesCard = result.current.kpiData[1];
            expect(expensesCard.description).toContain('20%');
        });
    });

    describe('clampProgressValue utility', () => {
        it('should clamp values below 0 to 0', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.clampProgressValue(-50)).toBe(0);
            expect(result.current.clampProgressValue(-0.1)).toBe(0);
        });

        it('should clamp values above 100 to 100', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.clampProgressValue(150)).toBe(100);
            expect(result.current.clampProgressValue(100.1)).toBe(100);
        });

        it('should return value unchanged if between 0 and 100', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.clampProgressValue(50)).toBe(50);
            expect(result.current.clampProgressValue(0)).toBe(0);
            expect(result.current.clampProgressValue(100)).toBe(100);
        });
    });

    describe('Hook return values', () => {
        it('should expose setBudgetData and removeBudgetData functions', () => {
            vi.mocked(useLocalStorage).mockReturnValue([
                defaultBudgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.setBudgetData).toBe(mockSetBudgetData);
            expect(result.current.removeBudgetData).toBe(mockRemoveBudgetData);
        });

        it('should return budgetData object', () => {
            const budgetData: TBudgetData = {
                monthlyIncome: 3000,
                savingsGoal: 500,
                expenses: [],
            };

            vi.mocked(useLocalStorage).mockReturnValue([
                budgetData,
                mockSetBudgetData,
                mockRemoveBudgetData,
            ]);

            const { result } = renderHook(() => useBudgetOverview());

            expect(result.current.budgetData).toEqual(budgetData);
        });
    });
});

//"Write Vitest tests for the useBudgetOverview hook in useBudgetOverview.tsx.

// Context:

// The hook uses useLocalStorage for data persistence. Mock this hook to simulate different budget states.
// It calculates monthly expenses, balance, and progress values using clampProgressValue.
// Scenarios to cover:

// Initial state: verify default values when budget data is empty or null.
// Calculation logic: provide a set of expenses and verify balance, afterSavingsGoal, and monthlyExpensesPercentage are correct.
// Edge cases: handle cases where monthlyIncome is 0 (to avoid division by zero errors), cases where expenses exceed income (>100%), and empty categories.
// KPI Data: ensure the kpiData array contains the correct 4 cards with formatted currency.
// Style:

// Use @testing-library/react's renderHook.
// Group tests into describe blocks.
// Avoid over-mocking; focus on the hook's output and behavior, not its internal implementation."


// This comprehensive test suite covers:

// Initial state: Default values, null handling, and KPI card structure
// Calculation logic: Balance, savings, percentages, and decimal handling
// Edge cases: Division by zero, expenses exceeding income, negative balance, empty arrays, and uncategorized expenses
// Category progress: Grouping, sorting, labels, icons, and percentage calculations
// KPI Data: Currency formatting, icons, and dynamic descriptions
// clampProgressValue utility: Boundary testing
// Hook return values: Ensuring all expected functions and data are exposed