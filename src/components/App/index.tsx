import React, { useState, useEffect } from "react";
import "./App.scss";
import DisplayBlock from "../DisplayBlock";
import CellComponent from "../CellComponent";
import { generateField, MAX_ROWS, MAX_COLUMNS, COUNT_BOMB } from "../../utils";
import { CellState, CellValue } from "../../types";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateField());
  const [game, setGame] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const [bombCounter, setBombCounter] = useState<number>(COUNT_BOMB);
  const [isLose, setLose] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isFear, setFear] = useState<boolean>(false);
  //-------------------------------------------------------------------------//
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (game) {
      setCells(generateField());
      setBombCounter(COUNT_BOMB);
      setLose(false);
      setIsWin(false);
      setTimer(1);
      interval = setInterval(() => {
        setTimer((prevState) => prevState + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [game]);
  //-------------------------------------------------------------------------//
  useEffect(() => {
    if (isLose) {
      setGame(false);
    }
  }, [isLose]);
  //-------------------------------------------------------------------------//
  useEffect(() => {
    if (isWin) {
      setGame(false);
    }
  }, [isWin]);
  //-------------------------------------------------------------------------//
  const showAllBombs = () => {
    const copyCells = [...cells];
    const tmp = copyCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.open,
          };
        }
        return cell;
      })
    );
    setCells(tmp);
  };
  //-------------------------------------------------------------------------//
  const chechCellNeighbors: any = (row: number, column: number) => {
    const cellsNone: (number[] | [any, any])[] = [];
    const neighbor_1 = row < MAX_ROWS - 1 ? [row + 1, column] : null;
    const neighbor_2 = row > 0 ? [row - 1, column] : null;
    const neighbor_3 = column < MAX_COLUMNS - 1 ? [row, column + 1] : null;
    const neighbor_4 = column > 0 ? [row, column - 1] : null;

    if (neighbor_1) cellsNone.push(neighbor_1);
    if (neighbor_2) cellsNone.push(neighbor_2);
    if (neighbor_3) cellsNone.push(neighbor_3);
    if (neighbor_4) cellsNone.push(neighbor_4);

    const copyCells = [...cells];

    function chechCellIsNone(i: number, j: number) {
      if (i < 0 || j < 0 || i > MAX_ROWS - 1 || j > MAX_COLUMNS - 1) return;
      if (
        cells[i][j].value === CellValue.none &&
        cells[i][j].state === CellState.close
      ) {
        cellsNone.push([i, j]);
      }
    }
    while (cellsNone.length > 0) {
      const tmp: any = cellsNone.pop();
      const [i, j] = tmp;
      const currentCell = cells[i][j];
      if (currentCell.value === CellValue.none) {
        copyCells[i][j].state = CellState.open;
        setCells([...copyCells]);
        chechCellIsNone(i + 1, j);
        chechCellIsNone(i, j + 1);
        chechCellIsNone(i, j - 1);
        chechCellIsNone(i - 1, j);
      }
    }
  };
  //-------------------------------------------------------------------------//
  const handleClickCell = (row: number, column: number) => {
    let copyCells = [...cells];

    // начало игры
    if (!game && !isLose && !isWin) {
      let isABomb = copyCells[row][column].value === CellValue.bomb;
      console.log(isABomb);
      while (isABomb) {
        copyCells = generateField();
        if (copyCells[row][column].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      alert("Начинаем)!");
      setGame(true);
    }

    const currentCell = copyCells[row][column];

    if ([CellState.flag, CellState.open].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setLose(true);
      alert("Вы проиграли(");
      showAllBombs();
      setGame(false);
      return;
    } else if (currentCell.value === CellValue.none) {
      chechCellNeighbors(row, column);
    } else {
      copyCells[row][column].state = CellState.open;
    }
    // количество открытых ячеек
    let numberOpen = 0;
    copyCells.forEach((row) =>
      row.forEach((cell) => {
        if (cell.state === CellState.open) {
          numberOpen++;
        }
      })
    );
    if (numberOpen === MAX_ROWS * MAX_COLUMNS - COUNT_BOMB) {
      setIsWin(true);
      setGame(false);
      alert("Победа!!!");
      return;
    }
    setCells(copyCells);
  };
  //-------------------------------------------------------------------------//
  const handleContext = (e: React.MouseEvent, row: number, column: number) => {
    e.preventDefault();
    if (cells[row][column].state === CellState.open || !game) return;
    setBombCounter((prevState) => prevState - 1);
    setCells((prevState) => {
      prevState[row][column].state =
        prevState[row][column].state === CellState.flag
          ? CellState.close
          : CellState.flag;
      return prevState;
    });
  };
  //-------------------------------------------------------------------------//
  const handleDown = (state: CellState) => {
    if (state === CellState.close) {
      setFear(true);
    }
  };
  //-------------------------------------------------------------------------//
  const handleUp = () => {
    setFear(false);
  };
  //-------------------------------------------------------------------------//

  const handleClickIcon = () => {
    setBombCounter(COUNT_BOMB);
    setGame(false);
    setCells(generateField());
    setLose(false);
    setIsWin(false);
    setTimer(1);
  };
  //-------------------------------------------------------------------------//
  const renderField = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <CellComponent
          key={`${rowIndex}/${colIndex}`}
          value={cell.value}
          state={cell.state}
          row={rowIndex}
          column={colIndex}
          onClick={handleClickCell}
          onContext={handleContext}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        />
      ))
    );
  };
  //-------------------------------------------------------------------------//
  return (
    <div className="App">
      <div className="Header">
        <DisplayBlock value={bombCounter} />
        <div className="Icon" onClick={handleClickIcon}>
          {!isFear && !isLose && !isWin && <span>&#128522;</span>}
          {isFear && <span>&#128561;</span>}
          {isLose && <span>&#128542;</span>}
          {isWin && <span>&#128526;</span>}
        </div>

        <DisplayBlock value={timer} />
      </div>
      <div className="Body">{renderField()}</div>
    </div>
  );
};

export default App;
