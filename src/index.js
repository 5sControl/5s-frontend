import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

import App from './App';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>
);