
import { Square } from "./Square";
export const Board = ({board,handleClick}:{board:(number | null)[],handleClick:(index:number)=>void}) => {

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-2 bg-white/10 p-4 rounded-3xl shadow-2xl border border-white/20  ">
      {board?.map((value, index) => (
        <Square key={index} value={value} onClick={() => handleClick(index)}>
          {value}
        </Square>
      ))}
    </div>
  );
}
