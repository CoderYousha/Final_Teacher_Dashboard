import { useState } from "react";

export function usePagination() {
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    return {
        page, setPage, currentPage, setCurrentPage, totalPages, setTotalPages,
    };
}