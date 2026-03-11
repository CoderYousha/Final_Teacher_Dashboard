import { useState } from "react";

export function useOptions () {
    const [textEn, setTextEn] = useState('');
    const [textAr, setTextAr] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    return {
        textAr, textEn, isCorrect, setTextEn, setTextAr, setIsCorrect
    };
}