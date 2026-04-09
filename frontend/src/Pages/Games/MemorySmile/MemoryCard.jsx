function MemoryCard({ emoji, index, open, setOpen, matched }) {
  const isFlipped = open.includes(index) || matched.includes(index);

  function handleClick() {
    if (open.length < 2 && !isFlipped) {
      setOpen([...open, index]);
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: 50,
        height: 50,
        margin: 5,
        backgroundColor: "#ffd8b1",
        fontSize: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "8px"
      }}
    >
      {isFlipped ? emoji : "❓"}
    </div>
  );
}

export default MemoryCard;
