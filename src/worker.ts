interface IFrameParams {
    delay?: number;
    compression?: number;
}

interface IFrameParamsExt extends IFrameParams {
    imageName: string;
    data: Uint8Array;
}

const DEFULT_DELAY = 24;

const DEFULT_COMPRESSION = 100;

declare var Module: any;

self.importScripts("./img2webp.js");

let animationFrames: IFrameParamsExt[] = [];
let img2webp: any;

Module.onRuntimeInitialized = () => {
    img2webp = Module.cwrap('main', 'number', ['number', 'number']);

    // @ts-ignore
    postMessage(['ready']);
};

function addFrame(data: Uint8Array, params: IFrameParams) {
    const imageName = `image-${animationFrames.length}`;

    animationFrames.push({
        ...params,
        imageName,
        data,
    });
}

function generate() {
    for (const frame of animationFrames) {
        Module.FS.writeFile(frame.imageName, frame.data);
    }

    const output = 'export.webp';

    const args = [
        'img2webp',
        '-o',
        output,
    ];

    for (const frame of animationFrames) {
        const compression = frame.compression || DEFULT_COMPRESSION;
        const delay = Math.max(1, frame.delay || DEFULT_DELAY);

        if (compression >= 100) {
            args.push(...[
                '-lossless', 
            ]);
        } else {
            args.push(...[
                '-lossy', 
                '-q',
                '' + compression,
            ]);
        }

        args.push(...[
            '-d', 
            '' + delay, 
            frame.imageName,
        ]);
    }
    
    const argsPtr = Module._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
    args.forEach((s, idx) => {
        const buf = Module._malloc(s.length + 1);
        Module.writeAsciiToMemory(s, buf);
        Module.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
    });

    Module._main(args.length, argsPtr);

    const data = Module.FS.readFile(output);

    // @ts-ignore
    postMessage(['generate', data]);
}

onmessage = (e) => {
    if (!e.data || !e.data.length) {
        return;
    }

    const method = e.data.shift();

    switch (method) {
    case 'addFrame':
        addFrame(e.data[0], e.data[1]);
        break;
    case 'generate':
        generate();
        break;
    }
}
