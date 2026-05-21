import {Stack, Box, Typography} from "@mui/material";

type MonthlySummaryProps = {
    totalIncome: string;
    totalExpenses: string;
    monthlyBalance: string;
    savingsGoal: string;
}

export const MonthlySummary = ({totalIncome, totalExpenses, monthlyBalance, savingsGoal} : MonthlySummaryProps) => {

    const summaryItemSx = {
        backgroundColor: "var(--color-bg-soft)",
        borderRadius: 3,
        px: 2,
        py: 1,
        minHeight: 78,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    const summaryLabelSx = {
        color: "var(--color-text-secondary)",
        mb: 0.75,
    };

    const summaryValueSx = {
        color: "var(--color-text-main)",
        fontSize: 22,
        lineHeight: 1.2,
        fontWeight: 700,
    };

    return (
        <Stack sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box sx={summaryItemSx}>
                <Typography variant="body2" sx={summaryLabelSx}>Total income</Typography>
                <Typography sx={summaryValueSx}>{totalIncome}</Typography>
            </Box>
            <Box sx={summaryItemSx}>
                <Typography variant="body2" sx={summaryLabelSx}>Total expenses</Typography>
                <Typography sx={summaryValueSx}>{totalExpenses}</Typography>
            </Box>
            <Box sx={summaryItemSx}>
                <Typography variant="body2" sx={summaryLabelSx}>Monthly balance</Typography>
                <Typography sx={summaryValueSx}>{monthlyBalance}</Typography>
            </Box>
            <Box sx={summaryItemSx}>
                <Typography variant="body2" sx={summaryLabelSx}>Savings goal</Typography>
                <Typography sx={summaryValueSx}>{savingsGoal}</Typography>
            </Box>

        </Stack>
    );
};








