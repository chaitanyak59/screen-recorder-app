import { BrowserWindow, App } from "electron";

export const loadAppEvents = (appInstance: App, createWindowApp: () => void): void => {
    appInstance.on('ready', createWindowApp)
    appInstance.allowRendererProcessReuse = true;
    // Quit when all windows are closed.
    appInstance.on('window-all-closed', function () {
        if (process.platform !== 'darwin') appInstance.quit()
    })

    appInstance.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindowApp()
    });
}
