export interface IFrameParams {
    delay?: number;
    compression?: number;
}
interface IFrameParamsExt extends IFrameParams {
    imageName: string;
}
export declare class AnimationGenerator {
    protected instance: any;
    protected frames: IFrameParamsExt[];
    init(libraryPath: string): Promise<void>;
    addFrame(canvas: HTMLCanvasElement, params: IFrameParams): void;
    addFrame(imageData: Uint8Array, params: IFrameParams): void;
    generate(): Promise<any>;
    release(): void;
}
export {};
