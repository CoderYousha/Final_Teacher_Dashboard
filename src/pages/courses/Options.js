import { useContext, useEffect, useState } from "react";
import { useConstants } from "../../hooks/UseConstants";
import AuthContext from "../../context/AuthContext";
import { useTableStyles } from "../../hooks/UseTableStyles";
import { usePopups } from "../../hooks/UsePopups";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Fetch from "../../services/Fetch";
import { FormattedMessage } from "react-intl";
import DeleteDialog from "../../popup/DeleteDialog";
import AddOption from "../../popup/AddOption";
import UpdateOption from "../../popup/UpdateOption";

function Options() {
    const { host, language } = useConstants();
    const { wait } = useContext(AuthContext);
    const { StyledTableCell, StyledTableRow } = useTableStyles();
    const { setPopup } = usePopups();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { getWait, setGetWait } = useWaits();
    const [options, setOptions] = useState([]);
    const [option, setOption] = useState('');
    const theme = useTheme();
    const param = useParams();

    {/* Get Options Function */}
    const getOptions = async () => {
        let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`);

        if (result.status === 200) {
            result.data.data.questions.forEach(question => {
                if(question.id == param.question_id){
                    setOptions(question.options);
                }
            });
            setGetWait(false);
        }
    }

    {/* Get Specefic Option Details */}
    const getOptionDetails = (id) => {
        const optionDetails = options.find((option) => option.id === id)
        setOption(optionDetails);
    }

    {/* Delete Option Function */}
    const deleteOption = async () => {
        let result = await Fetch(host + `/teacher/courses/exams/questions/options/${option.id}/delete`, 'DELETE');

        if (result.status === 200) {
            setOptions(prev => prev.filter(prev_option => prev_option.id !== option.id));
            setSnackBar('success', <FormattedMessage id="deleted_success" />);
        }
    }

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <>
            {
                wait ?
                    <Box className="w-full h-screen relative flex justify-center items-center" sx={{ float: language === 'en' && 'right' }}>
                        <CircularProgress size={70} />
                    </Box>
                    :
                    <Box sx={{ backgroundColor: theme.palette.background.default }}>
                        <Box className="w-4/5 rounded-xl relative" dir={language === 'en' ? 'ltr' : "rtl"} sx={{ float: language === 'en' && 'right' }}>
                            {
                                getWait ?
                                    <Box className="w-full h-screen relative flex justify-center items-center">
                                        <CircularProgress size={70} />
                                    </Box>
                                    :
                                    <Box sx={{ backgroundColor: theme.palette.background.paper }} className="bg-white rounded-xl px-2">
                                        <Box sx={{ backgroundColor: theme.palette.background.default }} className="flex justify-between items-center px-2">
                                            <Typography variant="h5" className="py-2 px-3 max-sm:!text-lg"><FormattedMessage id='options' /></Typography>
                                            <Button variant="contained" onClick={() => setPopup('add', 'flex')} className="">
                                                <AddIcon />
                                                <FormattedMessage id='add_option' />
                                            </Button>
                                        </Box>
                                        <Box>
                                            <TableContainer component={Paper} dir={language === 'en' ? 'ltr' : "rtl"}>
                                                {/* Top Table */}
                                                <Box className="min-h-12 py-2 px-2 flex justify-between items-center max-sm:flex-col">
                                                    <Box className="flex w-2/4 items-center max-sm:mt-2 max-sm:w-full max-sm:justify-between">
                                                        <Typography variant="body1" className="!text-gray-500"><FormattedMessage id='total_options' />: {options    .length}</Typography>
                                                    </Box>
                                                </Box>

                                                {/* Course Files Table */}
                                                <Table className="" sx={{ minWidth: 700 }} aria-label="customized table">
                                                    <TableHead className="bg-gray-200">
                                                        <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='option' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='option_status' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='procedures' /></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {options.map((option, index) =>
                                                            <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? option.text_en : option.text_ar}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{option.is_correct ? <FormattedMessage id='correct'/> : <FormattedMessage id='incorrect'/>}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-center" dir="ltr">
                                                                    <Button variant="contained" color="success" onClick={() => { getOptionDetails(option.id); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                    <Button variant="contained" color="error" className="!mx-3" onClick={() => { getOptionDetails(option.id); setPopup('delete', 'flex'); }}><FormattedMessage id="delete" /></Button>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        )
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>

                                        {/* Add Question Popup */}
                                        <Box id="add" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <AddOption onComplete={getOptions} onClickClose={() => setPopup('add', 'none')} />
                                        </Box>

                                        {/* Update File Popup */}
                                        <Box id="update" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <UpdateOption optionDetails={option} onComplete={getOptions} onClickClose={() => setPopup('update', 'none')} />
                                        </Box>

                                        {/* Delete Course Popup */}
                                        <Box id="delete" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <DeleteDialog onClickCancel={() => setPopup('delete', 'none')} onClickConfirm={deleteOption} title={<FormattedMessage id="delete_option_title" />} subtitle={<FormattedMessage id="delete_option_description" />} />
                                        </Box>
                                    </Box>
                            }
                        </Box>
                    </Box>
            }
        </>
    );
}

export default Options;