import "./index.css";
import {
  drawBoard,
  populateBoard,
  readBoard,
  stringToBoard,
} from "./app/board";
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
  SolveBoardResData,
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
      complexity: BoardComplexity.VERY_HARD,
    },
  };
  win.api.generateBoard(req);
};

solveBtn.onclick = () => {
  const req: Packet<SolveBoardReqData> = {
    action: Actions.SOLVE_BOARD,
    data: {
      algorithm: SolutionAlgorithm.BACKTRACKING,
      board: readBoard(cells),
      population: 100,
      size: 9,
    },
  };

  win.api.solveBoard(req);
};

win.api.onGenerateBoard((res: Packet<GenerateBoardResData>) => {
  populateBoard(cells, stringToBoard(res.data.board));
});

win.api.onSolvedBoard((res: Packet<SolveBoardResData>) => {
  populateBoard(cells, stringToBoard(res.data.solvedBoard));
  console.log(res.data);
});
