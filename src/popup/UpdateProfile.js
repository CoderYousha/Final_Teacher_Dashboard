import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PhoneInput from 'react-phone-input-2';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useUpdateProfile } from '../hooks/UseUpdateProfile';
import UploadImage from '../images/icons/upload-image.png';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useWaits } from '../hooks/UseWait';
import { useConstants } from '../hooks/UseConstants';
import Fetch from '../services/Fetch';
import { buildProfileFormData } from '../helper/ProfileFormData';
import { FormattedMessage } from 'react-intl';

function UpdateProfile({ onClickCancel, setSnackBar }) {
    const {host, language} = useConstants();
    const { profile, setProfile } = useContext(AuthContext);
    const { firstName, setFirstName, lastName, setLastName, code, setCode, phoneNumber, setPhoneNumber, image, setImage, birthDate, setBirthDate } = useUpdateProfile();
    const { sendWait, setSendWait } = useWaits();
    const theme = useTheme();

    const handleChange = (value, country, e, formattedValue) => {
        console.log("Full value:", value);
        console.log("Formatted:", formattedValue);
        console.log("Country object:", country);
        console.log("Dial code:", country.dialCode);

        const numberWithoutCode = value.replace(country.dialCode, "");
        console.log("Number without code:", numberWithoutCode);
        setCode(country.dialCode);
        setPhoneNumber(numberWithoutCode);
    };

    const setInputs = () => {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setCode(profile.code);
        setPhoneNumber(profile.phone);
        setBirthDate(profile.birth_date);
    }

    const updateProfile = async () => {
        setSendWait(true);

        const formData = buildProfileFormData({
            firstName: firstName,
            lastName: lastName,
            image: image,
            phoneCode: code,
            phoneNumber: phoneNumber,
            email: profile.email,
        });

        let result = await Fetch(host + '/account/update-profile', 'POST', formData);
        
        if(result.status === 200){
            setProfile(result.data.data);
            setSnackBar('success', <FormattedMessage id='updated_success' />)
            onClickCancel();
        }else if(result.status === 422){
            setSnackBar('error', result.data.errors[0]);
        }

        setSendWait(false);
    }

    useEffect(() => {
        setInputs();
    },[]);

    return (
        <Box sx={{ background: theme.palette.background.paper }} className="w-1/2 h-3/4 rounded-xl py-3 px-5 overflow-y-scroll none-view-scroll max-sm:w-5/6">
            <Box className="w-20 h-20 rounded-full mx-auto my-5 flex justify-center items-center" sx={{ background: "#E8EEFD" }}>
                <EditOutlinedIcon className='text-blue-500 !text-5xl' />
            </Box>
            <Typography variant='h5' fontWeight={800} className='text-center'><FormattedMessage id="update_profile" /></Typography>
            <Typography variant='body1' className='text-center !mt-5 text-gray-700'><FormattedMessage id="update_profile_description" /></Typography>
            <TextField className='w-full !mt-5' label={<FormattedMessage id="first_name" />}onChange={(e) => setFirstName(e.target.value)} value={firstName} />
            <TextField className='w-full !mt-5' label={<FormattedMessage id="last_name" />} onChange={(e) => setLastName(e.target.value)} value={lastName} />
            <TextField type='date' className='w-full !mt-5' label={<FormattedMessage id="birth_date" />} onChange={(e) => setBirthDate(e.target.value)} value={birthDate} />
            <Box dir="ltr" className="w-full h-14 mt-5 max-sm:h-12">
                <PhoneInput country={'us'} value={code + phoneNumber} containerStyle={{ width: "100%" }} buttonStyle={{ background: theme.palette.mode === 'dark' ? 'none' : '' }} inputStyle={{ width: '100%', height: "100%", color: theme.palette.mode === 'dark' ? 'white' : 'black', background: 'none' }} onChange={handleChange} />
            </Box>
            <Box className="relative w-full h-32 bg-gray-200 rounded-xl mt-5 flex flex-col items-center justify-center cursor-pointer">
                <img src={UploadImage} className="" />
                <Typography variant="body1" className="text-gray-700"><FormattedMessage id="add_image" /></Typography>
                <input type="file" accept="image/*" className="w-full h-full opacity-0 absolute cursor-pointer" onChange={(e) => setImage(e.target.files[0])} />
            </Box>
            <Box className="py-3 flex justify-between max-sm:flex-col" sx={{flexDirection: language === 'en' && 'row-reverse'}}>
                <Button onClick={updateProfile} variant='contained' className='w-2/5 !py-3 flex max-sm:w-full !text-white'>
                    {
                        sendWait ?
                            <CircularProgress size={20} className="" color="white" />
                            :
                            <>
                                <FormattedMessage id="save" />
                                <SaveOutlinedIcon className='ml-2' />
                            </>

                    }
                </Button>
                <Button onClick={() => {setInputs(); onClickCancel();}} variant='contained' className='w-2/5 !py-3 flex !text-gray-500 !font-bold max-sm:w-full max-sm:!mt-3' color='inherit'><FormattedMessage id="cancel" /></Button>
            </Box>
        </Box>
    );
}

export default UpdateProfile;