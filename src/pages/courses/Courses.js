import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import Fetch from "../../services/Fetch";
import SnackbarAlert from "../../components/SnackBar";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CourseDetails from "../../popup/CourseDetails";
import CoursesFilter from "../../popup/CoursesFilter";
import { useCoursesFilter } from "../../filter/UseCoursesFilter";
import { usePopups } from "../../hooks/UsePopups";
import { useTableStyles } from "../../hooks/UseTableStyles";
import { useConstants } from "../../hooks/UseConstants";
import { FormattedMessage, useIntl } from "react-intl";
import UpdateCourse from "../../popup/UpdateCourse";
import useSnackBar from "../../hooks/UseSnackBar";
import DeleteDialog from "../../popup/DeleteDialog";
import AddIcon from '@mui/icons-material/Add';
import AddCourse from "../../popup/AddCourse";
import { useNavigate } from "react-router-dom";

function Courses() {
    const { host, language } = useConstants();
    const { wait, profile } = useContext(AuthContext);
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { getWait, setGetWait, filterWait, setFilterWait } = useWaits();
    const { category, setCategory, categoriesValue, setCategoriesValue, path, setPath, pathsValue, setPathsValue, fromCount, setFromCount, toCount, setToCount, fromDate, setFromDate, toDate, setToDate } = useCoursesFilter();
    const { StyledTableCell, StyledTableRow } = useTableStyles();
    const { setPopup } = usePopups();
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [coursesCounts, setCoursesCounts] = useState('');
    const [courses, setCourses] = useState([]);
    const [allMajors, setAllMajors] = useState([]);
    const [search, setSearch] = useState('');
    const [course, setCourse] = useState('');
    const [order, setOrder] = useState('');
    const theme = useTheme();
    const intl = useIntl();
    const navigate = useNavigate();

    const getCourses = async () => {
        let result = await Fetch(host + `/courses?teacher_id=${profile.id}&status[]=accepted&page=${page + 1}&search=${search}&${order}${category && `&category_id=${category}`}${path && `&path_id=${path}`}${fromCount && `&files_number[from]=${fromCount}`}${category && `&files_number[to]=${toCount}`}${fromDate && `&from=${fromDate}`}${toDate && `&to=${toDate}`}`, 'GET', null);

        if (result.status === 200) {
            setTotalPages(result.data.pagination.last_page);
            setCoursesCounts(result.data.pagination.total);
            setCourses(result.data.data);
            setCurrentPage(page);
            await getMajors();
        }

        setGetWait(false);
    }

    const getMajors = async () => {
        let result = await Fetch(host + '/majors', "GET", null);

        if (result.status == 200) {
            setAllMajors(result.data.data);
        }
    }

    const getCourseDetails = (id, pathId, type) => {
        const courseDetails = courses.find((course) => course.id === id)
        const path = courseDetails?.paths.find((path) => path.id === pathId);
        if(type === 'update'){
            setCourse(courseDetails);
        }else if (!path) {
            setCourse({"course": courseDetails});
        } else {
            setCourse({ "course": courseDetails, "path": path });
        }
    }

    const filteringCourses = async () => {
        let result = await Fetch(host + `/courses?teacher_id=${profile.id}&status[]=accepted&page=${page + 1}&search=${search}&${order}${category && `&category_id=${category}`}${path && `&path_id=${path}`}${fromCount && `&files_number[from]=${fromCount}`}${category && `&files_number[to]=${toCount}`}${fromDate && `&from=${fromDate}`}${toDate && `&to=${toDate}`}`, 'GET', null);

        if (result.status === 200) {
            setTotalPages(result.data.pagination.last_page);
            setCourses(result.data.data);
            setPopup('filter', 'none');
        }

        setFilterWait(false);
    }

    const deleteCourse = async () => {
        let result = await Fetch(host + `/teacher/courses/${course.id}/delete`, 'DELETE');

        if (result.status === 200) {
            setSnackBar('success', <FormattedMessage id="deleted_success" />);
            setCourses(prev => prev.filter(prev_course => prev_course.id !== course.id));
            setCourse(null);
        }
    }

    useEffect(() => {
        if (!wait)
            getCourses();
    }, [page, search, order, wait]);

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
                                            <Typography variant="h5" className="py-2 px-3 max-sm:!text-lg"><FormattedMessage id='courses' /></Typography>
                                            <Button variant="contained" onClick={() => setPopup('add', 'flex')} className="">
                                                <AddIcon />
                                                <FormattedMessage id='add_course' />
                                            </Button>
                                        </Box>
                                        <Box>
                                            <TableContainer component={Paper} dir={language === 'en' ? 'ltr' : "rtl"}>
                                                {/* Top Table */}
                                                <Box className="min-h-12 py-2 px-2 flex justify-between items-center max-sm:flex-col">
                                                    <Box className="w-full flex items-center">
                                                        <FilterAltOutlinedIcon onClick={() => setPopup('filter', 'flex')} className="cursor-pointer" fontSize="large" />
                                                        <Box className="w-2/4 relative mr-3 max-sm:w-full">
                                                            <input style={{ backgroundColor: theme.palette.background.default }} onChange={(e) => setSearch(e.target.value)} className="w-10/12 h-12 rounded-md border indent-14 outline-none max-sm:w-full" placeholder={intl.formatMessage({ id: "search_course_name" })} />
                                                            <SearchOutlinedIcon className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" sx={{ right: language === 'en' && '90%' }} />
                                                        </Box>
                                                    </Box>
                                                    <Box className="flex w-2/4 items-center max-sm:mt-2 max-sm:w-full max-sm:justify-between">
                                                        <select onChange={(e) => setOrder(e.target.value)} style={{ backgroundColor: theme.palette.background.select }} className="w-2/5 py-1 rounded-lg mx-3 outline-none">
                                                            <option value=''><FormattedMessage id='date' /></option>
                                                            <option value={language === 'en' ? 'order_by=name_en&direction=asc' : 'order_by=name_ar&direction=asc'}><FormattedMessage id='course_name' /></option>
                                                        </select>
                                                        <Typography variant="body1" className="!text-gray-500"><FormattedMessage id='total_courses' />: {coursesCounts}</Typography>
                                                    </Box>
                                                </Box>

                                                {/* Courses Table */}
                                                <Table className="" sx={{ minWidth: 700 }} aria-label="customized table">
                                                    <TableHead className="bg-gray-200">
                                                        <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='course_name' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='category' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className=""><FormattedMessage id='education_path' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='course_files_count' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='publication_date' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='procedures' /></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {courses.map((course, index) =>
                                                            course.paths.length !== 0 ?
                                                                course.paths.map((path, index) =>
                                                                    <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? course.name_en : course.name_ar}</StyledTableCell>
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'}>{language === 'en' ? course.category.name_en : course.category.name_ar}</StyledTableCell>
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="text-center">{language === 'en' ? path.name_en : path.name_ar}</StyledTableCell>
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="">{course.contents?.filter((content) => content.content_type === 'CourseFile').length}</StyledTableCell>
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center" dir="ltr">{course.created_at.split(" ")[0]}</StyledTableCell>
                                                                        <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-between" dir="ltr">
                                                                            <Button variant="contained" color="success" onClick={(e) => { e.stopPropagation(); getCourseDetails(course.id, null, 'update'); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                            <Button variant="contained" color="error" onClick={() => { setPopup('delete', 'flex') }}><FormattedMessage id="delete" /></Button>
                                                                            {/* <Button variant="contained" color="info" onClick={(e) => { e.stopPropagation(); getCourseDetails(course.id, path.id); setPopup('details', 'flex'); }}><FormattedMessage id="view_details" /></Button> */}
                                                                            <Button variant="contained" color="info" onClick={() => navigate(`/courses/${course.id}/files`)}><FormattedMessage id="files" /></Button>
                                                                            <Button variant="contained" color="info" onClick={() => navigate(`/courses/${course.id}/exams`)}><FormattedMessage id="exams"/></Button>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                                :
                                                                <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? course.name_en : course.name_ar}</StyledTableCell>
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'}>{language === 'en' ? course.category.name_en : course.category.name_ar}</StyledTableCell>
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="text-center"><FormattedMessage id="nothing" /></StyledTableCell>
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="">{course.contents?.filter((content) => content.content_type === 'CourseFile').length}</StyledTableCell>
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center" dir="ltr">{course.created_at.split(" ")[0]}</StyledTableCell>
                                                                    <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-between" dir="ltr">
                                                                        <Button variant="contained" color="success" onClick={(e) => { e.stopPropagation(); getCourseDetails(course.id, null, 'update'); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                        <Button variant="contained" color="error" onClick={() => { setPopup('delete', 'flex') }}><FormattedMessage id="delete" /></Button>
                                                                        <Button variant="contained" color="info" onClick={() => navigate(`/courses/${course.id}/files`)}><FormattedMessage id="files"/></Button>
                                                                        <Button variant="contained" color="info" onClick={() => navigate(`/courses/${course.id}/exams`)}><FormattedMessage id="exams" /></Button>
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                        )}
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
                                    </Box>
                            }
                        </Box>

                        {/* Course Details Popup */}
                        <Box id="details" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center hidden max-sm:left-0">
                            <CourseDetails onClickClose={() => setPopup('details', 'none')} data={course} />
                        </Box>

                        {/* Update Course Popup */}
                        <Box id="update" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center hidden max-sm:left-0">
                            <UpdateCourse onComplete={getCourses} setCourses={setCourses} onClickClose={() => setPopup('update', 'none')} course={course} allMajors={allMajors} />
                        </Box>

                        {/* Add Course Popup */}
                        <Box id="add" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center hidden max-sm:left-0">
                            <AddCourse onComplete={getCourses} onClickClose={() => setPopup('add', 'none')} allMajors={allMajors} />
                        </Box>

                        {/* Delete Course Popup */}
                        <Box id="delete" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                            <DeleteDialog onClickCancel={() => setPopup('delete', 'none')} onClickConfirm={deleteCourse} title={<FormattedMessage id="delete_course_title" />} subtitle={<FormattedMessage id="delete_course_description" />} />
                        </Box>

                        {/* Course Filter Popup */}
                        <Box id="filter" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 hidden justify-center items-center max-sm:left-0">
                            <CoursesFilter onClickClose={() => setPopup('filter', 'none')} onClickConfirm={filteringCourses}
                                categoriesValue={categoriesValue} fromCount={fromCount} toCount={toCount} fromDate={fromDate}
                                toDate={toDate} pathsValue={pathsValue} filterWait={filterWait} setCategoriesValue={setCategoriesValue}
                                setPathsValue={setPathsValue} setToDate={setToDate} setCategory={setCategory} setPath={setPath}
                                setFromCount={setFromCount} setFromDate={setFromDate} setToCount={setToCount} setFilterWait={setFilterWait} />
                        </Box>
                    </Box>
            }
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </>
    );
}

export default Courses;