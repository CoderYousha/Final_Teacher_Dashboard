import { useState } from "react";

export function useCoursesFilter() {
    const [category, setCategory] = useState('');
    const [categoriesValue, setCategoriesValue] = useState('');
    const [path, setPath] = useState('');
    const [pathsValue, setPathsValue] = useState('');
    const [fromCount, setFromCount] = useState('');
    const [toCount, setToCount] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    return {
        category, setCategory, categoriesValue, setCategoriesValue, path, setPath, pathsValue, setPathsValue, fromCount, setFromCount,
        toCount, setToCount, fromDate, setFromDate, toDate, setToDate,
    };
}