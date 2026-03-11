import { useState } from "react";

export function useFiles () {
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [file, setFile] = useState('');

    return {
        nameEn, setNameEn, nameAr, setNameAr, thumbnail, setThumbnail, file, setFile
    };
}