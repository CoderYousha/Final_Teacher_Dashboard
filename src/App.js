import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/colors.css';
import './styles/constants.css';
import './index.css';
import AuthRoutes from './routes/AuthRoutes';
import NotAuthProvider from './providers/NotAuthProvider';
import { useTheme } from '@mui/material/styles';
import DashboardRoutes from './routes/DashbooardRoutes';
import AuthProvider from './providers/AuthProvider';
import Sidebar from './components/Sidebar';
import Translation from './translation/Translation';
import { IntlProvider } from 'react-intl';
import { useConstants } from './hooks/UseConstants';
import CoursesRoutes from './routes/CoursesRoutes';
import Header from './components/Header';
import AccountRoutes from './routes/AccountRoutes';
import PathsRoutes from './routes/PathsRoutes';

function App() {
  const { language } = useConstants();
  const theme = useTheme();
  const messages = Translation();

  return (
    <main>
      <div className="App" style={{ backgroundColor: theme.palette.background.default }}>
        <BrowserRouter>
          <IntlProvider locale={language} messages={messages[language]}>
            <Routes>
              <Route path='/' element={<Navigate to='/login' />} />
              {
                AuthRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<NotAuthProvider>{route.element}</NotAuthProvider>} />
                )
              }
              {
                DashboardRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role='teacher'><Header /><Sidebar /> {route.element}</AuthProvider>} />
                )
              }
              {
                CoursesRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role='teacher'><Header /><Sidebar /> {route.element}</AuthProvider>} />
                )
              }
              {
                AccountRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role='teacher'><Header isFullWidth={true}/> {route.element}</AuthProvider>} />
                )
              }
              {
                PathsRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role='teacher'><Header /><Sidebar /> {route.element}</AuthProvider>} />
                )
              }
            </Routes>
          </IntlProvider>
        </BrowserRouter>
      </div>
    </main>
  );
}

export default App;
