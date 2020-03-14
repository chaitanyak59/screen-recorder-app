import { desktopCapturer, remote } from "electron";
const { Menu, getCurrentWindow } = remote

const currentWindow = getCurrentWindow();
export async function getVideoSources(callback: (source: Electron.DesktopCapturerSource) => Promise<void>): Promise<void> {
    const inputSource = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });
    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSource
            .filter(item => item.name !== currentWindow.getTitle())
            .map(item => ({
                label: item.name,
                click: (): Promise<void> => callback(item)
            }))
    );
    // Onclick ...
    videoOptionsMenu.popup();
}