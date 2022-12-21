import React from 'react';
import ReactDOM from 'react-dom';

import "./styles/Reset.scss";

//components
import { Header } from './components/Header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Header roomcode="1234" />);
