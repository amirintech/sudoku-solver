// Create a new cell that is editable and has focus/blur events
function createCell(): HTMLDivElement {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("contentEditable", "true");
  cell.onfocus = () => cell.classList.add("cell-active");
  cell.onblur = () => cell.classList.remove("cell-active");
  cell.onkeydown = (e) => {
    if (e.key === "Backspace") {
      cell.textContent = "";
      return;
    }

    e.preventDefault();
    const isNumeric = !isNaN(Number(e.key));
    if (!isNumeric || e.key === "0") return;

    cell.textContent = e.key;
  };
  return cell;
}

// Determine if the current cell should have a right border
function isRightBorderCell(col: number, size: number) {
  const blockSize = Math.ceil(Math.sqrt(size));
  return col % blockSize === 0 && col !== size;
}

// Determine if the current cell should have a bottom border
function isBottomBorderCell(row: number, size: number) {
  const blockSize = Math.floor(Math.sqrt(size));
  return row % blockSize === 0 && row !== size;
}

// Draw the board with specified size
export function drawBoard(size: number): HTMLDivElement[] {
  const board = document.getElementById("board");
  if (!board) return [];

  board.innerHTML = "";
  board.classList.forEach((c) => {
    if (c.startsWith("sz-")) board.classList.remove(c);
  });
  board.classList.add(`sz-${size}`);

  const cells: HTMLDivElement[] = [];
  for (let row = 1; row <= size; row++) {
    for (let col = 1; col <= size; col++) {
      const cell = createCell();
      if (isRightBorderCell(col, size)) {
        cell.style.borderRight = "3px solid rgb(15 23 42)";
      }
      if (isBottomBorderCell(row, size)) {
        cell.style.borderBottom = "3px solid rgb(15 23 42)";
      }
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  return cells;
}

// Populate the board with numbers from the data array
export function populateBoard(cells: HTMLDivElement[], data: number[]) {
  for (let i = 0; i < cells.length; i++) {
    if (data[i] != 0) {
      cells[i].textContent = String(data[i]);
    } else {
      cells[i].textContent = "";
    }
  }
}

// Convert a string of numbers to a board array
export function stringToBoard(boardString: string) {
  return boardString.split("").map(Number);
}

// Convert a board array to a string of numbers
export function boardToString(board: number[][]) {
  return board.map((row) => row.join("")).join("");
}

// Read the current board state into a string from cells
export function readBoard(cells: HTMLDivElement[]) {
  return cells
    .map((cell) => {
      const val = cell.textContent.trim();
      if (val === "") return 0;
      return Number(val);
    })
    .join("");
}
