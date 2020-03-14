import { remote, } from 'electron';
const { getCurrentWindow } = remote;
import {
    getVideoSources,
    handleSessionDataAvailable,
    handleSesssionStop
} from './media-recorder';

let mediaRecorder: MediaRecorder;
const currentWindow = getCurrentWindow();

function registerVideoControls(videoPort: HTMLVideoElement): void {
    const startBtn = document.getElementById('startR');
    const stopBtn = document.getElementById('stopR');

    if (startBtn && stopBtn) {
        startBtn.onclick = (): void => {
            if (mediaRecorder && mediaRecorder.state === 'inactive') {
                mediaRecorder.start();
                startBtn.classList.add('is-danger');
                startBtn.innerText = 'Recording';
                currentWindow.minimize();
            }
        };
        stopBtn.onclick = (): void => {
            if (mediaRecorder && mediaRecorder.state == 'recording') {
                mediaRecorder.stop();
                startBtn.classList.remove('is-danger');
                startBtn.innerText = 'Start';
            }
        };

        if (videoPort) {
            videoPort.onclick = (): void => {
                if (videoPort.srcObject) {
                    if (videoPort.paused) videoPort.play()
                    else videoPort.pause()
                }
            }
        }
    }
}

function start(): void {
    console.log('started')
    const videoPlay = document.getElementById('chooseVid') as HTMLButtonElement;
    const videoPort = document.getElementById('video-port') as HTMLVideoElement;
    registerVideoControls(videoPort);

    async function selectSource(source: Electron.DesktopCapturerSource): Promise<void> {
        if (videoPort) {
            videoPort.innerText = source.name;
            const constraints = {
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id
                    }
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints as any);
            videoPort.srcObject = stream;
            videoPort.play();

            // Create the Media Recorder
            const options = { mimeType: 'video/webm; codecs=vp9' };
            mediaRecorder = new MediaRecorder(stream, options);

            // Register Event Handlers
            mediaRecorder.ondataavailable = handleSessionDataAvailable;
            mediaRecorder.onstop = handleSesssionStop;
        }
    }


    //Register listener
    if (videoPlay) {
        videoPlay.onclick = (): Promise<void> => getVideoSources(selectSource);
    }
}


//Root Point
start()
