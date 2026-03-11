import { Box, Button, CircularProgress, TextField, Typography, useTheme } from "@mui/material";
import { useConstants } from "../hooks/UseConstants";
import DeleteImage from '../images/icons/delete.png';
import { useWaits } from "../hooks/UseWait";
import GratWarningImage from "../images/icons/gray-warning.png";
import { FormattedMessage } from "react-intl";

function DeleteDialog({ onClickConfirm, onClickCancel, title, subtitle, hasInput, label, placeholder, warning }) {
    const { language } = useConstants();
    const { sendWait, setSendWait } = useWaits();
    const theme = useTheme();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-2/5 h-fit rounded-3xl py-2 px-5 max-sm:w-3/4">
            <Box className="w-20 h-20 bg-red-300 rounded-full flex justify-center items-center mx-auto my-5">
                <img src={DeleteImage} className="" />
            </Box>
            <Typography className="text-center !font-semibold" variant="h6">{title}</Typography>
            <Typography className="text-center !my-3" variant="body2" dir="rtl">{subtitle}</Typography>
            {
                hasInput &&
                <TextField dir="rtl" multiline rows={4} placeholder={placeholder} className="w-full" variant="outlined" label={label} />
            }
            {
                warning &&
                    <Box className="flex my-2 flex-row-reverse">
                        <img src={GratWarningImage} />
                        <Typography variant="body2" className="!mr-1 text-gray-600">{warning}</Typography>
                    </Box>
            }
            {/* Buttons Container */}
            <Box className="flex justify-between mt-5">
                <Button onClick={async () => { setSendWait(true); await onClickConfirm(); setSendWait(false); onClickCancel(); }} variant="contained" className="w-2/5 !bg-red-300 !text-red-700 hover:!bg-red-500 hover:!text-white duration-300 !font-bold">
                    {
                        sendWait ?
                            <CircularProgress size={20} className="" color="white" />
                            :
                            <FormattedMessage id='delete' />
                    }
                </Button>
                <Button variant="contained" className="w-2/5 !bg-gray-300 !text-gray-700 !font-bold hover:!bg-gray-200 duration-300" onClick={onClickCancel}><FormattedMessage id='cancel' /></Button>
            </Box>
        </Box>
    );
}

export default DeleteDialog;