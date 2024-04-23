import { BoardComplexity, SolutionAlgorithm } from "../types";

export function renderSettings(
  currentAlgorithm: SolutionAlgorithm,
  currentDifficulity: BoardComplexity,
  onSelectAlgorithm: (a: SolutionAlgorithm) => any,
  onSelectDifficulity: (d: BoardComplexity) => any
) {
  createMenu(
    document.querySelector("#algorithm-menu"),
    [
      SolutionAlgorithm.BACKTRACKING,
      SolutionAlgorithm.GENETIC,
      SolutionAlgorithm.RULE_BASED,
    ],
    onSelectAlgorithm
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
