import "./index.css";
import {
  drawBoard,
  populateBoard,
  readBoard,
  stringToBoard,
} from "./app/board";
import { renderStats, resetStats } from "./app/stats";
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
renderStats(0, 0, 0);

const config = {
  algorithm: SolutionAlgorithm.GENETIC,
  difficulity: BoardComplexity.EASY,
  populationSize: 100,
};

renderSettings(
  (a) => (config.algorithm = a),
  (d) => (config.difficulity = d),
  (p) => (config.populationSize = p)
);

// ======================================================================
// HANDLE SOLVE AND GENERATE BUTTONS' ACTIONS
// ======================================================================
const generateBtn = document.getElementById("generate-btn");
const solveBtn = document.getElementById("solve-btn");

generateBtn.onclick = () => {
  const req: Packet<GenerateBoardReqData> = {
    action: Actions.GENERATE_BOARD,
    data: {
      size: 9,
      complexity: config.difficulity,
    },
  };
  win.api.generateBoard(req);
};

solveBtn.onclick = () => {
  const req: Packet<SolveBoardReqData> = {
    action: Actions.SOLVE_BOARD,
    data: {
      algorithm: config.algorithm,
      board: readBoard(cells),
      population: config.populationSize,
      size: 9,
    },
  };

  win.api.solveBoard(req);
};

win.api.onGenerateBoard((res: Packet<GenerateBoardResData>) => {
  populateBoard(cells, stringToBoard(res.data.board));
  resetStats();
});

win.api.onSolvedBoard((res: Packet<SolveBoardResData>) => {
  populateBoard(cells, stringToBoard(res.data.solvedBoard));
  renderStats(res.data.time, res.data.memory, res.data.iterations);
});

// ======================================================================
// ======================================================================
