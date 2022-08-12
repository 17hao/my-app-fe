import React from 'react';
import ReactDOM from 'react-dom';
import MyRouter from './MyRouter';
import MyNavbar from './MyNavbar';

ReactDOM.render(
	<MyRouter />,
	document.getElementById('root')
);

ReactDOM.render(
	<MyNavbar />,
	document.getElementById('navbar')
);
