export const enum Actions {
  GENERATE_BOARD = "GENERATE_BOARD",
  SOLVE_BOARD = "SOLVE_BOARD",
}

export const enum BoardComplexity {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  VERY_HARD = "VERY_HARD",
}

export const enum SolutionAlgorithm {
  BACKTRACKING = "BACKTRACKING",
  GENETIC = "GENETIC",
}

export interface Packet<T> {
  action: Actions;
  data: T;
}

export interface GenerateBoardReqData {
  size: number;
  complexity: BoardComplexity;
}

export interface SolveBoardReqData {
  board: string;
  size: number;
  algorithm: SolutionAlgorithm;
  population: number;
}

export interface GenerateBoardResData {
  size: number;
  board: string;
}

export interface SolveBoardResData {
  board: string;
  time: number;
  memory: number;
  iterations: number;
}

export interface Win extends Window {
  api: {
    generateBoard: <T>(req: Packet<T>) => void;
    solveBoard: <T>(req: Packet<T>) => void;
    onGenerateBoard: (callback: (res: GenerateBoardResData) => void) => void;
    onSolvedBoard: (callback: (res: SolveBoardResData) => void) => void;
  };
}
