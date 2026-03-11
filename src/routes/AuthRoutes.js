import Login from "../pages/auth/Login";

function AuthRoutes () {
    return [
        {
            path: '/login',
            element: <Login />,
        }
    ];
}

export default AuthRoutes;