import React from "react";
import "./DisplayBlock.scss";

interface DisplayBlockProps {
  value: number;
}

const DisplayBlock: React.FC<DisplayBlockProps> = ({ value }) => {
  return <div className="DisplayBlock">{String(value).padStart(3, "0")}</div>;
};

export default DisplayBlock;
