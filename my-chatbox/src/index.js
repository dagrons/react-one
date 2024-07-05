import React from 'react';
import App from './App';
import {createRoot} from "react-dom/client";

const container = document.getElementById("app")
createRoot(container).render(<App/>)
