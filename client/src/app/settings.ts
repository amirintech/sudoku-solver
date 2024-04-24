import { BoardComplexity, SolutionAlgorithm } from "../types";

export function renderSettings(
  onSelectAlgorithm: (a: SolutionAlgorithm) => any,
  onSelectDifficulity: (d: BoardComplexity) => any,
  onPopulationChange: (population: number) => any
) {
  const handleSelectAlgorithm = (a: SolutionAlgorithm) => {
    const populationContainer = document.getElementById("population-container");
    if (a === SolutionAlgorithm.GENETIC)
      populationContainer.classList.remove("hidden");
    else populationContainer.classList.add("hidden");
    onSelectAlgorithm(a);
  };

  createMenu(
    document.querySelector("#algorithm-menu"),
    [
      SolutionAlgorithm.BACKTRACKING,
      SolutionAlgorithm.GENETIC,
      SolutionAlgorithm.RULE_BASED,
    ],
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
