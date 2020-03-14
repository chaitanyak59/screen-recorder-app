import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { loadAppEvents } from './app';

app.commandLine.appendArgument("--enable-features=Metal"); // For Screen Recorder
function isDev(): boolean {
    return process.argv[2] == '--dev';
}

/* 
    IN Packaged App, it runs in /app context, 
    so refer whole build dir
*/ 
const htmlViewPath = path.join(isDev() ? '' : 'build', 'view', 'index.html')
const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1017,
        height: 755,
        title: 'Chai Recorder',
        show: false,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
        },
        acceptFirstMouse: true
    })

    mainWindow.loadFile(htmlViewPath)
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    if(isDev()) {
        mainWindow.webContents.openDevTools();
    }
}

loadAppEvents(app, createWindow);