Create WebP animation from sample images.

```js
import { AnimationGenerator } from '../dist/main.js';

const instance = new AnimationGenerator();

await instance.init('/dist/img2webp.js');

const file1 = await (await fetch('/file-01.webp').then(resp => resp.blob())).arrayBuffer();
const file2 = await (await fetch('/file-02.webp').then(resp => resp.blob())).arrayBuffer();

instance.addFrame(new Uint8Array(file1), { delay: 1000 });
instance.addFrame(new Uint8Array(file2), { delay: 1000 });

const result = await instance.generate();

const blob = new Blob([result.buffer], { type: 'image/webp' });
const img = document.createElement('img');
img.src = URL.createObjectURL(blob);
document.body.appendChild(img)

instance.release();
```