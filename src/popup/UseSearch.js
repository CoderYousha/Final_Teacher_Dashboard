import { useState } from "react";

export function useSearch() {
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('');

    return {
        search, setSearch, order, setOrder,
    };
}