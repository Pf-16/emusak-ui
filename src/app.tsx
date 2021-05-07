import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppRouter from "./ui/router";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import discord_logo from "./assets/discord_logo.png"
import {
  createMuiTheme,
  CssBaseline,
  makeStyles,
  ThemeProvider
} from "@material-ui/core";
import * as electron from "electron";
import "@sweetalert2/themes/dark/dark.min.css"
import Changelog from "./ui/changelog";
import {Alert} from "@material-ui/lab";
import {useState} from "react";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();
  const version = electron.remote.app.getVersion();
  const [latestRelease, setLatestRelease]: [string|null, Function] = useState(null);
  document.querySelector("title").innerText = `Emusak v${version}`

  React.useEffect(() => {
    fetch('https://api.github.com/repos/stromcon/emusak-ui/releases/latest')
      .then(r => r.json())
      .then((release: any) => {
        setLatestRelease(release.tag_name.replace('v', ''));
      })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              EmuSAK
            </Typography>
            <IconButton onClick={() => electron.shell.openExternal("https://discord.gg/nKstg6x")} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <img height={30} src={discord_logo} alt=""/>
            </IconButton>
          </Toolbar>
        </AppBar>

        {
          (version !== latestRelease && latestRelease && process.platform !== "win32") && (
            <div style={{ padding: 20 }}>
              <Alert severity="info">You have version v{version}, please consider update to latest version from <a href="#" onClick={() => electron.shell.openExternal("https://github.com/stromcon/emusak-ui")}>Github</a> (v{latestRelease})</Alert>
            </div>
          )
        }

        <AppRouter />
        <Changelog />
      </CssBaseline>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <App />,
  document.querySelector("#app")
);
