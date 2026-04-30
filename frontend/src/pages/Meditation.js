import { useState, useEffect } from "react";
import "../premium.css";
import "./meditation.css";

function Meditation() {
  const [time, setTime] = useState(300);
  const [running, setRunning] = useState(false);

  // Timer
  useEffect(() => {
    let timer;
    if (running && time > 0) {
      timer = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running, time]);

  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="container">

      <h2 className="title">🧘 Meditation</h2>

      {/* TIMER CIRCLE */}
      <div className="circle">
        <h1>{formatTime(time)}</h1>
      </div>

      {/* SESSION OPTIONS */}
      <div className="grid">
        <div className="card soft" onClick={()=>setTime(300)}>5 min</div>
        <div className="card soft" onClick={()=>setTime(600)}>10 min</div>
        <div className="card soft" onClick={()=>setTime(1200)}>20 min</div>
        <div className="card soft">Advanced</div>
      </div>

      {/* BREATHING ANIMATION */}
      <div className={`breath-circle ${running ? "animate" : ""}`}></div>

      {/* CONTROLS */}
      <div style={{display:"flex", gap:"10px"}}>
        <button className="btn" onClick={()=>setRunning(true)}>Start</button>
        <button className="btn" onClick={()=>setRunning(false)}>Pause</button>
        <button className="btn" onClick={()=>setTime(300)}>Reset</button>
      </div>

      {/* AUDIO */}
      <audio controls style={{marginTop:"15px"}}>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"/>
      </audio>

    </div>
  );
}

export default Meditation;