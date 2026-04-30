import { useEffect, useState } from "react";
import axios from "axios";

function Resources() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/resource")
      .then(res => setData(res.data));
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Wellness Resources</h2>

      {data.map((r, i) => (
        <div key={i} style={{
          border: "1px solid gray",
          margin: "10px",
          padding: "10px"
        }}>
          <h3>{r.title}</h3>
          <p>{r.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Resources;