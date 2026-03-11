import { useState } from "react";

export function useUpdatePassword () {
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmNewPassword, setConfirmNewPassword] = useState();

    return {
        password, setPassword, newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword,
    };
}