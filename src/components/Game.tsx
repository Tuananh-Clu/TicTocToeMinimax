import { useState, useEffect, useRef } from "react";
import { Gamepad2, Users } from "lucide-react";
import { Board } from "./Board";

export const Game = () => {
  const [board, setBoard] = useState<(number | null)[]>(Array(25).fill(0));
  const wsRef = useRef<WebSocket | null>(null);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [player, setPlayer] = useState<string | null>(null);
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [statusConnect, setStatusConnect] = useState<string>("Đang kết nối...");
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8082");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received:", message);

      switch (message.type) {
        case "connection":
          setStatusConnect(message.data);
          console.log("Connection status:", message.data);
          break;
        case "move":
          setBoard(message.data);
          break;

        case "room_created":
          alert(`Phòng của bạn: ${message.data}`);
          setJoinedRoom(message.data);
          setPlayer(message.player);
          console.log("Player role:", message.player);
          break;

        case "room_joined":
          alert(`Đã tham gia phòng ${message.data}`);
          setJoinedRoom(message.data);
          setPlayer(message.player);
          console.log("Player role:", message.player);
          setStatusConnect("Đã kết nối với đối thủ!");
          break;

        case "room_joined_failed":
          alert("Phòng không tồn tại hoặc đã đủ người!");
          break;
        case "leave_room":
          setBoard(Array(25).fill(0));
          alert("Đối thủ đã rời phòng.");
          setWaitingOpponent(message.data);
          break;
        case "waiting_opponent":
          setWaitingOpponent(message.data);
          setStatusConnect(message.data ? "Đang chờ đối thủ..." : "Đã kết nối với đối thủ!");
          break;
        case "winner":
          alert(message.data);
          setBoard(Array(25).fill(0));
          break;

        default:
          console.log("Unknown message", message);
      }
    };

    return () => ws.close();
  }, []);
  const lineBoard = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  const checkWinner = (board: (number | null)[]) => {
    for (let line of lineBoard) {
      if (
        line.every((index) => board[index] !== 0 && board[index]! % 2 === 0)
      ) {
        wsRef.current?.send(
          JSON.stringify({ type: "winner", data: "Người chơi chẵn thắng!" })
        );
      }
      if (
        line.every((index) => board[index] !== 0 && board[index]! % 2 === 1)
      ) {
        wsRef.current?.send(
          JSON.stringify({ type: "winner", data: "Người chơi lẻ thắng!" })
        );
      }
    }
    return null;
  };
  const CreateRoom = () => {
    const roomid = Math.random().toString(36).substring(2, 8).toUpperCase();
    wsRef.current?.send(JSON.stringify({ type: "create_room", data: roomid }));
  };

  const JoinRoom = () => {
    const roomID = prompt("Nhập mã phòng:");
    if (roomID) {
      wsRef.current?.send(JSON.stringify({ type: "join_room", data: roomID }));
    }
  };
  const handleClick = (index: number) => {
    if (!joinedRoom) return;
    if (waitingOpponent) return alert("Đang chờ đối thủ tham gia...");
    const newBoard = [...board];
    newBoard[index] = (newBoard[index] ?? 0) + 1;
    setBoard(newBoard);
    wsRef.current?.send(
      JSON.stringify({ type: "move", data: newBoard, roomId: joinedRoom })
    );
    checkWinner(newBoard);
  };
  const leaveRoom = () => {
    wsRef.current?.send(
      JSON.stringify({ type: "leave_room", data: joinedRoom })
    );
    setJoinedRoom(null);
    setBoard(Array(25).fill(0));
    setWaitingOpponent(true);
    setPlayer(null);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {joinedRoom ? (
        <div className="flex flex-col gap-3">
          <h1 className=" text-center text-3xl font-bold text-white">
            Odd/Even Game
          </h1>
          <div className="flex flex-row">
            <Board board={board} handleClick={handleClick} />
            <div className="ml-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Trạng Thái Kết Nối
              </h2>
              <p className="text-yellow-300 mb-4">{statusConnect}</p>
              <p className="text-white flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full ${
                    player === "odd" ? "bg-blue-500" : "bg-pink-500"
                  }`}
                />
                Bạn là:{" "}
                <strong>
                  {player === "odd" ? "Người chơi chẵn" : "Người chơi lẻ"}
                </strong>
              </p>
              <p className="text-white flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full ${
                    player === "odd" ? "bg-pink-500" : "bg-blue-500"
                  }`}
                />
                Đối thủ:{" "}
                <strong>
                  {player === "odd" ? "Người chơi lẻ" : "Người chơi chẵn"}
                </strong>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-row w-full justify-center gap-3 items-center">
            <p className="text-white mt-4 text-center">
              Mã phòng: {joinedRoom}
            </p>
            <button
              onClick={leaveRoom}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Rời Phòng
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-8 border border-white/20">
          <h1 className="text-5xl font-extrabold text-white tracking-wide">
            Odd / Even
          </h1>

          <p className="text-gray-300 text-center max-w-md">
            Tham gia hoặc tạo phòng để bắt đầu trò chơi đếm chẵn lẻ cùng bạn bè!
          </p>

          <div className="flex gap-6 mt-4">
            <button
              onClick={CreateRoom}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
              <Gamepad2 size={22} />
              Tạo phòng
            </button>

            <button
              onClick={JoinRoom}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
              <Users size={22} />
              Tham gia phòng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
