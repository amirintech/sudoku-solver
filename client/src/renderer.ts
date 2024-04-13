import "./index.css";
import { drawBoard } from "./app/board";
import { renderStats } from "./app/stats";
import { renderSettings } from "./app/settings";
import { win } from "./types";

const BOARD_SIZE = 9;

const board = document.getElementById("board") as HTMLDivElement;
const cells = drawBoard(BOARD_SIZE, board);
renderStats(0.781, 3991, 991);
renderSettings();

// window.api.main(console.log);

// // In the renderer process (e.g., renderer.js)
// import ipcRenderer from "electron";

// // Listen for the message from the main process
// ipcRenderer.on("message-from-main", (event, data) => {
//   console.log(`Received message from the main process: ${data.message}`);
// });
