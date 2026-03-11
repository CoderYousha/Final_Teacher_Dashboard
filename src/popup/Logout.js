import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { useConstants } from "../hooks/UseConstants";
import { useWaits } from "../hooks/UseWait";
import Logout from '@mui/icons-material/Logout';
import Fetch from "../services/Fetch";
import { useNavigate } from "react-router-dom";

function LogoutPopup({ onClickCancel}) {
    const { language, host } = useConstants();
    const { sendWait, setSendWait } = useWaits();
    const theme = useTheme();
    const navigate = useNavigate();

    const logout = async () => {
        setSendWait(true);

        let result = await Fetch(host + '/logout', 'POST');

        if(result.status === 200){
            localStorage.removeItem('token');
            navigate('/login');
            onClickCancel();
        }

        setSendWait(false);
    }

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-2/5 rounded-3xl py-2 px-5 max-sm:w-3/4">
            <Box className="w-20 h-20 bg-red-300 rounded-full flex justify-center items-center mx-auto my-5">
                <Logout className="" fontSize="large" color="error"/>
            </Box>
            <Typography className="text-center !font-semibold" variant="h6">تسجيل الخروج</Typography>
            <Typography className="text-center !my-3" variant="body2" dir="rtl">هل أنت متأكد أنك تريد تسجيل الخروج من الحساب؟</Typography>
            <Box className="flex justify-between mt-5">
                <Button onClick={logout} variant="contained" className="w-2/5 !bg-red-300 !text-red-700 hover:!bg-red-500 hover:!text-white duration-300 !font-bold">
                    {
                        sendWait ?
                            <CircularProgress size={20} className="" color="white" />
                            :
                            "تأكيد"
                    }
                </Button>
                <Button variant="contained" className="w-2/5 !bg-gray-300 !text-gray-700 !font-bold hover:!bg-gray-200 duration-300" onClick={onClickCancel}>إلغاء</Button>
            </Box>
        </Box>
    );
}

export default LogoutPopup;