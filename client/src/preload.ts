import { contextBridge, ipcRenderer } from "electron";
import {
  Actions,
  GenerateBoardResData,
  Packet,
  SolveBoardResData,
  TestResult,
} from "./types";

contextBridge.exposeInMainWorld("api", {
  generateBoard: <T>(req: Packet<T>) =>
    ipcRenderer.send(Actions.GENERATE_BOARD, req),

  solveBoard: <T>(req: Packet<T>) => ipcRenderer.send(Actions.SOLVE_BOARD, req),

  runTests: () =>
    ipcRenderer.send(Actions.RUN_TESTS, {
      action: Actions.RUN_TESTS,
      data: {},
    } as Packet<any>),

  onGenerateBoard: (callback: (res: Packet<GenerateBoardResData>) => void) =>
    ipcRenderer.on("RES:" + Actions.GENERATE_BOARD, (_, res) => callback(res)),

  onSolvedBoard: (callback: (res: Packet<SolveBoardResData>) => void) =>
    ipcRenderer.on("RES:" + Actions.SOLVE_BOARD, (_, res) => callback(res)),

  onRunTests: (callback: (res: Packet<TestResult>) => void) =>
    ipcRenderer.on("RES:" + Actions.RUN_TESTS, (_, res) => callback(res)),
});
