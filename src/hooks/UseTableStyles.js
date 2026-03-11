import { TableCell, tableCellClasses, TableRow } from "@mui/material";
import styled from "styled-components";

export function useTableStyles() {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#cccccc'
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return {
        StyledTableCell, StyledTableRow
    };
}