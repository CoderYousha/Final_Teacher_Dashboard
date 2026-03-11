import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useConstants } from "../hooks/UseConstants";
import { FormattedMessage } from "react-intl";
import { useWaits } from "../hooks/UseWait";
import Fetch from "../services/Fetch";
import SnackbarAlert from "../components/SnackBar";
import useSnackBar from "../hooks/UseSnackBar";
import UploadImage from '../images/icons/upload-image.png';
import { useFiles } from "../hooks/UseFiles";
import { buildFileFormData } from "../helper/FileFormData";
import { useParams } from "react-router-dom";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


function AddFile({ onComplete, onClickClose }) {
    const { language, host } = useConstants();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { nameAr, nameEn, setNameAr, setNameEn, setThumbnail, thumbnail, file, setFile } = useFiles();
    const theme = useTheme();
    const { sendWait, setSendWait } = useWaits();
    const param = useParams();

    function viewImage(event) {
        const previewImage = document.getElementById('image');

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                previewImage.style.display = 'block';
                previewImage.setAttribute("src", this.result);
            });
            reader.readAsDataURL(file);
        }
    }

    const resetValues = () => {
        setNameEn('');
        setNameAr('');
        setThumbnail('');
        setFile('');
    }

    const addFile = async () => {
        setSendWait(true);

        const formData = buildFileFormData({
            nameEn: nameEn,
            nameAr: nameAr,
            courseId: param.id,
            file: file,
            thumbnail: thumbnail
        });

        let result = await Fetch(host + `/teacher/courses/files/store`, 'POST', formData);

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
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='add_file' /></Typography>
            <CloseIcon onClick={() => { resetValues(); onClickClose(); }} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className='w-32 h-32 mx-auto rounded-full mb-2 relative border-2 max-sm:w-24 max-sm:h-24 max-sm:mx-auto'>
                <AddPhotoAlternateIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !text-gray-500 text-xl !z-0' fontSize='large' />
                <img id='image' className='!z-30 w-full h-full rounded-full hidden relative' />
                <input type='file' accept='image/*' className='w-full h-full opacity-0 absolute top-0' onChange={(e) => { viewImage(e); setThumbnail(e.target.files[0]) }} />
            </Box>
            <Box className=''>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-2">
                    <TextField onChange={(e) => setNameEn(e.target.value)} value={nameEn} className="" id="standard-basic" label={<FormattedMessage id="name_en" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                    <TextField onChange={(e) => setNameAr(e.target.value)} value={nameAr} className="" id="standard-basic" label={<FormattedMessage id="name_ar" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                </Box>
                <Box className="relative w-full h-32 bg-gray-200 rounded-xl mt-5 flex flex-col items-center justify-center cursor-pointer">
                    <img src={UploadImage} className="" />
                    <Typography variant="body1" className="text-gray-700"><FormattedMessage id='add_video' /></Typography>
                    <input type="file" accept="video/*" className="w-full h-full opacity-0 absolute cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                </Box>
                <Box className='py-2 flex justify-between'>
                    <Button onClick={addFile} variant="contained" className="w-2/5">
                        {
                            sendWait ?
                                <CircularProgress size={20} className="" color="white" />
                                :
                                <FormattedMessage id="create" />
                        }
                    </Button>
                    <Button onClick={() => { resetValues(); onClickClose(); }} variant="contained" className="!bg-gray-400 w-2/5">
                        <FormattedMessage id="cancel" />
                    </Button>
                </Box>
            </Box>
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </Box>
    );
}

export default AddFile;