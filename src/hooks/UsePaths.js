import { useState } from "react";

export function usePaths () {
    const [nameAr, setNameAr] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [descriptionAr, setDescriptionAr] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [courseIds, setCourseIds] = useState([]);

    return {
        nameAr, nameEn, descriptionAr, descriptionEn, image, price, setImage, categoryId, setCategoryId, 
        courseIds, setCourseIds, setNameAr, setNameEn, setDescriptionAr, setDescriptionEn, setPrice
    };
}