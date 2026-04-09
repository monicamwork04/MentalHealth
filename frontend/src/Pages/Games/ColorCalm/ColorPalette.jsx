function ColorPalette({ setColor }) {
  const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];

  return (
    <div>
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => setColor(c)}
          style={{
            background: c,
            width: 30,
            height: 30,
            margin: 5,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer"
          }}
        />
      ))}
    </div>
  );
}

export default ColorPalette;