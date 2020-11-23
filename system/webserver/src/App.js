import React from 'react';

import NotificationContext from './context/GlobalContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './components/Dashboard';
import Management from './components/Management';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

/*const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});*/
const theme = createMuiTheme({
  palette: {
    type: "dark",
    "primary":{"light":"rgba(121, 203, 183, 1)","main":"rgba(63, 156, 181, 1)","dark":"rgba(48, 159, 151, 1)","contrastText":"#fff"},"secondary":{"light":"rgba(255, 64, 157, 1)","main":"rgba(226, 70, 130, 1)","dark":"rgba(197, 17, 99, 1)","contrastText":"#fff"},
  }
});

// compose value prop as object for NotificationContext
const valueNotification = {
  showNotificationSuccess: (message) => toast.success(message),
  showNotificationError: (message) => toast.error(message)
};

function App() {
  
  const [tabSelected, setTabSelected] = React.useState(0);

  return (
    <ThemeProvider theme={theme}>
      <NotificationContext.Provider value={valueNotification}>
      <CssBaseline/>
        
          <AppBar position="static">
            
            <Tabs value={tabSelected} onChange={(event, newValue) => setTabSelected(newValue)} aria-label="simple tabs example" centered>
              <Tab label="Dashboard" id = "simple-tab-0" aria-controls = "simple-tabpanel-0" />
              <Tab label="Management" id = "simple-tab-1" aria-controls = "simple-tabpanel-1" />
            </Tabs>
          </AppBar>
          <Container fixed>
            <TabPanel value={tabSelected} index={0}>
              <Dashboard></Dashboard>
            </TabPanel>
            <TabPanel value={tabSelected} index={1}>
              <Management></Management>
            </TabPanel>
          </Container>
        <ToastContainer position="bottom-left"/>
        
      </NotificationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
