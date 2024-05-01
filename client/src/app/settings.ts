import { BoardComplexity, BoardSize, SolutionAlgorithm } from "../types";
import { resetStats } from "./stats";

export function renderSettings(
  onSelectAlgorithm: (a: SolutionAlgorithm) => any,
  onSelectDifficulity: (d: BoardComplexity) => any,
  onPopulationChange: (population: number) => any,
  onSelectBoardSize: (s: string) => any
) {
  const handleSelectAlgorithm = (a: SolutionAlgorithm) => {
    const populationContainer = document.getElementById("population-container");
    if (a === SolutionAlgorithm.GENETIC)
      populationContainer.classList.remove("hidden");
    else populationContainer.classList.add("hidden");
    resetStats();
    onSelectAlgorithm(a);
  };

  createMenu(
    document.querySelector("#board-size-menu"),
    [String(BoardSize.SZ9), String(BoardSize.SZ6), String(BoardSize.SZ4)].map(
      (s) => `${s} by ${s}`
    ),
    onSelectBoardSize
  );

  createMenu(
    document.querySelector("#algorithm-menu"),
    [SolutionAlgorithm.BACKTRACKING, SolutionAlgorithm.GENETIC],
    handleSelectAlgorithm
  );

  createMenu(
    document.querySelector("#difficulity-menu"),
    [
      BoardComplexity.EASY,
      BoardComplexity.MEDIUM,
      BoardComplexity.HARD,
      BoardComplexity.VERY_HARD,
    ],
    onSelectDifficulity
  );

  initPopulationSlider(onPopulationChange);
}

function createMenu(
  parent: HTMLDivElement,
  items: string[],
  onClick: (item: string) => any
) {
  const ul = parent.querySelector(".menu-list") as HTMLUListElement;
  const btn = parent.querySelector(".menu-btn") as HTMLButtonElement;

  const listItems = items.map((item) => {
    const li = document.createElement("li");
    li.onclick = () => {
      const btn = parent.querySelector(".menu-btn");
      btn.textContent = item;
      ul.classList.add("hidden");
      onClick(item);
    };
    li.textContent = item;
    li.classList.add("menu-item");

    return li;
  });

  for (const li of listItems) ul.appendChild(li);

  ul.classList.add("hidden");

  btn.textContent = listItems[0].textContent;
  btn.onclick = () => {
    ul.classList.toggle("hidden");
  };
}

function initPopulationSlider(onPopulationChange: (p: number) => void) {
  const slider = document.getElementById(
    "population-slider"
  ) as HTMLInputElement;
  const label = document.getElementById("population-label") as HTMLLabelElement;

  slider.oninput = (e) => {
    const value = (e.target as any).value;
    label.textContent = value;
    onPopulationChange(Number(value));
  };
}
