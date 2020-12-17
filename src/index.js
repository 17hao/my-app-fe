import React from 'react';
import ReactDOM from 'react-dom';
// import LikeButton from './LikeButton';
// import Clock from './Clock.js';
import App from './App';
import MyNavbar from './MyNavbar';

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

ReactDOM.render(
	<MyNavbar />,
	document.getElementById('navbar')
);

// ReactDOM.render(
//   <React.StrictMode>
//     <Clock />
//   </React.StrictMode>,
//   document.getElementById('clock')
// )

// ReactDOM.render(
//   <React.StrictMode>
//     <LikeButton />
//   </React.StrictMode>,
//   document.getElementById('likeButton')
// )
