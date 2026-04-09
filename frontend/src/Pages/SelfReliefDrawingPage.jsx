import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SelfReliefDrawingPage() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#4CAF50");
  const [brushSize, setBrushSize] = useState(3);
  const [eraser, setEraser] = useState(false);
  const [gallery, setGallery] = useState([]);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("drawings")) || [];
    setGallery(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
    setHistory((prev) => [...prev, data]);
    setRedoStack([]);
  };

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);

    saveState();
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");
    const pos = getPosition(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = eraser ? "#ffffff" : color;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const lastState = history[history.length - 1];

    setRedoStack((prev) => [...prev, canvas.toDataURL()]);
    setHistory((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = lastState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const lastRedo = redoStack[redoStack.length - 1];

    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = lastRedo;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const updatedGallery = [...gallery, image];
    setGallery(updatedGallery);

    localStorage.setItem("drawings", JSON.stringify(updatedGallery));
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "my-drawing.png";
    link.click();
  };

  return (
    <div style={styles.container}>

      <div style={styles.logoutContainer}>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>🎨 Self Relief Drawing</h2>
      <p>Relax and express your feelings through drawing.</p>

      <div style={styles.tools}>
        <div>
          <label>Color </label>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setEraser(false);
            }}
          />
        </div>

        <div>
          <label>Brush Size: {brushSize}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
          />
        </div>

        <button style={styles.button} onClick={() => setEraser(!eraser)}>
          {eraser ? "Disable Eraser" : "Eraser"}
        </button>

        <button style={styles.button} onClick={undo}>Undo</button>
        <button style={styles.button} onClick={redo}>Redo</button>
      </div>

      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        style={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div style={styles.buttons}>
        <button style={styles.button} onClick={clearCanvas}>Clear</button>
        <button style={styles.button} onClick={saveDrawing}>Save to Gallery</button>
        <button style={styles.button} onClick={downloadDrawing}>Download</button>
      </div>

      <h3>🖼 My Drawing Gallery</h3>

      <div style={styles.gallery}>
        {gallery.length === 0 ? (
          <p>No drawings saved yet.</p>
        ) : (
          gallery.map((img, index) => (
            <img key={index} src={img} alt="drawing" style={styles.image} />
          ))
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #c8e6c9, #e1f5fe, #f3e5f5)"
  },

  logoutContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },

  logoutButton: {
    padding: "8px 15px",
    background: "#ef5350",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  tools: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "10px"
  },

  canvas: {
    border: "2px solid #81c784",
    borderRadius: "10px",
    background: "white",
    touchAction: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  buttons: {
    marginTop: "20px"
  },

  button: {
    padding: "10px 15px",
    background: "#66bb6a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    margin: "5px"
  },

  gallery: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px"
  },

  image: {
    width: "150px",
    borderRadius: "6px",
    border: "2px solid #a5d6a7"
  }
};

export default SelfReliefDrawingPage;