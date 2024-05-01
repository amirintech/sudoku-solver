import { spawn } from "node:child_process";
import { Packet } from "./types";

const basePath =
  __dirname.substring(0, __dirname.indexOf("/client")) + "/engine";
const bridgePath = basePath + "/bridge.py";
const bridge = spawn("python", [bridgePath]);

export function setupEngine(handleRes: <T>(packet: Packet<T>) => void) {
  bridge.stdout.on("data", (data) => {
    if ((data.toString() as string).startsWith("DEBUG")) return;
    const load = (data.toString() as string).trim();
    try {
      const data = JSON.parse(load);
      handleRes(data);
    } catch (e) {
      console.error("DEBUG failed to parse JSON from bridge");
      console.error("DEBUG ", e);
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
