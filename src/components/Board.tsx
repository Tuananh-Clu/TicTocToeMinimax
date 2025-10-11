
import { Square } from "./Square";
export const Board = ({board,handleClick}:{board:(string | null)[],handleClick:(index:number)=>void}) => {

  return (
    <div className="flex flex-wrap w-52 gap-2 ">
      {board?.map((value, index) => (
        <Square key={index} onClick={() => handleClick(index)}>
          {value}
        </Square>
      ))}
    </div>
  );
}
