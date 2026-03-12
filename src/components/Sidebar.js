import { Box, Typography, useTheme } from "@mui/material";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import LogoImage from "../images/logo/logo.png";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { FormattedMessage } from "react-intl";
import { useConstants } from "../hooks/UseConstants";
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';

function Sidebar() {
     const { language } = useConstants();
     const theme = useTheme();
     const { wait } = useContext(AuthContext);

     const items = [
          {
               'title': <FormattedMessage id="dashboard" />,
               'icon': <DashboardOutlinedIcon fontSize="medium" className="mx-2 max-sm:mx-auto" />,
               'link': '../dashboard'
          },
          // {
          //      'title': <FormattedMessage id="notifications" />,
          //      'icon': <NotificationsNoneOutlinedIcon fontSize="medium" className="mx-2 max-sm:mx-auto" />,
          //      'link': '../notifications',
          // },
          {
               'title': <FormattedMessage id="courses" />,
               'icon': <CastForEducationOutlinedIcon fontSize="medium" className="mx-2 max-sm:mx-auto" />,
               'link': '../courses',
          },
          {
               'title': <FormattedMessage id="paths" />,
               'icon': <RouteOutlinedIcon fontSize="medium" className="mx-2 max-sm:mx-auto" />,
               'link': '../paths',
          },
     ];
     return (
          <>
               {
                    !wait &&
                    <Box sx={{ backgroundImage: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'linear-gradient(to bottom, #0D358C, #040E26)', left: language === 'en' && '0% !important' }} className="text-white w-1/5 h-screen fixed right-0 top-0 shadow-sm shadow-neutral-400 max-sm:w-1/6 overflow-y-scroll none-view-scroll z-0">
                         <Box className="w-4/5 mx-auto mt-5 text-white font-bold text-center py-3">
                              <img src={LogoImage} className="w-full" />
                         </Box>
                         <Box className="mt-10 cursor-pointer !z-0">
                              {
                                   items.map((item, index) =>
                                        <NavLink key={index} to={item.link} className="flex items-center w-4/5 mx-auto py-2 rounded-lg mt-5" dir={language === 'en' ? 'ltr' : 'rtl'}>
                                             {item.icon}
                                             <Typography variant="h6" className="px-2 max-sm:hidden" style={{ color: item.color }}>{item.title}</Typography>
                                        </NavLink>
                                   )
                              }
                         </Box>
                    </Box>
               }
          </>
     );
}

export default Sidebar;