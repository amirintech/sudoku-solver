import "./index.css";
import { drawBoard } from "./app/board";
import { renderStats } from "./app/stats";
import { renderSettings } from "./app/settings";
import {
  Actions,
  BoardComplexity,
  GenerateBoardReqData,
  GenerateBoardResData,
  Packet,
  SolutionAlgorithm,
  SolveBoardReqData,
  Win,
} from "./types";

const win = window as unknown as Win;

const BOARD_SIZE = 9;

const board = document.getElementById("board") as HTMLDivElement;
const cells = drawBoard(BOARD_SIZE, board);
renderStats(0.781, 3991, 991);
renderSettings();

// Buttons
const generateBtn = document.getElementById("generate-btn");
const solveBtn = document.getElementById("solve-btn");

generateBtn.onclick = () => {
  const req: Packet<GenerateBoardReqData> = {
    action: Actions.GENERATE_BOARD,
    data: {
      size: 9,
      complexity: BoardComplexity.EASY,
    },
  };
  win.api.generateBoard(req);
};

solveBtn.onclick = () => {
  const req: Packet<SolveBoardReqData> = {
    action: Actions.SOLVE_BOARD,
    data: {
      algorithm: SolutionAlgorithm.BACKTRACKING,
      board:
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      population: 100,
      size: 9,
    },
  };

  win.api.solveBoard(req);
};

win.api.onGenerateBoard((res: GenerateBoardResData) => {
  console.log("HEYYYY!!!! : ", res);
  // Do something with the response, e.g., update the board
});
