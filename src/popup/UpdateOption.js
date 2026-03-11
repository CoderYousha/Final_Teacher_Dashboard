import { Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useConstants } from "../hooks/UseConstants";
import { FormattedMessage } from "react-intl";
import { useWaits } from "../hooks/UseWait";
import Fetch from "../services/Fetch";
import SnackbarAlert from "../components/SnackBar";
import useSnackBar from "../hooks/UseSnackBar";
import { useParams } from "react-router-dom";
import { useQuestions } from "../hooks/UseQuestions";
import { buildQuestionFormData } from "../helper/QuestionFormData";
import { useOptions } from "../hooks/UseOptions";
import { buildOptionFormData } from "../helper/OptionFormData";
import { useEffect } from "react";

function UpdateOption({ onComplete, onClickClose, optionDetails }) {
    const { language, host } = useConstants();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const theme = useTheme();
    const { sendWait, setSendWait } = useWaits();
    const { textAr, textEn, isCorrect, setIsCorrect, setTextAr, setTextEn } = useOptions();
    const param = useParams();

    const setValues = () => {
        setTextEn(optionDetails.text_en);
        setTextAr(optionDetails.text_ar);
        setIsCorrect(optionDetails.is_correct);
    }

    const updateOption = async () => {
        setSendWait(true);

        const formData = buildOptionFormData({
            textEn: textEn,
            textAr: textAr,
            isCorrect: isCorrect? 1 : 0,
            questionId: param.question_id
        });

        let result = await Fetch(host + `/teacher/courses/exams/questions/options/${optionDetails.id}/update`, 'POST', formData);

        if (result.status == 200) {
            setSnackBar('success', <FormattedMessage id="updated_success" />);
            await onComplete();
        } else if (result.status == 422) {
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    useEffect(() => {
        if(optionDetails)
            setValues();
    }, [optionDetails]);

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='update_option' /></Typography>
            <CloseIcon onClick={() => { setValues(); onClickClose(); }} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className=''>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <TextField onChange={(e) => setTextEn(e.target.value)} value={textEn} className="" id="standard-basic" label={<FormattedMessage id="name_en" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                    <TextField onChange={(e) => setTextAr(e.target.value)} value={textAr} className="" id="standard-basic" label={<FormattedMessage id="name_ar" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                </Box>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2 my-5">
                    <FormControlLabel checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} control={<Checkbox />} label={<FormattedMessage id="is_correct" />} />
                </Box>

                <Box className='py-2 flex justify-between'>
                    <Button onClick={updateOption} variant="contained" className="w-2/5">
                        {
                            sendWait ?
                                <CircularProgress size={20} className="" color="white" />
                                :
                                <FormattedMessage id="update" />
                        }
                    </Button>
                    <Button onClick={() => { setValues(); onClickClose(); }} variant="contained" className="!bg-gray-400 w-2/5">
                        <FormattedMessage id="cancel" />
                    </Button>
                </Box>
            </Box>
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </Box>
    );
}

export default UpdateOption;