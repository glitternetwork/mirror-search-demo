import type { RouteObject } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom'
import Index from '../App';
import Detial from '../pages/Detial';
import SearchResult from '../pages/SearchResult';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Index />,
    },
    {
        path: '/search/:q',
        element: <SearchResult />,
    },
    {
        path: '/detail/:id',
        element: <Detial />,
    },

    {
        path: '*',
        element: <Index />,
    },
];

const router = createHashRouter(routes);

export default router;
