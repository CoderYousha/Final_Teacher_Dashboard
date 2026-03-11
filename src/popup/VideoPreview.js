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
import { useEffect } from "react";
import ReactPlayer from "react-player";

function VideoPreview({ onClickClose, file }) {
    const { language } = useConstants();
    const theme = useTheme();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='video_preview' /></Typography>
            <CloseIcon onClick={() => { onClickClose(); }} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className='w-full mx-auto rounded-full mb-2 relative border-2 max-sm:w-24 max-sm:h-24 max-sm:mx-auto'>
                <ReactPlayer src={file?.content?.file_url} controls={true}
                    width="100%"
                    height="100%" />
            </Box>
        </Box>
    );
}

export default VideoPreview;