import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <CookiesProvider >
            <App />
        </CookiesProvider>
    </Provider>
);