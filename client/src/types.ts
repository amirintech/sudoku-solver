export const enum Actions {
  GENERATE_BOARD = "GENERATE_BOARD",
  SOLVE_BOARD = "SOLVE_BOARD",
}

export const enum BoardComplexity {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  VERY_HARD = "Very Hard",
}

export const enum SolutionAlgorithm {
  BACKTRACKING = "Backtracking",
  GENETIC = "Genetic",
  RULE_BASED = "Rule Based",
}

export const enum BoardSize {
  SZ4 = 4,
  SZ6 = 6,
  SZ9 = 9,
}

export interface AppConfig {
  difficulity: BoardComplexity;
  algorithm: SolutionAlgorithm;
  population: number;
  size: number;
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
  solvedBoard: string;
  time: number;
  memory: number;
  iterations: number;
}

export interface Win extends Window {
  api: {
    generateBoard: <T>(req: Packet<T>) => void;
    solveBoard: <T>(req: Packet<T>) => void;
    onGenerateBoard: (
      callback: (res: Packet<GenerateBoardResData>) => void
    ) => void;
    onSolvedBoard: (callback: (res: Packet<SolveBoardResData>) => void) => void;
  };
}
