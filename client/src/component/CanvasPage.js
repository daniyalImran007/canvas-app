import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {};
  }, []);

  return (
    <div className="drawing-app">
      <h1>Real Time Canvas App</h1>
      <p>Connected users : 1</p>
      <div className="toolbar">
        <button>Add Rectangle</button>
      </div>
      <canvas
        className="drawing-canvas"
        ref={canvasRef}
        width={800}
        height={600}
      ></canvas>
    </div>
  );
};

export default CanvasPage;
