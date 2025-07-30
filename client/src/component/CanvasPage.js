import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(1);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);

      if (type === "draw") {
        const { x0, y0, x1, y1, color, lineWidth } = payload;
        drawLine(x0, y0, x1, y1, color, lineWidth);
      }
      if (type === "init") {
        payload?.forEach(({ x0, y0, x1, y1, color, lineWidth }) => {
          drawLine(x0, y0, x1, y1, color, lineWidth);
        });
      }
      if (type === "userCount") {
        setUserCount(payload);
      }
    };
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, color, lineWidth) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pointer = canvas.getContext("2d");
    if (!pointer) return;
    pointer.beginPath();
    pointer.moveTo(x0, y0);
    pointer.lineTo(x1, y1);
    pointer.strokeStyle = color;
    pointer.lineWidth = lineWidth;
    pointer.stroke();
    pointer.closePath();

    socketRef.current.send(
      JSON.stringify({
        type: "draw",
        payload: { x0, y0, x1, y1, color, lineWidth },
      })
    );
  };

  const drawRectangle = (x0, y0, width, height, color, lineWidth) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pointer = canvas.getContext("2d");
    if (!pointer) return;
    pointer.beginPath();
    pointer.rect(x0, y0, width, height);
    pointer.strokeStyle = color;
    pointer.lineWidth = lineWidth;
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
      <p>Connected users : {userCount}</p>
      <div className="toolbar">
        <button onClick={() => drawRectangle(80, 80, 180, 200, "black", 2)}>
          Add Rectangle
        </button>
        <label>
          color :
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          ></input>
        </label>
        <label>
          Line Width :
          <input
            type="range"
            min={0}
            max={10}
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
          ></input>
        </label>
        <button>Clear Canvas</button>
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
