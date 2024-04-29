import {
  Actions,
  AppConfig,
  GenerateBoardReqData,
  GenerateBoardResData,
  Packet,
  SolveBoardReqData,
  SolveBoardResData,
  Win,
} from "../types";
import { populateBoard, readBoard, stringToBoard } from "./board";
import { playLoadingAnimation, stopLoadingAnimation } from "./loading";
import { openModal } from "./modal";
import { renderStats, resetStats } from "./stats";

const win = window as unknown as Win;

export function renderActionButtons(
  config: AppConfig,
  cells: HTMLDivElement[]
) {
  const generateBtn = document.getElementById(
    "generate-btn"
  ) as HTMLButtonElement;
  const solveBtn = document.getElementById("solve-btn") as HTMLButtonElement;
  const settingsBtn = document.getElementById(
    "settings-btn"
  ) as HTMLButtonElement;
  const btns = [generateBtn, solveBtn, settingsBtn];

  generateBtn.onclick = () => {
    const req: Packet<GenerateBoardReqData> = {
      action: Actions.GENERATE_BOARD,
      data: {
        size: config.size,
        complexity: config.difficulity,
      },
    };
    win.api.generateBoard(req);
    disableButtons(btns);
  };

  solveBtn.onclick = () => {
    const req: Packet<SolveBoardReqData> = {
      action: Actions.SOLVE_BOARD,
      data: {
        algorithm: config.algorithm,
        board: readBoard(cells),
        population: config.population,
        size: config.size,
      },
    };

    win.api.solveBoard(req);
    playLoadingAnimation();
    disableButtons(btns);
  };

  settingsBtn.onclick = () => {
    openModal();
  };

  win.api.onGenerateBoard((res: Packet<GenerateBoardResData>) => {
    populateBoard(cells, stringToBoard(res.data.board));
    resetStats();
    enableButtons(btns);
  });

  win.api.onSolvedBoard((res: Packet<SolveBoardResData>) => {
    populateBoard(cells, stringToBoard(res.data.solvedBoard));
    renderStats(res.data.time, res.data.memory, res.data.iterations);
    console.log("hey");
    stopLoadingAnimation();
    enableButtons(btns);
  });
}

function disableButtons(btns: HTMLButtonElement[]) {
  btns.forEach((btn) => btn.setAttribute("disabled", "true"));
}

function enableButtons(btns: HTMLButtonElement[]) {
  btns.forEach((btn) => btn.removeAttribute("disabled"));
}
