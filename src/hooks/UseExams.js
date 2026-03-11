import { useState } from "react";

export function useExams () {
    const [nameAr, setNameAr] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [descriptionAr, setDescriptionAr] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');

    return {
        nameAr, nameEn, descriptionAr, descriptionEn, setNameAr, setNameEn, setDescriptionAr, setDescriptionEn,
    };
}