import { CellValue, CellState } from "../types";

export const MAX_ROWS = 16;
export const MAX_COLUMNS = 16;
export const COUNT_BOMB = 40;

export function getRandomIndex(num: number) {
  return Math.floor(Math.random() * num);
}

export const generateField = () => {
  const cells = Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: MAX_COLUMNS }, () => {
      return { value: CellValue.none, state: CellState.close };
    })
  );

  for (let i = 0; i < COUNT_BOMB; ) {
    const randomIndexRow = getRandomIndex(MAX_ROWS);
    const randomIndexColumn = getRandomIndex(MAX_COLUMNS);
    if (cells[randomIndexRow][randomIndexColumn].value === CellValue.none) {
      cells[randomIndexRow][randomIndexColumn].value = CellValue.bomb;
      i++;
    }
  }
  for (let i = 0; i < MAX_ROWS; i++) {
    for (let j = 0; j < MAX_COLUMNS; j++) {
      const neighbor_1 = j > 0 ? cells[i][j - 1] : null;
      const neighbor_2 = j > 0 && i > 0 ? cells[i - 1][j - 1] : null;
      const neighbor_3 = i > 0 ? cells[i - 1][j] : null;
      const neighbor_4 =
        i > 0 && j < MAX_COLUMNS - 1 ? cells[i - 1][j + 1] : null;
      const neighbor_5 = j < MAX_COLUMNS - 1 ? cells[i][j + 1] : null;
      const neighbor_6 =
        i < MAX_ROWS - 1 && j < MAX_COLUMNS - 1 ? cells[i + 1][j + 1] : null;
      const neighbor_7 = i < MAX_ROWS - 1 ? cells[i + 1][j] : null;
      const neighbor_8 = i < MAX_ROWS - 1 && j > 0 ? cells[i + 1][j - 1] : null;
      const numValue = [
        neighbor_1,
        neighbor_2,
        neighbor_3,
        neighbor_4,
        neighbor_5,
        neighbor_6,
        neighbor_7,
        neighbor_8,
      ].filter((item) => item && item.value === CellValue.bomb).length;

      if (cells[i][j].value !== CellValue.bomb) {
        cells[i][j].value = numValue;
      }
    }
  }
  return cells;
};
