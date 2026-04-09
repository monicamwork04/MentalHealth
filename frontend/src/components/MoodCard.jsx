function MoodCard({ mood, note, date }) {
  return (
    <div className="mood-card">
      <h4>{mood}</h4>
      <p>{note}</p>
      <small>{date}</small>
    </div>
  );
}

export default MoodCard;
