import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const MenuData = [
    {
        path: '/',
        name: 'Home',
        icon: <HomeIcon />
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <DashboardIcon />
    },
    {
        path: '/list',
        name: 'List',
        icon: <FormatListBulletedIcon />
    },
    {
        path: '/chart',
        name: 'Chart',
        icon: <QueryStatsIcon />
    },
];