import React from 'react';
import ReactDOM from 'react-dom';
import NaiveNavbar from './naive-navbar';
import NaiveRouter from './naive-router';
import Footer from './footer';

ReactDOM.render(
    <NaiveNavbar />,
    document.getElementById('navbar')
);

ReactDOM.render(
    <NaiveRouter />,
    document.getElementById('router')
);


ReactDOM.render(
    <Footer />,
    document.getElementById('footer')
);
