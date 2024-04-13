function createCell(): HTMLDivElement {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("contentEditable", "");
  cell.onfocus = () => cell.classList.add("cell-active");
  cell.onblur = () => cell.classList.remove("cell-active");
  cell.onkeydown = (e) => {
    if (e.key == "Backspace") {
      cell.textContent = "";
      return;
    }

    e.preventDefault();
    const isNumeric = !isNaN(Number(e.key));
    if (!isNumeric || e.key == "0") return;

    cell.textContent = e.key;
  };
  return cell;
}

function isRightBorderCell(col: number, size: number) {
  return col % Math.sqrt(size) == 0 && col != size;
}

function isBottomBorderCell(row: number, size: number) {
  return row % Math.sqrt(size) == 0 && row != size;
}

export function drawBoard(
  size: number,
  parent: HTMLDivElement
): HTMLDivElement[] {
  const cells: HTMLDivElement[] = [];
  for (let row = 1; row <= size; row++) {
    for (let col = 1; col <= size; col++) {
      const cell = createCell();
      if (isRightBorderCell(col, size))
        cell.style.borderRight = "3px solid rgb(15 23 42)";
      if (isBottomBorderCell(row, size))
        cell.style.borderBottom = "3px solid rgb(15 23 42)";

      parent.appendChild(cell);
    }
  }

  return cells;
}

export function populateBoard(cells: HTMLDivElement[], data: number[]) {
  for (let i = 0; i < cells.length; i++)
    if (data[i] != 0) cells[i].textContent = String(data[0]);
}

export function stringToBoard(boardString: string, size: number) {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const digit = parseInt(boardString.charAt(index), 10);
      row.push(digit);
    }
    board.push(row);
  }

  return board;
}

export function boardToString(board: number[][]) {
  return board.map((row) => row.join("")).join("");
}
