import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
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

function AddQuestion({ onComplete, onClickClose }) {
    const { language, host } = useConstants();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const theme = useTheme();
    const { sendWait, setSendWait } = useWaits();
    const { textAr, textEn, questionType, fullMark, setFullMark, setTextAr, setTextEn, setQuestionType } = useQuestions();
    const param = useParams();

    const resetValues = () => {
        setTextEn('');
        setTextAr('');
        setQuestionType('multiple_options');
        setFullMark('');
    }

    const createQuestion = async () => {
        setSendWait(true);

        const formData = buildQuestionFormData({
            textEn: textEn,
            textAr: textAr,
            fullMark: fullMark,
            questionType: questionType,
            examId: param.exam_id,
        });

        let result = await Fetch(host + `/teacher/courses/exams/questions/store`, 'POST', formData);

        if (result.status == 200) {
            setSnackBar('success', <FormattedMessage id="created_success" />);
            await onComplete();
            resetValues();
            onClickClose();
        } else if (result.status == 422) {
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='add_question' /></Typography>
            <CloseIcon onClick={() => {resetValues(); onClickClose();}} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className=''>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <TextField onChange={(e) => setTextEn(e.target.value)} value={textEn} className="" id="standard-basic" label={<FormattedMessage id="name_en" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                    <TextField onChange={(e) => setTextAr(e.target.value)} value={textAr} className="" id="standard-basic" label={<FormattedMessage id="name_ar" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                </Box>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2 my-5">
                    <TextField type="number" onChange={(e) => setFullMark(e.target.value)} value={fullMark} className="" id="standard-basic" label={<FormattedMessage id="full_mark" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                    <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="border border-gray-400 rounded-lg">
                        <option value='multiple_options' selected><FormattedMessage id="multiple_options"/></option>
                        <option value='true_false'><FormattedMessage id="true_false" /></option>
                    </select>
                </Box>

                <Box className='py-2 flex justify-between'>
                    <Button onClick={createQuestion} variant="contained" className="w-2/5">
                        {
                            sendWait ?
                                <CircularProgress size={20} className="" color="white" />
                                :
                                <FormattedMessage id="create" />
                        }
                    </Button>
                    <Button onClick={() => {resetValues(); onClickClose();}} variant="contained" className="!bg-gray-400 w-2/5">
                        <FormattedMessage id="cancel" />
                    </Button>
                </Box>
            </Box>
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </Box>
    );
}

export default AddQuestion;