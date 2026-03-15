import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import Fetch from "../../services/Fetch";
import SnackbarAlert from "../../components/SnackBar";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { usePopups } from "../../hooks/UsePopups";
import { useTableStyles } from "../../hooks/UseTableStyles";
import { useConstants } from "../../hooks/UseConstants";
import { FormattedMessage, useIntl } from "react-intl";
import useSnackBar from "../../hooks/UseSnackBar";
import DeleteDialog from "../../popup/DeleteDialog";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import AddPath from "../../popup/AddPath";
import UpdatePath from "../../popup/UpdatePath";
import { useSearch } from "../../popup/UseSearch";
import { usePagination } from "../../popup/UsePagination";

function Paths() {
    const { host, language } = useConstants();
    const { wait, profile } = useContext(AuthContext);
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const { getWait, setGetWait } = useWaits();
    const { StyledTableCell, StyledTableRow } = useTableStyles();
    const { setPopup } = usePopups();
    const { search, setSearch } = useSearch();
    const { page, setPage, currentPage, setCurrentPage, totalPages, setTotalPages } = usePagination();
    const [pathsCounts, setPathsCounts] = useState('');
    const [paths, setPaths] = useState([]);
    const [path, setPath] = useState('');
    const theme = useTheme();
    const intl = useIntl();
    const navigate = useNavigate();

    {/* Get Paths Function */ }
    const getPaths = async () => {
        let result = await Fetch(host + `/paths?teacher_id=${profile.id}&page=${page + 1}&search=${search}`, 'GET', null);

        if (result.status === 200) {
            setTotalPages(result.data.pagination.last_page);
            setPathsCounts(result.data.pagination.total);
            setPaths(result.data.data);
            setCurrentPage(page);
        }

        setGetWait(false);
    }

    {/* Get Specefic Path Details Function */ }
    const getPathDetails = (id) => {
        const pathDetails = paths.find((path) => path.id === id)
        setPath(pathDetails);
    }

    {/* Delete Path Function */ }
    const deletePath = async () => {
        let result = await Fetch(host + `/teacher/paths/${path.id}/delete`, 'DELETE');

        if (result.status === 200) {
            setSnackBar('success', <FormattedMessage id="deleted_success" />);
            setPaths(prev => prev.filter(prev_path => prev_path.id !== path.id));
            setPath(null);
        }
    }

    useEffect(() => {
        if (!wait)
            getPaths();
    }, [page, search, wait]);

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
                                            <Typography variant="h5" className="py-2 px-3 max-sm:!text-lg"><FormattedMessage id='paths' /></Typography>
                                            <Button variant="contained" onClick={() => setPopup('add', 'flex')} className="">
                                                <AddIcon />
                                                <FormattedMessage id='add_path' />
                                            </Button>
                                        </Box>
                                        <Box>
                                            <TableContainer component={Paper} dir={language === 'en' ? 'ltr' : "rtl"}>
                                                {/* Top Table */}
                                                <Box className="min-h-12 py-2 px-2 flex justify-between items-center max-sm:flex-col">
                                                    <Box className="w-full flex items-center">
                                                        <Box className="w-2/4 relative mr-3 max-sm:w-full">
                                                            <input style={{ backgroundColor: theme.palette.background.default }} onChange={(e) => setSearch(e.target.value)} className="w-10/12 h-12 rounded-md border indent-14 outline-none max-sm:w-full" placeholder={intl.formatMessage({ id: "search_path" })} />
                                                            <SearchOutlinedIcon className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" sx={{ right: language === 'en' && '90%' }} />
                                                        </Box>
                                                    </Box>
                                                    <Box className="flex w-2/4 justify-end items-center max-sm:mt-2 max-sm:w-full max-sm:justify-between">
                                                        <Typography variant="body1" className="!text-gray-500"><FormattedMessage id='total_paths' />: {pathsCounts}</Typography>
                                                    </Box>
                                                </Box>

                                                {/* Paths Table */}
                                                <Table className="" sx={{ minWidth: 700 }} aria-label="customized table">
                                                    <TableHead className="bg-gray-200">
                                                        <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='thumbnail' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='path_name' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='category' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'}><FormattedMessage id='price' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='publication_date' /></StyledTableCell>
                                                            <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center"><FormattedMessage id='procedures' /></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {paths.map((path, index) =>
                                                            <StyledTableRow key={index} className="hover:bg-gray-400 duration-100 cursor-pointer">
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'}><img src={path.image} className="w-10 h-10 rounded-full" /></StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} component="th" scope="row">{language === 'en' ? path.name_en : path.name_ar}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'}>{language === 'en' ? path.category.name_en : path.category.name_ar}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="">{path.price}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!text-center" dir="ltr">{path.created_at.split(" ")[0]}</StyledTableCell>
                                                                <StyledTableCell align={language === 'en' ? 'left' : 'right'} className="!flex justify-center" dir="ltr">
                                                                    <Button variant="contained" color="success" onClick={(e) => { e.stopPropagation(); getPathDetails(path.id, null, 'update'); setPopup('update', 'flex') }}><FormattedMessage id="update" /></Button>
                                                                    <Button variant="contained" color="error" onClick={() => { setPopup('delete', 'flex') }} className="!mx-2"><FormattedMessage id="delete" /></Button>
                                                                    <Button variant="contained" color="info" onClick={() => navigate(`/courses/paths/${path.id}`)}><FormattedMessage id="courses" /></Button>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>

                                                {/* Pagination Buttons */}
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

                        {/* Update Path Popup */}
                        <Box id="update" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center hidden max-sm:left-0">
                            <UpdatePath onComplete={getPaths} onClickClose={() => setPopup('update', 'none')} pathDetails={path} />
                        </Box>

                        {/* Add Path Popup */}
                        <Box id="add" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center hidden max-sm:left-0">
                            <AddPath onComplete={getPaths} onClickClose={() => setPopup('add', 'none')} />
                        </Box>

                        {/* Delete Course Popup */}
                        <Box id="delete" sx={{ right: language === 'en' && '0' }} className="w-4/5 h-screen fixed top-0 bg-gray-200 bg-opacity-5 justify-center items-center hidden max-sm:left-0">
                            <DeleteDialog onClickCancel={() => setPopup('delete', 'none')} onClickConfirm={deletePath} title={<FormattedMessage id="delete_path_title" />} subtitle={<FormattedMessage id="delete_path_description" />} />
                        </Box>
                    </Box>
            }

            {/* Snackbar Alert */}
            <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
        </>
    );
}

export default Paths;