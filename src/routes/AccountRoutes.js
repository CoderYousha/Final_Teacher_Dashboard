import Profile from "../pages/account/Profile";

function AccountRoutes () {
    return [
        {
            path: '/profile',
            element: <Profile />
        },
    ];
}

export default AccountRoutes;