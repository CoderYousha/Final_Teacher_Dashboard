import { useContext, useEffect, useState } from "react";
import { useConstants } from "../../hooks/UseConstants";
import AuthContext from "../../context/AuthContext";
import { useTableStyles } from "../../hooks/UseTableStyles";
import { usePopups } from "../../hooks/UsePopups";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Fetch from "../../services/Fetch";
import { FormattedMessage } from "react-intl";
import AddQuestion from "../../popup/AddQuestion";
import DeleteDialog from "../../popup/DeleteDialog";
import UpdateQuestion from "../../popup/UpdateQuestion";

function Questions() {
    const theme = useTheme();
    const navigate = useNavigate();
    const param = useParams();
    const { host, language } = useConstants();
    const { wait } = useContext(AuthContext);
    const { StyledTableCell, StyledTableRow } = useTableStyles();
    const { setPopup } = usePopups();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { getWait, setGetWait } = useWaits();
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');

    {/* Get Questions Function */}
    const getQuestions = async () => {
        let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`);

        if (result.status === 200) {
            setQuestions(result.data.data.questions);
            setGetWait(false);
        }
    }

    {/* Get Specefic Question Details */}
    const getQuestionDetails = (id) => {
        const questionDetails = questions.find((question) => question.id === id)
        setQuestion(questionDetails);
    }

    {/* Delete Question Function */}
    const deleteQuestion = async () => {
        let result = await Fetch(host + `/teacher/courses/exams/questions/${question.id}/delete`, 'DELETE');

        if (result.status === 200) {
            setQuestions(prev => prev.filter(prev_question => prev_question.id !== question.id));
            setSnackBar('success', <FormattedMessage id="deleted_success" />);
        }
    }

    useEffect(() => {
        getQuestions();
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
                                            <Typography variant="h5" className="py-2 px-3 max-sm:!text-lg"><FormattedMessage id='questions' /></Typography>
                                            <Button variant="contained" onClick={() => setPopup('add', 'flex')} className="">
                                                <AddIcon />
                                                <FormattedMessage id='add_question' />
                                            </Button>
                                        </Box>
                                        <Box>
                                            <TableContainer component={Paper} dir={language === 'en' ? 'ltr' : "rtl"}>
                                                {/* Top Table */}
                                                <Box className="min-h-12 py-2 px-2 flex justify-between items-center max-sm:flex-col">
                                                    <Box className="flex w-2/4 items-center max-sm:mt-2 max-sm:w-full max-sm:justify-between">
                                                        <Typography variant="body1" className="!text-gray-500"><FormattedMessage id='total_questions' />: {questions.length}</Typography>
                                                    </Box>
                                                </Box>

                                                {/* Course Files Table */}
                                                <Table className="" sx={{ minWidth: 700 }} aria-label="customized table">
                                                    <TableHead className="bg-gray-200">
                                                        <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='question' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='question_type' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='full_mark' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='procedures' /></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {questions.map((question, index) =>
                                                            <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? question.text_en : question.text_ar}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row"><FormattedMessage id={question.type}/></StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{question.full_mark}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-center" dir="ltr">
                                                                    <Button variant="contained" color="success" onClick={() => { getQuestionDetails(question.id); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                    <Button variant="contained" color="error" className="!mx-3" onClick={() => { getQuestionDetails(question.id); setPopup('delete', 'flex'); }}><FormattedMessage id="delete" /></Button>
                                                                    <Button variant="contained" color="info" onClick={() => navigate(`/courses/${param.course_id}/exams/${param.exam_id}/questions/${question.id}/options`)}><FormattedMessage id="options" /></Button>
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
                                            <AddQuestion onComplete={getQuestions} onClickClose={() => setPopup('add', 'none')} />
                                        </Box>

                                        {/* Update File Popup */}
                                        <Box id="update" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <UpdateQuestion questionDetails={question} onComplete={getQuestions} onClickClose={() => setPopup('update', 'none')} />
                                        </Box>

                                        {/* Delete Course Popup */}
                                        <Box id="delete" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <DeleteDialog onClickCancel={() => setPopup('delete', 'none')} onClickConfirm={deleteQuestion} title={<FormattedMessage id="delete_question_title" />} subtitle={<FormattedMessage id="delete_question_description" />} />
                                        </Box>
                                    </Box>
                            }
                        </Box>
                    </Box>
            }
        </>
    );
}

export default Questions;