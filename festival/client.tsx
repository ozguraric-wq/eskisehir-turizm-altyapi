import React from 'react';
import {createRoot} from 'react-dom/client';
import FestivalApp from './components/festival/FestivalApp';
import './app/globals.css';
createRoot(document.getElementById('root')!).render(<FestivalApp/>);
