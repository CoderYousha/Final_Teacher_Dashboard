import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Fetch from "../services/Fetch";
import { AsyncPaginate } from "react-select-async-paginate";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { FormattedMessage } from "react-intl";

function CoursesFilter({ onClickClose, onClickConfirm, categoriesValue, setCategoriesValue, setCategory, pathsValue, setPathsValue, setPath, fromCount, setFromCount, toCount, setToCount, fromDate, setFromDate, toDate, setToDate, filterWait, setFilterWait }) {
    const language = localStorage.getItem('language');
    const theme = useTheme();

    const resetFilter = () => {
        setCategory('');
        setPath('');
        setFromCount('');
        setToCount('');
        setFromDate('');
        setToDate('');
        setCategoriesValue('');
        setPathsValue('');
    }

    const loadCategories = async (search, loadedOptions, { page }) => {
        const host = `${process.env.REACT_APP_LOCAL_HOST}`;
        const response = await Fetch(host + `/categories?page=${page}`);
        const optionsFromApi = response.data.data.data.map((item) => ({
            value: item.id, label: language === 'en' ? item.name_en : item.name_ar,
        }));
        return {
            options: [{ value: '', label: <FormattedMessage id='all' /> }, ...optionsFromApi],

            hasMore: response.data.data.current_page * response.data.data.per_page < response.data.data.total, additional: { page: page + 1, },
        };
    }

    const loadPaths = async (search, loadedOptions, { page }) => {
        const host = `${process.env.REACT_APP_LOCAL_HOST}`;
        const response = await Fetch(host + `/paths?page=${page}`);

        const optionsFromApi = response.data.data.map((item) => ({
            value: item.id, label: language === 'en' ? item.name_en : item.name_ar,
        }));
        return {
            options: [{ value: '', label: <FormattedMessage id='all' /> }, ...optionsFromApi],

            hasMore: response.data.pagination.current_page * response.data.pagination.per_page < response.data.pagination.total, additional: { page: page + 1, },
        };
    }

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='filtering_courses' /></Typography>
            <CloseIcon onClick={onClickClose} className="text-gray-700 cursor-pointer absolute top-5 left-5" sx={{left: language === 'en' && '90%'}} fontSize="large"></CloseIcon>
            <Divider className="!my-5" />
            <Box className=""></Box>
            <Typography variant="body1"><FormattedMessage id='category' /></Typography>
            <AsyncPaginate
                value={categoriesValue}
                loadOptions={loadCategories}
                onChange={(option) => { setCategoriesValue(option); setCategory(option.value) }}
                additional={{
                    page: 1
                }}
                className="mt-2 !bg-gray-200"
                placeholder={<FormattedMessage id='category' />}
                styles={{
                    option: (provided, state) => ({
                        ...provided,
                        color: 'black'
                    }),
                }}
                isSearchable={false}
            />
            <Typography variant="body1" className="!mt-5"><FormattedMessage id='education_path' /></Typography>
            <AsyncPaginate
                value={pathsValue}
                loadOptions={loadPaths}
                onChange={(option) => { setPathsValue(option); setPath(option.value) }}
                additional={{
                    page: 1
                }}
                className="mt-2 !bg-gray-200"
                placeholder={<FormattedMessage id='education_path' />}
                styles={{
                    option: (provided) => ({
                        ...provided,
                        color: 'black'
                    }),
                }}
                isSearchable={false}
            />
            <Typography variant="body1" className="!mt-5"><FormattedMessage id='course_files_count' /></Typography>
            <Box className="mt-2 flex justify-between">
                <TextField value={fromCount} onChange={(e) => setFromCount(e.target.value)} type="number" className="w-5/12" label={<FormattedMessage id='from' />}></TextField>
                <TextField value={toCount} onChange={(e) => setToCount(e.target.value)} type="number" className="w-5/12" label={<FormattedMessage id='to' />}></TextField>
            </Box>
            <Typography variant="body1" className="!mt-5"><FormattedMessage id='publication_date' /></Typography>
            <Box className="mt-2 flex justify-between">
                <TextField sx={{ '& input::-webkit-datetime-edit': { color: 'transparent' }, '& input:focus::-webkit-datetime-edit': { color: 'inherit' } }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="w-5/12" label={<FormattedMessage id='from' />}></TextField>
                <TextField sx={{ '& input::-webkit-datetime-edit': { color: 'transparent' }, '& input:focus::-webkit-datetime-edit': { color: 'inherit' } }} defaultValue="2026-12-30" value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="w-5/12" label={<FormattedMessage id='to' />}></TextField>
            </Box>

            {/* Buttons Container */}
            <Box className="w-full flex justify-between mt-10 max-sm:!flex-col" sx={{flexDirection: language === 'en' && 'row-reverse'}}>
                <Button variant="contained" className="w-5/12 h-10 !bg-gray-300 !text-gray-500 !font-semibold hover:!bg-gray-200 duration-300 max-sm:w-full" onClick={resetFilter}><FormattedMessage id='reset' /></Button>
                <Button variant="contained" className="w-5/12 h-10 max-sm:w-full max-sm:!mt-5 !text-white hover:bg-blue-400 duration-300" onClick={() => { setFilterWait(true); onClickConfirm(); }}>
                    <Box>
                        {
                            filterWait ?
                                <CircularProgress size={20} className="" color="white" />
                                :
                                <Box>
                                   <FormattedMessage id='filtering' />
                                    <FilterAltOutlinedIcon />
                                </Box>
                        }
                    </Box>
                </Button>
            </Box>
        </Box>
    );
}

export default CoursesFilter;