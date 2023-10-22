import React from 'react';
import ReactDOM from 'react-dom';
import NaiveRouter from './naive-router';
import NaiveNavbar from './naive-navbar';

ReactDOM.render(
    <NaiveRouter />,
    document.getElementById('router')
);

ReactDOM.render(
    <NaiveNavbar />,
    document.getElementById('navbar')
);
