

export const Square = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
  return (
    <button onClick={onClick} className="rounded-2xl w-16 h-16 bg-gray-200 hover:bg-gray-300">
      {children}
    </button>
  )
}
