import { spawn } from "node:child_process";

const basePath =
  __dirname.substring(0, __dirname.indexOf("/client")) + "/engine";
const bridgePath = basePath + "/bridge.py";
const bridge = spawn("python", [bridgePath]);

bridge.stdout.on("data", (data) => {
  console.log(`Bridge output: ${data}`);
});

bridge.stderr.on("data", (data) => {
  console.error(`Bridge error: ${data}`);
});

bridge.stdin.write("IGNORE hey from node\n");

process.on("exit", () => {
  bridge.kill();
});
