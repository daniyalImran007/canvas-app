import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event);

      if (type === "draw") {
        const { x0, y0, x1, y1 } = payload;
        drawLine(x0, y0, x1, y1);
      }
    };
  }, []);

  const drawLine = (x0, y0, x1, y1) => {
    const canvas = canvasRef.current;
    const pointer = canvas.getContext("2d");

    pointer.beginPath();
    pointer.moveTo(x0, y0);
    pointer.lineTo(x1, y1);
    pointer.stroke();
    pointer.closePath();
  };
  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    canvasRef.current.dataset.prevX = offsetX;
    canvasRef.current.dataset.prevY = offsetY;
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const prevX = parseFloat(canvasRef.current.dataset.prevX || "0");
    const prevY = parseFloat(canvasRef.current.dataset.prevY || "0");
    drawLine(prevX, prevY, offsetX, offsetY);
    canvasRef.current.dataset.prevX = offsetX;
    canvasRef.current.dataset.prevY = offsetY;
  };
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default CanvasPage;
