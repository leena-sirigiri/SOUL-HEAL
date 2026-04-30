import "../premium.css";

function Relax() {
  return (
    <div className="container">

      <div className="title">😌 Relax</div>

      <div className="card" style={{background:"#43cea2"}}>
        🌊 Ocean Sounds
      </div>

      <div className="card" style={{background:"#fa709a"}}>
        🌙 Sleep Mode
      </div>

      <div className="soft card">
        🎥 Calm Video
      </div>

      <audio controls>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"/>
      </audio>

      <button className="btn">Start Relax Session</button>

    </div>
  );
}

export default Relax;