import { Table, TableContainer, TableBody, TableCell, tableCellClasses, TableHead, TableRow, Box, IconButton } from "@mui/material";
import {styled} from "@mui/material/styles";
import {expenseCategories} from "@/constants/expenseCategories";
import {formatCurrency} from '@/utils/formatCurrency'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export type TExpense = {
    id: string;
    category: string;
    name: string;
    amount: number;
};

type TExpenseTableProps = {
    expenses: TExpense[];
    onDeleteExpense: (expenseId: string) => void;
}

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--color-table-head-bg)',
    },
}));

export const ExpensesTable = ({expenses, onDeleteExpense} : TExpenseTableProps) => {
    return (
        <TableContainer sx={{ border:'2px solid var(--color-table-border)', borderRadius: 3, overflowX: 'auto', width:'100%'}}>
            <Table sx={{ width: '100%' }} aria-label="expenses table">
                <TableHead >
                    <TableRow>
                        <StyledTableCell>Category</StyledTableCell>
                        <StyledTableCell>Item</StyledTableCell>
                        <StyledTableCell>Amount</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense)=> {
                        const category = expenseCategories.find(
                            (category) => category.value === expense.category
                        );
                        const Icon = category?.Icon
                        return (
                            <TableRow key={expense.id} >
                                <TableCell >
                                    <Box sx={{display:'flex', flexDirection:'row', gap: 2, alignItems: "center",}}>
                                        <Box sx={{width:35, height:35, backgroundColor:'var(--color-icon-bg)', borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,}}>
                                            {Icon && <Icon fontSize="small" sx={{color:'var(--color-primary)'}}/>}
                                        </Box>
                                        <Box>{category?.label ?? expense.category}</Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{expense.name}</TableCell>
                                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onDeleteExpense(expense.id)}>
                                        <DeleteOutlinedIcon fontSize='small' sx={{color:'text.secondary'}} titleAccess='Delete'/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

