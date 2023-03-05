import React from "react";
import { CellState, CellValue } from "../../types";
import "./CellComponent.scss";

interface CellComponentProps {
  value: CellValue;
  state: CellState;
  row: number;
  column: number;
  red?: boolean;
  onClick: (row: number, column: number) => void;
  onContext: (e: React.MouseEvent, row: number, column: number) => void;
  onMouseDown: (state: CellState) => void;
  onMouseUp: () => void;
}

const CellComponent: React.FC<CellComponentProps> = ({
  value,
  state,
  row,
  column,
  red,
  onClick,
  onContext,
  onMouseDown,
  onMouseUp,
}) => {
  const renderCell = (): React.ReactNode => {
    if (state === CellState.open) {
      if (value === CellValue.bomb) return <>&#128163;</>;
      if (value !== CellValue.none) return value;
    }
    if (state === CellState.flag) {
      return <span className="flag">&#128681;</span>;
    }

    return null;
  };

  return (
    <div
      className={`CellComponenet ${
        state === CellState.open ? `open value-${value}` : ""
      } `}
      onClick={() => onClick(row, column)}
      onContextMenu={(e) => onContext(e, row, column)}
      onMouseDown={() => onMouseDown(state)}
      onMouseUp={onMouseUp}
    >
      {renderCell()}
    </div>
  );
};

export default CellComponent;
