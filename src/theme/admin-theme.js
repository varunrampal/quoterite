import { createMuiTheme, colors} from '@material-ui/core';
import shadows from './shadow';
import typography from './typography';


 const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white,
      primaryTextColor: '#ffffff'
    },
    primary: {
      main: colors.green[500],
      contrastText: "#fff" //button text white instead of black
    },
    secondary: {
      main: colors.green[500],
      contrastText: "#fff" //button text white instead of black
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    },

  },
  shadows,
  typography
});

 const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      dark: '#B8B2B1',
      default: colors.common.black,
      paper: '#424242'
    },
    primary: {
      main: colors.orange[500],
      contrastText: "#fff" //button text white instead of black
    },
    secondary: {
      main: colors.deepOrange[500],
      contrastText: "#fff" //button text white instead of black
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF'
    },
   
  },
   //shadows,
   typography
});


export {
  lightTheme,
  darkTheme
  
}

