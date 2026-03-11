import { useState } from "react";

export function useQuestions () {
    const [textEn, setTextEn] = useState('');
    const [textAr, setTextAr] = useState('');
    const [questionType, setQuestionType] = useState('multiple_options');
    const [fullMark, setFullMark] = useState('');

    return {
        textAr, textEn, questionType, fullMark, setTextAr, setTextEn, setQuestionType, setFullMark
    };
}