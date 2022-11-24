import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import List from './pages/List';
import Chart from './pages/Chart';
import ChartSearch from './pages/ChartSearch';

// Theme
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppContextProvider } from './context/AppContext';
import Navbar from './components/Navbar';

const theme = createTheme({
    palette: {
        text: {
            fontFamily: ["Montserrat", "sans-serif"],
            primary:    '#fff',
            secondary:  'rgba(255, 255, 255, 0.7)',
            disabled:   'rgba(255, 255, 255, 0.5)'
        },
        typography: {
            fontFamily: ["Montserrat", "sans-serif"]
        },
        action: {
            active:             '#fff',
            hover:              '#404040',
            selected:           'rgba(255, 255, 255, 0.16)',
            disabled:           'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
        background: {
            default: '#1a1a1a',
            paper:   '#262626'
        },
        divider: 'rgba(255, 255, 255, 0.12)',
    },
});

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className='flex w-100 min-vh-100'>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/list" element={<List />} />
              <Route exact path="/chart/" element={<ChartSearch />} />
              <Route path="/chart/:id" element={<Chart />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
