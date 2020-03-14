import { remote } from 'electron';
import { promises } from 'fs';

const { dialog } = remote;

const recordingSession = {
    data: [],
    set: function (chunk: Blob): void {
        this.data.push(chunk as never)
    },
    get: function <T>(): Array<T> {
        return this.data;
    },
    clear: function (): void {
        this.data = []
    }
};

// Captures all recorded chunks
export function handleSessionDataAvailable(e: BlobEvent): void {
    console.log('video data available');
    recordingSession.set(e.data);
}

// Saves the video file on stop
export async function handleSesssionStop(): Promise<void> {
    const blob = new Blob(recordingSession.get(), {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await new Response(blob).arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        title: "Save Screen Recording",
        defaultPath: `Video-${Date.now()}.webm`
    });

    if (filePath) {
        await promises.writeFile(filePath, buffer);
    }
}