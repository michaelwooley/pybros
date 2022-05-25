# pyodide adapters


```bash
❯ cd src/lib/pyodide
❯ tree
.
├── protocol.ts          # Defines routes+payloads for both main & worker
├── pyodide.main.ts      # Main thread handlers. Should be imported.
├── pyodide.worker.ts    # Worker script.
└── README.md            # [here]

0 directories, 4 files
```


# Terminology

Stuff is occurring at two venues:

- _Main._ Refers to stuff running on the main browser thread.
- _Worker._ A web worker running on another thread.

Messages are passed back and forth between these two threads and actions occur in response to the messages. Sometimes you might want to call stuff that occurs on the main thread as happening "client-side" but I think that obscures the fact that both threads make use of a "client" at various points. Follow [gRPC Terminology](https://grpc.io/docs/what-is-grpc/introduction/):

- _Service._ "Server-esque"  object. Handles incoming messages and carries out required compute.
- _Client._ Sends a message with a `cmd` and well-defined payload to the other thread.

The main and worker threads both have service _and_ client classes.

