interface IFrameParams {
    delay?: number;
    compression?: number;
}
export declare class AnimationGenerator {
    protected worker: any;
    generateResolve: any;
    generateReject: any;
    init(library: any): Promise<void>;
    addFrame(canvas: HTMLCanvasElement, params: IFrameParams): void;
    addFrame(imageData: Uint8Array, params: IFrameParams): void;
    generate(): Promise<unknown>;
    release(): void;
}
export {};
