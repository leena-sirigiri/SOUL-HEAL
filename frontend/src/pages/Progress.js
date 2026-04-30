import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import "../premium.css";

function Progress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/stress/user@gmail.com")
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="container">

      <h2>📊 Stress Progress</h2>

      <LineChart width={300} height={200} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#8884d8" />
      </LineChart>

    </div>
  );
}

export default Progress;