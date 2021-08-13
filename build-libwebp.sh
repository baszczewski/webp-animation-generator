#!/bin/bash -x

# verify Emscripten version
emcc -v

# clone repository
git clone https://github.com/webmproject/libwebp

# go to library directory
cd libwebp

# prepare configuration
./autogen.sh

# configure with Emscripten
FLAGS=(
  --enable-cross-compile  # enable cross compile
  --disable-x86asm        # disable x86 asm
)
emconfigure ./configure "${FLAGS[@]}" 

# build dependencies
emmake make -j16

mkdir -p wasm/dist

ARGS=(
  -I. 
  -I./examples
  -I./src
  -I./imageio
  -Llibwebp
  -Qunused-arguments
  -o ../dist/img2webp.js examples/img2webp.c examples/example_util.c imageio/*.c src/{dec,dsp,demux,enc,mux,utils}/*.c
  -s INVOKE_RUN=0 
  -s EXPORT_ES6
  -s USE_LIBPNG
  -s USE_ZLIB
  -s EXPORTED_FUNCTIONS="[_main, _malloc]" # export main funcs
  -s EXTRA_EXPORTED_RUNTIME_METHODS="[FS, cwrap, setValue, writeAsciiToMemory]" # export preamble funcs
  -s INITIAL_MEMORY=33554432 # 33554432 bytes = 32 MB
)
emcc "${ARGS[@]}"