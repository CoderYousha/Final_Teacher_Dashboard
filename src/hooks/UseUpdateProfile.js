import { useState } from "react";

export function useUpdateProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('');
    const [birthDate, setBirthDate] = useState('');

    return {
        firstName, setFirstName, lastName, setLastName, code, setCode, phoneNumber, setPhoneNumber, image, setImage, birthDate, setBirthDate
    };
}