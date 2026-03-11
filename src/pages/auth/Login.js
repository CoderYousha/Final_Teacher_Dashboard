import { useConstants } from "../../hooks/UseConstants";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import CheckLogin from "../../services/CheckLogin";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import BackgroundImage from '../../images/login/background2.png';
import LogoImage from '../../images/logo/logo.png';
import Fetch from "../../services/Fetch";
import { useLogin } from "../../hooks/UseLogin";
import { buildLoginFormData } from "../../helper/LoginFormData";
import SnackbarAlert from "../../components/SnackBar";

function Login() {
    const { host, language } = useConstants();
    const { openSnackBar, type, message, setOpenSnackBar, setSnackBar } = useSnackBar();
    const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
    const { email, setEmail, password, setPassword } = useLogin();
    const navigate = useNavigate();

    const checkLogin = async () => {
        let result = await CheckLogin(host);
        if (result) {
            navigate('/dashboard');
        } else {
            setGetWait(false);
        }
    }

    const login = async () => {
        setSendWait(true);

        const formData = buildLoginFormData({
            email: email,
            password: password,
        });

        let result = await Fetch(host + '/login', 'POST', formData);

        if (result.status === 200) {
            localStorage.setItem('token', result.data.data.token);
            navigate('/dashboard');
        } else if (result.status === 422) {
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    useEffect(() => {
        checkLogin();
    }, []);


    return (
        <>
            {
                getWait ?
                    <Box className="w-full h-screen relative flex justify-center items-center">
                        <CircularProgress size={70} />
                    </Box>
                    :
                    <Box className="flow-root px-7 py-20 h-screen">
                        <img src={BackgroundImage} className="float-left max-sm:hidden" />
                        <Box className="w-1/3 max-sm:w-full float-right">
                            <Box className="w-full py-3 px-2 rounded-xl mx-auto" sx={{ boxShadow: '1px 0px 5px 0px' }}>
                                <img src={LogoImage} className="w-2/5 mx-auto my-10 max-sm:w-2/5" />
                                <Typography variant="h6" fontWeight={800} className="!my-3 text-center">تسجيل الدخول</Typography>
                                <TextField className="w-full !mt-10" label="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} />
                                <TextField type="password" className="w-full !mt-7" label="كلمة المرور" onChange={(e) => setPassword(e.target.value)} />
                                <Box className="my-3">
                                    <Typography variant="body2" className="text-blue-500 cursor-pointer w-fit">نسيت كلمة المرور؟</Typography>
                                </Box>
                                <Button onClick={login} variant="contained" className="w-full !mt-16">
                                    {
                                        sendWait ?
                                            <CircularProgress size={20} className="" color="white" />
                                            :
                                            "تسجيل الدخول"
                                    }
                                </Button>
                            </Box>
                        </Box>
                        <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
                    </Box>
            }
        </>
    );
}

export default Login;