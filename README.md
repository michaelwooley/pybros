# (WIP) pybros

> 👋 This is very much a work in progress. Knowing me, I will probably start working on another side project and forget about this before long 🤷‍♂️. (I have a bit more follow-through at work :|)

-   _**Main idea:** Create a static site that supports collaborative python programming (i.e. [replit](https://replit.com/) without the server)._
-   _**Status.**_ Pre-alpha. Something of an MVP is complete. However, expect rough edges. Especially related to python operations and resolution of shared docs when collaborating. Loading of editor + python repl will feel rather slow/rough.
-   _**What's with the name?**_ "Python with the bros in the browser."

---

MVP Implementation path w/ progress:

-   [x] Svelte project
-   [x] Run wasm from rust Package
-   [x] Run wasm within web worker
-   [x] Run python code using RustPython compiled to wasm.
-   [x] Add nice editor (monaco, codemirror, etc.)
-   [x] Add CRDT/collaboration with [yjs](https://docs.yjs.dev/)
-   [x] Add webrtc hookups for yjs/collaboration on _editor code_
-   [ ] `````Add CRDT validation of python editor output/state.~~~ (Not an MVP element)

                ```
            ````

        `````

-   [ ] Deploy to github pages (truly static)

# Features

Glues a lot of components together, particularly in the sveltekit/vite context:

-   [x] WASM
    -   [x] Simple/example wasm (i.e. greet, fibonacci)
    -   [x] (sort of...) Non-trivial WASM (i.e. make use of a complex crate)
-   [x] Web workers (w/ typescript)
-   [x] Rich editors
-   [x] WebRTC
-   [x] YJS

# Development

> 😢 To develop with pyodide, you need to use **chromium**! See [vite#4586](https://github.com/vitejs/vite/issues/4586) and the [browser feature tracker](https://caniuse.com/mdn-api_worker_worker_ecmascript_modules).
>
> 🦊 In preview/prod mode, firefox should work fine.

_In development, web workers will only work well/hot reload in chromium-based browsers!_ (Or, at least, firefox does not work.)

To get started:

```bash
git clone git@github.com:michaelwooley/pybros.github
cd pybros
npm i

npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Build wasm

```bash
cd src/lib/wasm
wasm-pack build --target web --dev

# To build
wasm-pack build --target web

# https://github.com/rustwasm/wasm-pack/issues/457#issuecomment-457024036
# cargo install cargo-watch
cargo watch -i .gitignore -i "pkg/*" -s "wasm-pack build --target web --dev"
```

## RustPython work

❗ IMPORTANT: Before going any further, run this command:

```bash
rustup update stable
```

# Acknowledgements

This is really just a glue job. All of the magic here is due to these projects:

-   [Svelte/Svelte kit](kit.svelte.dev)
-   [RustPython](https://github.com/RustPython/RustPython)
-   [rustwasm/wasm-pack](https://github.com/rustwasm/wasm-pack)
-   [YJS](https://docs.yjs.dev)
-   [Monaco editor](https://microsoft.github.io/monaco-editor)
-   [Bulma](https://bulma.io)
-   [vite](https://vitejs.dev/)
