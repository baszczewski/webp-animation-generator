interface IFrameParams {
    delay?: number;
    compression?: number;
}
interface IFrameParamsExt extends IFrameParams {
    imageName: string;
    data: Uint8Array;
}
declare const DEFULT_DELAY = 24;
declare const DEFULT_COMPRESSION = 100;
declare var Module: any;
declare let animationFrames: IFrameParamsExt[];
declare let img2webp: any;
declare function addFrame(data: Uint8Array, params: IFrameParams): void;
declare function generate(): void;
