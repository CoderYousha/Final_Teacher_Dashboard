import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useConstants } from "../hooks/UseConstants";
import { FormattedMessage } from "react-intl";
import { useWaits } from "../hooks/UseWait";
import Fetch from "../services/Fetch";
import SnackbarAlert from "../components/SnackBar";
import useSnackBar from "../hooks/UseSnackBar";
import { useParams } from "react-router-dom";
import { usePaths } from "../hooks/UsePaths";
import { buildPathFormData } from "../helper/PathFormData";
import { useContext, useEffect, useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import UploadImage from '../images/icons/upload-image.png';
import AuthContext from "../context/AuthContext";
import MultipleSelectChipPagination from "../components/MultiSelectPagination";

function AddPath({ onComplete, onClickClose }) {
    const { language, host } = useConstants();
    const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
    const theme = useTheme();
    const { sendWait, setSendWait, getWait, setGetWait } = useWaits();
    const { nameEn, nameAr, descriptionAr, descriptionEn, image, courseIds, categoryId, price, setDescriptionAr, setDescriptionEn, setNameAr, setNameEn, setImage, setCourseIds, setCategoryId, setPrice } = usePaths();
    const param = useParams();
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [option, setOption] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const { profile } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const effectRan = useRef(false);

    const resetValues = () => {
        setNameEn('');
        setNameAr('');
        setDescriptionEn('');
        setDescriptionAr('');
        setImage('');
        setCategoryId('');
        setPrice('');
        setCourseIds([]);
    }


    const loadCategories = async (search, loadedOptions, { page }) => {
        let result = await Fetch(host + `/categories?page=${page}`, 'GET', null);

        if (result.status == 200) {
            setCategories(result.data.data.data);
        }
        return {
            options: result.data.data.data.map(
                item => ({ value: item.id, label: language == 'ar' ? item.name_ar : item.name_en, })),
            hasMore: result.data.data.current_page * result.data.data.per_page < result.data.data.total, additional: { page: page + 1, },
        };
    }

    const createPath = async () => {
        setSendWait(true);

        const formData = buildPathFormData({
            nameEn: nameEn,
            nameAr: nameAr,
            descriptionEn: descriptionEn,
            descriptionAr: descriptionAr,
            categoryId: categoryId,
            courses: courseIds,
            image: image,
            price: price,
        });

        let result = await Fetch(host + `/teacher/paths/store`, 'POST', formData);

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

    const getCourses = async (page) => {
        setIsLoading(true);

        let result = await Fetch(host + `/courses?teacher_id=${profile.id}&page=${page}`);

        if (result.status == 200) {
            setTotalPages(result.data.pagination.total);
            setPerPage(result.data.pagination.per_page);
            setCourses((prev) => [...prev, ...result.data.data]);
            if(page == 1){
                
            }
        }

        setIsLoading(false);
    }

    useEffect(() => {
        if(!effectRan.current){
            getCourses(page);
            effectRan.current = true;
        }
        if(page !== 1){
            getCourses(page);
        }
    }, [page]);

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-screen rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='add_path' /></Typography>
            <CloseIcon onClick={() => { resetValues(); onClickClose(); }} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{ left: language === 'en' && '90%' }} fontSize="large"></CloseIcon>
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
                <Box className="my-4"></Box>
                <AsyncPaginate
                    className='z-50'
                    value={option}
                    loadOptions={loadCategories}
                    onChange={option => {
                        setOption(option);
                        setCategoryId(option.value);
                    }}
                    placeholder={<FormattedMessage id="category" />}
                    additional={{ page: 1 }}
                    isSearchable={false}
                />
                <Box className='w-full mt-4'>
                    <MultipleSelectChipPagination page={page} perPage={perPage} total={totalPages} setPage={setPage} isLoading={isLoading} title={<FormattedMessage id="courses" />} data={courses} onChange={(value) => setCourseIds(value)} />
                </Box>
                <TextField type="number" onChange={(e) => setPrice(e.target.value)} value={price} className="w-full !mt-4" id="standard-basic" label={<FormattedMessage id="price" />} variant="outlined" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                <Box className="relative w-full h-32 bg-gray-200 rounded-xl mt-5 flex flex-col items-center justify-center cursor-pointer">
                    <img src={UploadImage} className="" />
                    <Typography variant="body1" className="text-gray-700"><FormattedMessage id='add_image' /></Typography>
                    <input type="file" accept="image/*" className="w-full h-full opacity-0 absolute cursor-pointer" onChange={(e) => setImage(e.target.files[0])} />
                </Box>
                <Box className='py-2 flex justify-between'>
                    <Button onClick={createPath} variant="contained" className="w-2/5">
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

export default AddPath;