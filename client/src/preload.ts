import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  log: () => console.log("Hey!!!!!"),
  main: (cb: (val: string) => void) =>
    ipcRenderer.on("hey", (_, val) => cb(val)),
});
