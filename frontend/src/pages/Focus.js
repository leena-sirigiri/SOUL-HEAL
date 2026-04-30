import { useState, useEffect } from "react";
import "../premium.css";

function Focus() {
  const [time, setTime] = useState(1500);

  useEffect(()=>{
    const t = setInterval(()=>{
      setTime(x => x>0 ? x-1 : 0);
    },1000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div className="container">

      <div className="title">🎯 Focus</div>

      <h1>{Math.floor(time/60)}:{time%60}</h1>

      <div className="grid">
        <div className="card" style={{background:"#6a11cb"}}>Lo-fi</div>
        <div className="card" style={{background:"#ff758c"}}>White Noise</div>
      </div>

      <input placeholder="Add task..." className="soft" />
      <button className="btn">Start Focus</button>

    </div>
  );
}

export default Focus;