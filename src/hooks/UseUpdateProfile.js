import { useState } from "react";

export function useUpdateProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [academicDegree, setAcademicDegree] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [major, setMajor] = useState('');

    return {
        firstName, setFirstName, lastName, setLastName, code, setCode, phoneNumber, setPhoneNumber, image, setImage, birthDate, setBirthDate,
        specialization, setSpecialization, academicDegree, setAcademicDegree, experienceYears, setExperienceYears, major,
        setMajor,
    };
}