import { spawn } from "node:child_process";
import { Packet } from "./types";
import { BrowserWindow, ipcMain } from "electron";

const basePath =
  __dirname.substring(0, __dirname.indexOf("/client")) + "/engine";
const bridgePath = basePath + "/bridge.py";
const bridge = spawn("python", [bridgePath]);

export function setupEngine(win: BrowserWindow) {
  bridge.stdout.on("data", (data) => {
    if ((data.toString() as string).startsWith("DEBUG")) return;
    const load = (data.toString() as string).trim();
    try {
      const data = JSON.parse(load);
      console.log(data);
      ipcMain.emit("RES:" + data.action, data.data);
    } catch (e) {
      console.log("DEBUG failed to parse JSON from bridge");
      console.log("DEBUG ", e);
    }
  });
}

bridge.stderr.on("data", (data) => {
  console.error(`DEBUG Bridge error: ${data}`);
});

process.on("exit", () => {
  bridge.kill();
});

export function writeReq<T>(req: Packet<T>) {
  bridge.stdin.write(JSON.stringify(req));
  bridge.stdin.write("\n");
}
