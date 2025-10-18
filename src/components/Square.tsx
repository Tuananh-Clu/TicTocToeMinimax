

export const Square = ({ onClick, children,value }: { onClick: () => void, children: React.ReactNode,value:number|null }) => {
  return (
    <button onClick={onClick} className={`rounded-2xl w-16 h-16  ${value !== null && value % 2 === 0 ? "bg-blue-400 hover:bg-blue-500 text-white font-bold" : "bg-pink-500 hover:bg-pink-300  text-white font-bold"}`}>
      {children}
    </button>
  )
}
