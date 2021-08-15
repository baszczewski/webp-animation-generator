function imageDataFromCanvas(canvas) {
    const byteString = atob(canvas.toDataURL("image/webp").replace(/^data:image\/(png|jpg|webp);base64,/, ""));
    const ia = new Uint8Array(byteString.length);
    for (let j = 0; j < byteString.length; j++) {
        ia[j] = byteString.charCodeAt(j);
    }
    return ia;
}
export class AnimationGenerator {
    async init(library) {
        if (this.worker) {
            return;
        }
        let resolve = null;
        let reject = null;
        let promise = new Promise((resolveValue, rejectValue) => {
            resolve = resolveValue;
            reject = rejectValue;
        });
        this.worker = new Worker(library);
        this.worker.onmessage = (e) => {
            const method = e.data.shift();
            switch (method) {
                case 'ready':
                    resolve();
                    break;
                case 'generate':
                    this.generateResolve(e.data[0]);
                    break;
            }
        };
        await promise;
    }
    addFrame(image, params = {}) {
        let newImageData = null;
        if (image instanceof HTMLCanvasElement) {
            newImageData = imageDataFromCanvas(image);
        }
        else {
            newImageData = image;
        }
        this.worker.postMessage(['addFrame', newImageData, params]);
    }
    async generate() {
        let promise = new Promise((resolveValue, rejectValue) => {
            this.generateResolve = resolveValue;
            this.generateReject = rejectValue;
        });
        this.worker.postMessage(['generate']);
        return await promise;
    }
    release() {
        if (!this.worker) {
            return;
        }
        this.worker.terminate();
        this.worker = null;
    }
}
//# sourceMappingURL=main.js.map