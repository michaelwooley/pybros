# pysvelte


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
