import { contextBridge, ipcRenderer } from "electron";
import {
  Actions,
  GenerateBoardResData,
  Packet,
  SolveBoardResData,
} from "./types";

contextBridge.exposeInMainWorld("api", {
  generateBoard: <T>(req: Packet<T>) =>
    ipcRenderer.send(Actions.GENERATE_BOARD, req),

  solveBoard: <T>(req: Packet<T>) => ipcRenderer.send(Actions.SOLVE_BOARD, req),

  onGenerateBoard: (callback: (res: Packet<GenerateBoardResData>) => void) =>
    ipcRenderer.on("RES:" + Actions.GENERATE_BOARD, (_, res) => callback(res)),

  onSolvedBoard: (callback: (res: Packet<SolveBoardResData>) => void) =>
    ipcRenderer.on("RES:" + Actions.SOLVE_BOARD, (_, res) => callback(res)),
});
