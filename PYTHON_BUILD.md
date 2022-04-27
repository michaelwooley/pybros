# Building python

# Steps

## 1. Install emscripten

- Follow steps [here](https://emscripten.org/docs/getting_started/downloads.html).
- Easier to build from git than use AUR packages.

## 2. Clone cpython

```bash
git clone https://github.com/python/cpython.git
# make build directories for build (the current system architecture)
# and host, the emscripten/wasi architecture
mkdir -p cpython/builddir/build
mkdir -p cpython/builddir/emscripten-browser
mkdir -p cpython/builddir/emscripten-node
```

## 3. Build cpython

```bash
mkdir -p cpython/builddir/build
pushd cpython/builddir/build
../../configure -C
make -j$(nproc)
popd

# Other ports
embuilder build zlib bzip2
```

## 4. Build wasm module

```bash
mkdir -p cpython/builddir/emscripten-browser

# install emcc ports so configure is able to detect the dependencies
embuilder build zlib bzip2

pushd cpython/builddir/emscripten-browser
CONFIG_SITE=../../Tools/wasm/config.site-wasm32-emscripten \
  emconfigure ../../configure -C \
    --host=wasm32-unknown-emscripten \
    --build=$(../../config.guess) \
    --with-emscripten-target=browser \
    --enable-wasm-dynamic-linking=no \
    --with-build-python=$(pwd)/../build/python \
    "$@"

emmake make -j$(nproc)
# -s MINIFY_HTML=0 -sMODULARIZE -s 'EXPORT_NAME="createMyModule"'

popd
```

# Links

- [`ethanhs/python-wasm`](https://github.com/ethanhs/python-wasm)
- [cpython WASM tools](https://github.com/python/cpython/tree/main/Tools/wasm)
- [emscripten](https://emscripten.org)
  - [Download + install](https://emscripten.org/docs/getting_started/downloads.html)