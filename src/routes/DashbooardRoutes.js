import Dashboard from "../pages/dashboard/Dashboard";

function DashboardRoutes() {
    return [
        {
            path: '/dashboard',
            element: <Dashboard />
        },
    ];
}

export default DashboardRoutes;