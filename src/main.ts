export interface IFrameParams {
    delay?: number;
    compression?: number;
}

interface IFrameParamsExt extends IFrameParams {
    imageName: string;
}

const DEFULT_DELAY = 24;

const DEFULT_COMPRESSION = 100;

function imageDataFromCanvas(canvas: HTMLCanvasElement) {
    const byteString = atob(canvas.toDataURL("image/webp").replace(/^data:image\/(png|jpg|webp);base64,/, ""));
    var ia = new Uint8Array(byteString.length);
    for (var j = 0; j < byteString.length; j++) {
      ia[j] = byteString.charCodeAt(j);
    }
  
    return ia;
}

export class AnimationGenerator {
    protected instance: any;
    protected frames: IFrameParamsExt[] = [];

    async init(libraryPath: string) {
        if (this.instance) {
            return;
        }

        const Module = await import(libraryPath);
        this.instance = await Module.default();
    }
    
    addFrame(canvas: HTMLCanvasElement, params: IFrameParams ): void
    addFrame(imageData: Uint8Array, params: IFrameParams): void
    addFrame(image: Uint8Array|HTMLCanvasElement, params: IFrameParams = {}) {
        const newParams: IFrameParams = {
            ...params,
        };

        const imageName = `image-${this.frames.length}`;
        
        let newImageData: any = null;

        if (image instanceof HTMLCanvasElement) {
            newImageData = imageDataFromCanvas(image);
        } else {
            newImageData = image;
        }

        this.instance.FS.writeFile(imageName, newImageData);

        this.frames.push({
            ...params,
            imageName,
        });
    }

    async generate() {
        const output = 'export.webp';

        const args = [
            'img2webp',
            '-o',
            output,
        ];

        for (const frame of this.frames) {
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
        
        const argsPtr = this.instance._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
        args.forEach((s, idx) => {
          const buf = this.instance._malloc(s.length + 1);
          this.instance.writeAsciiToMemory(s, buf);
          this.instance.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
        });

        this.instance._main(args.length, argsPtr);

        const data = this.instance.FS.readFile(output);

        return data;
    }

    release() {
        if (!this.instance) {
            return;
        }

        this.instance = null;
    }
}
