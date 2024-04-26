import "./index.css";
import { drawBoard } from "./app/board";
import { renderStats } from "./app/stats";
import { renderSettings } from "./app/settings";
import { AppConfig, BoardComplexity, SolutionAlgorithm } from "./types";
import { renderActionButtons } from "./app/action-btns";

const config: AppConfig = {
  algorithm: SolutionAlgorithm.GENETIC,
  difficulity: BoardComplexity.EASY,
  population: 100,
  size: 9,
};

const board = document.getElementById("board") as HTMLDivElement;
const cells = drawBoard(config.size, board);
renderStats(0, 0, 0);

renderSettings(
  (a) => (config.algorithm = a),
  (d) => (config.difficulity = d),
  (p) => (config.population = p)
);

renderActionButtons(config, cells);
