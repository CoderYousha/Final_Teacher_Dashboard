import { useState } from "react";

export function useCourses () {
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionAr, setDescriptionAr] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [majors, setMajors] = useState([]);

    return {
        nameEn, setNameEn, nameAr, setNameAr, descriptionEn, setDescriptionEn, descriptionAr, setDescriptionAr,
        price, setPrice, image, setImage, categoryId, setCategoryId, majors, setMajors,
    };
}