function MandalaCanvas({ mandalaState, handleColorClick, level }) {
  const gridSize = level === 1 ? 6 : level === 2 ? 8 : 10;
  const cellSize = 40;

  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        justifyContent: "center",
        margin: "20px auto"
      }}
    >
      {cells.map((i) => {
        const cellColor =
          mandalaState.find((c) => c.x === i)?.color || "#fff";

        return (
          <div
            key={i}
            onClick={() => handleColorClick(i)}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: cellColor,
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          />
        );
      })}
    </div>
  );
}

export default MandalaCanvas;