import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useConstants } from "../hooks/UseConstants";
import { FormattedMessage } from "react-intl";
import { useWaits } from "../hooks/UseWait";
import Fetch from "../services/Fetch";
import SnackbarAlert from "../components/SnackBar";
import useSnackBar from "../hooks/UseSnackBar";
import { useExams } from "../hooks/UseExams";
import { useParams } from "react-router-dom";
import { buildExamFormData } from "../helper/ExamFormData";
import { useEffect } from "react";

function UpdateExam({ onComplete, onClickClose, examDetails }) {
    const { language, host } = useConstants();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const theme = useTheme();
    const { sendWait, setSendWait } = useWaits();
    const { nameEn, nameAr, descriptionAr, descriptionEn, setDescriptionAr, setDescriptionEn, setNameAr, setNameEn } = useExams();
    const param = useParams();

    const setValues = () => {
        setNameEn(examDetails.content.name_en);
        setNameAr(examDetails.content.name_ar);
        setDescriptionEn(examDetails.content.description_en);
        setDescriptionAr(examDetails.content.description_ar);
    }

    useEffect(() => {
        if(examDetails)
            setValues();
    }, [examDetails]);

    const upadteExam = async () => {
        setSendWait(true);

        const formData = buildExamFormData({
            nameEn: nameEn,
            nameAr: nameAr,
            descriptionEn: descriptionEn,
            descriptionAr: descriptionAr,
            courseId: param.id,
        });

        let result = await Fetch(host + `/teacher/courses/exams/${examDetails.content.id}/update`, 'POST', formData);

        if (result.status == 200) {
            setSnackBar('success', <FormattedMessage id="updated_success" />);
            await onComplete();
        } else if (result.status == 422) {
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='add_exam' /></Typography>
            <CloseIcon onClick={() => {setValues(); onClickClose();}} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className=''>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <TextField onChange={(e) => setNameEn(e.target.value)} value={nameEn} className="" id="standard-basic" label={<FormattedMessage id="name_en" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                    <TextField onChange={(e) => setNameAr(e.target.value)} value={nameAr} className="" id="standard-basic" label={<FormattedMessage id="name_ar" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                </Box>
                <TextField
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className='w-full !mt-5'
                    id="standard-multiline-static"
                    label={<FormattedMessage id="description_en" />}
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <Box className='py-3'></Box>
                <TextField
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className='w-full'
                    id="standard-multiline-static"
                    label={<FormattedMessage id="description_ar" />}
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <Box className='py-2 flex justify-between'>
                    <Button onClick={upadteExam} variant="contained" className="w-2/5">
                        {
                            sendWait ?
                                <CircularProgress size={20} className="" color="white" />
                                :
                                <FormattedMessage id="update" />
                        }
                    </Button>
                    <Button onClick={() => {setValues(); onClickClose();}} variant="contained" className="!bg-gray-400 w-2/5">
                        <FormattedMessage id="cancel" />
                    </Button>
                </Box>
            </Box>
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </Box>
    );
}

export default UpdateExam;