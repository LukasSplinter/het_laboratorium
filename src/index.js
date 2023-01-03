import React from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from "react-dom/client";

import "./styles/Reset.scss";

import { Main } from "./Main"

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
