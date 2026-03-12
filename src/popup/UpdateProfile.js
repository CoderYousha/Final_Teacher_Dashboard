import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AsyncPaginate } from "react-select-async-paginate";
import Fetch from "../services/Fetch";
import AddIcon from '@mui/icons-material/Add';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { useWaits } from "../hooks/UseWait";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useUpdateProfile } from "../hooks/UseUpdateProfile";
import { buildProfileFormData } from "../helper/ProfileFormData";
import { useConstants } from "../hooks/UseConstants";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function UpdateProfile({ onClickClose, setSnackBar, setTeachers }) {
    const { host } = useConstants();
    const { profile, setProfile } = useContext(AuthContext);
    const language = localStorage.getItem('language');
    const { sendWait, setSendWait } = useWaits();
    const theme = useTheme();
    const { firstName, setFirstName, lastName, setLastName, specialization, setSpecialization, academicDegree,
        setAcademicDegree, experienceYears, setExperienceYears, birthdate, setBirthDate, phoneNumber,
        setPhoneNumber, code, setCode, major, setMajor, image, setImage } = useUpdateProfile();
    const [academicDegreeValue, setAcademicDegreeValue] = useState('');
    const [teacherSpecializationsValue, setTeacherSpecializationsValue] = useState('');
    const [majorValue, setMajorValue] = useState('');

    const handleChange = (value, country, e, formattedValue) => {
        console.log("Full value:", value);
        console.log("Formatted:", formattedValue);
        console.log("Country object:", country);
        console.log("Dial code:", country.dialCode);

        const numberWithoutCode = value.replace(country.dialCode, "");
        console.log("Number without code:", numberWithoutCode);
        setCode(country.dialCode);
        setPhoneNumber(numberWithoutCode);
        alert(country.dialCode);
    };

    const loadAcademicDegrees = async (search, loadedOptions, { page }) => {
        const host = `${process.env.REACT_APP_LOCAL_HOST}`;
        const response = await Fetch(host + `/academic-degrees?page=${page}`);
        return {
            options: response.data.data.data.map((item) => ({
                value: item.id, label: language === 'en' ? item.name_en : item.name_ar,
            })),

            hasMore: response.data.data.current_page * response.data.data.per_page < response.data.data.total, additional: { page: page + 1, },
        };
    }

    const loadTeacherSpecializations = async (search, loadedOptions, { page }) => {
        const host = `${process.env.REACT_APP_LOCAL_HOST}`;
        const response = await Fetch(host + `/teacher-specializations?page=${page}`);

        const optionsFromApi = response.data.data.data.map((item) => ({
            value: item.id, label: language === 'en' ? item.name_en : item.name_ar,
        }));
        return {
            options: [...optionsFromApi],

            hasMore: response.data.data.current_page * response.data.data.per_page < response.data.data.total, additional: { page: page + 1, },
        };
    }

    const loadMajors = async (search, loadedOptions, { page }) => {
        const host = `${process.env.REACT_APP_LOCAL_HOST}`;
        const response = await Fetch(host + `/majors?page=${page}`);
        const optionsFromApi = response.data.data.map((item) => ({ value: item.id, label: language === 'en' ? item.name_en : item.name_ar, }));
        return {
            options: optionsFromApi,

            hasMore: response.data.pagination.current_page * response.data.pagination.per_page < response.data.pagination.total, additional: { page: page + 1, },
        };
    }

    const setValues = () => {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setSpecialization(profile.specialization?.id);
        setTeacherSpecializationsValue({ value: profile.specialization?.id, label: language === 'en' ? profile.specialization?.name_en : profile.specialization?.name_ar });
        setAcademicDegree(profile.academic_degree?.id);
        setAcademicDegreeValue({ value: profile.academic_degree?.id, label: language === 'en' ? profile.academic_degree?.name_en : profile.academic_degree?.name_ar });
        setExperienceYears(profile.experience_years);
        setBirthDate(profile.birth_date.split(' ')[0]);
        setPhoneNumber(profile.phone);
        setCode(profile.phone_code);
        setMajor(profile.major?.id);
        setMajorValue({ value: profile.major?.id, label: language === 'en' ? profile.major?.name_en : profile.major?.name_ar });
    }

    const updateProfile = async () => {
        setSendWait(true);

        const formData = buildProfileFormData({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthdate,
            phoneCode: code,
            phoneNumber: phoneNumber,
            specialization: specialization,
            academicDegree: academicDegree,
            experienceYears: experienceYears,
            major: major,
            image: image,
            language: language,
            email: profile.email,
        });


        let result = await Fetch(host + `/account/update-profile`, 'POST', formData);

        if (result.status === 200) {
            setSnackBar('success', <FormattedMessage id="updated_success" />);
            setProfile(result.data.data);
            onClickClose();
        } else if (result.status === 422) {
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    useEffect(() => {
        if (profile)
            setValues();
    }, []);

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper }} className="shadow-lg w-3/5 h-fit rounded-3xl px-4 py-5 overflow-y-scroll none-view-scroll max-sm:w-4/5 max-sm:translate-x-0 max-sm:left-0 relative max-sm:overflow-y-scroll max-sm:h-screen" dir={language === 'en' ? 'ltr' : "rtl"}>
            <Typography variant="h5" className="!font-semibold max-sm:!text-xl"><FormattedMessage id='update_profile' /></Typography>
            <CloseIcon onClick={() => { setValues(); onClickClose(); }} className="text-gray-700 cursor-pointer absolute top-5 left-5" fontSize="large" sx={{ left: language === 'en' && '90%' }}></CloseIcon>
            <Divider className="!my-5" />
            <Box className=""></Box>
            <Box className="grid grid-cols-2 w-full gap-x-2 gap-y-5 mt-5 max-sm:grid-cols-1 max-sm:gap-x-0">
                <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} variant="outlined" className="w-full" label={<FormattedMessage id='first_name' />} />
                <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} variant="outlined" className="w-full" label={<FormattedMessage id='last_name' />} />

                {/* Name Input Container */}
                <Box className="col-span-2 max-sm:col-span-1">
                    <Typography variant="body1"><FormattedMessage id='specialization' /></Typography>
                    <AsyncPaginate
                        value={teacherSpecializationsValue}
                        loadOptions={loadTeacherSpecializations}
                        onChange={(option) => { setTeacherSpecializationsValue(option); setSpecialization(option.value) }}
                        additional={{
                            page: 1
                        }}
                        placeholder={<FormattedMessage id='specialization' />}
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                color: 'black'
                            }),
                        }}
                        isSearchable={false}
                        className="mt-2 !bg-gray-200 z-[600]"
                    />
                </Box>

                {/* Specialization Async Pagination */}
                {/* <Box className="">
                    <Typography variant="body1"><FormattedMessage id='education_specialization' /></Typography>
                    <AsyncPaginate
                        value={majorValue}
                        loadOptions={loadMajors}
                        onChange={(option) => { setMajorValue(option); setMajor(option.value) }}
                        additional={{
                            page: 1
                        }}
                        className="mt-2 !bg-gray-200 z-50"
                        placeholder={<FormattedMessage id='education_specialization' />}
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                color: 'black'
                            }),
                        }}
                        isSearchable={false}
                    />
                </Box> */}

                {/* Education Specialization & Academic Degree Async Pagination */}
                <Box className="col-span-2">
                    <Typography variant="body1"><FormattedMessage id='academic_degree' /></Typography>
                    <AsyncPaginate
                        value={academicDegreeValue}
                        loadOptions={loadAcademicDegrees}
                        onChange={(option) => { setAcademicDegreeValue(option); setAcademicDegree(option.value) }}
                        additional={{
                            page: 1
                        }}
                        className="mt-2 !bg-gray-200 z-50"
                        placeholder={<FormattedMessage id='academic_degree' />}
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                color: 'black',
                            }),
                        }}
                        isSearchable={false}
                    />
                </Box>

                <TextField type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} variant="outlined" className="w-full z-0" label={<FormattedMessage id='experience_years' />} />
                <TextField value={birthdate} onChange={(e) => setBirthDate(e.target.value)} variant="outlined" type="date" defaultValue="2025-01-01" className="w-full" label={<FormattedMessage id='birth_date' />} />
                <TextField value={profile.email} aria-readonly={true} variant="outlined" className="w-full" label={<FormattedMessage id='email' />} />
                <Box dir="ltr" className="w-full h-full max-sm:h-12">
                    <PhoneInput value={code + phoneNumber} country={'us'} containerStyle={{ width: "100%" }} buttonStyle={{ background: theme.palette.mode === 'dark' ? 'none' : '' }} inputStyle={{ width: '100%', height: "100%", color: theme.palette.mode === 'dark' ? 'white' : 'black', background: 'none' }} onChange={handleChange} />
                </Box>
            </Box>

            {/* Buttons Container */}
            <Box className="flex justify-between mt-5 w-full max-sm:flex-col max-sm:items-center" sx={{ flexDirection: language === 'en' && 'row-reverse' }}>
                <Button variant="contained" className="w-5/12 !text-white !font-bold hover:!bg-blue-400 duration-300 max-sm:w-full" onClick={updateProfile}>
                    {
                        sendWait ?
                            <CircularProgress size={20} className="" color="white" />
                            :
                            <>
                                <AddIcon />
                                <FormattedMessage id='update' />
                            </>
                    }
                </Button>
                <Button onClick={() => { setValues(); onClickClose(); }} variant="contained" className="w-5/12 !bg-gray-400 !text-gray-700 !font-bold hover:!bg-gray-200 duration-300 max-sm:w-full max-sm:!mt-2"><FormattedMessage id='cancel' /></Button>
            </Box>
        </Box>
    );
}

export default UpdateProfile;