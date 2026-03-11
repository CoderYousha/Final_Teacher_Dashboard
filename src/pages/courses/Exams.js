import { useContext, useEffect, useState } from "react";
import { useConstants } from "../../hooks/UseConstants";
import AuthContext from "../../context/AuthContext";
import { useTableStyles } from "../../hooks/UseTableStyles";
import { usePopups } from "../../hooks/UsePopups";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import Fetch from "../../services/Fetch";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AddExam from "../../popup/AddExam";
import DeleteDialog from "../../popup/DeleteDialog";
import UpdateExam from "../../popup/UpdateExam";

function Exams() {
    const { host, language } = useConstants();
    const { wait, profile } = useContext(AuthContext);
    const { StyledTableCell, StyledTableRow } = useTableStyles();
    const { setPopup } = usePopups();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { getWait, setGetWait } = useWaits();
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [examsCounts, setExamsCounts] = useState('');
    const [exams, setExams] = useState([]);
    const [exam, setExam] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();
    const param = useParams();

    const getExams = async () => {
        let result = await Fetch(host + `/courses/${param.id}/exams`);

        if (result.status === 200) {
            setTotalPages(result.data.pagination.last_page);
            setExamsCounts(result.data.pagination.total);
            setCurrentPage(page);
            setExams(result.data.data);
            setGetWait(false);
        }
    }

    const getExamDetails = (id) => {
        const examDetails = exams.find((exam) => exam.id === id)
        setExam(examDetails);
    }

    const deleteExam = async () => {
        let result = await Fetch(host + `/teacher/courses/exams/${exam.id}/delete`, 'DELETE');

        if (result.status === 200) {
            setExams(prev => prev.filter(prev_exam => prev_exam.id !== exam.id));
            setSnackBar('success', <FormattedMessage id="deleted_success" />);
        }
    }

    useEffect(() => {
        getExams();
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
                                            <Typography variant="h5" className="py-2 px-3 max-sm:!text-lg"><FormattedMessage id='exams' /></Typography>
                                            <Button variant="contained" onClick={() => setPopup('add', 'flex')} className="">
                                                <AddIcon />
                                                <FormattedMessage id='add_exam' />
                                            </Button>
                                        </Box>
                                        <Box>
                                            <TableContainer component={Paper} dir={language === 'en' ? 'ltr' : "rtl"}>
                                                {/* Top Table */}
                                                <Box className="min-h-12 py-2 px-2 flex justify-between items-center max-sm:flex-col">
                                                    <Box className="flex w-2/4 items-center max-sm:mt-2 max-sm:w-full max-sm:justify-between">
                                                        <Typography variant="body1" className="!text-gray-500"><FormattedMessage id='total_exams' />: {examsCounts}</Typography>
                                                    </Box>
                                                </Box>

                                                {/* Course Files Table */}
                                                <Table className="" sx={{ minWidth: 700 }} aria-label="customized table">
                                                    <TableHead className="bg-gray-200">
                                                        <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='exam_title' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='publication_date' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='procedures' /></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {exams.map((exam, index) =>
                                                            <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? exam.content.name_en : exam.content.name_ar}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center" dir="ltr">{exam.created_at.split(" ")[0]}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-center" dir="ltr">
                                                                    <Button variant="contained" color="success" onClick={() => { getExamDetails(exam.id); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                    <Button variant="contained" color="error" className="!mx-3" onClick={() => { getExamDetails(exam.id); setPopup('delete', 'flex'); }}><FormattedMessage id="delete" /></Button>
                                                                    <Button variant="contained" color="info" onClick={() => navigate(`/courses/${param.id}/exams/${exam.content.id}/questions`)}><FormattedMessage id="questions" /></Button>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        )
                                                        }
                                                    </TableBody>
                                                </Table>

                                                <Box className="flex justify-center items-center" dir="rtl">
                                                    <Button disabled={page + 1 === totalPages} className="cursor-pointer" onClick={() => setPage(currentPage + 1)}>
                                                        <NavigateNextIcon fontSize="large" />
                                                    </Button>
                                                    <Typography variant="body1" className="!text-xl" dir='ltr'>{currentPage + 1} / {totalPages}</Typography>
                                                    <Button disabled={page + 1 === 1} className="cursor-pointer" onClick={() => setPage(currentPage - 1)}>
                                                        <NavigateBeforeIcon fontSize="large" />
                                                    </Button>
                                                </Box>
                                            </TableContainer>
                                        </Box>

                                        {/* Add Exam Popup */}
                                        <Box id="add" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <AddExam onComplete={getExams} onClickClose={() => setPopup('add', 'none')} />
                                        </Box>
                                        {/* Update File Popup */}
                                        <Box id="update" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <UpdateExam examDetails={exam} onComplete={getExams} onClickClose={() => setPopup('update', 'none')} />
                                        </Box>
                                        {/* Delete Course Popup */}
                                        <Box id="delete" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                                            <DeleteDialog onClickCancel={() => setPopup('delete', 'none')} onClickConfirm={deleteExam} title={<FormattedMessage id="delete_exam_title" />} subtitle={<FormattedMessage id="delete_exam_description" />} />
                                        </Box>
                                    </Box>
                            }
                        </Box>
                    </Box>
            }
        </>
    );
}

export default Exams;