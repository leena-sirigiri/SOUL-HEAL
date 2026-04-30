import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Assessment() {

  // ✅ QUESTIONS
  const questions = [
    "How often do you feel overwhelmed by daily responsibilities?",
    "How well are you able to relax your mind?",
    "How often do you have trouble sleeping due to stress?",
    "Do you feel anxious without a clear reason?",
    "How often do you feel tired even after rest?",
    "How do you handle unexpected problems?",
    "How often do you feel irritable or frustrated?",
    "Do you find it hard to concentrate on tasks?",
    "How often do you feel emotionally drained?",
    "Do you feel like you are losing control over situations?"
  ];

  // ✅ OPTIONS
  const options = [
    { text: "Never", value: 0 },
    { text: "Rarely", value: 1 },
    { text: "Sometimes", value: 2 },
    { text: "Often", value: 3 },
    { text: "Always", value: 4 }
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ SELECT ANSWER
  const selectAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  // ✅ NEXT
  const next = () => {
    if (answers[current] === null) {
      alert("Please select an answer");
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // ✅ PREVIOUS
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  // ✅ SUBMIT
  const submit = async () => {
    const score = answers.reduce((a, b) => a + b, 0);

    let result = "";
    if (score <= 10) result = "Low Stress";
    else if (score <= 25) result = "Moderate Stress";
    else result = "High Stress";

    try {
      // Save to backend
      await axios.post("http://localhost:5000/api/assessment/add", {
        studentId: user._id,
        assessmentType: "Mental Health Quiz",
        score,
        result
      });

      // Navigate to result page
      navigate("/result", { state: { score, result } });

    } catch (err) {
      console.log(err);
      alert("Error saving assessment");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "20px",
      textAlign: "center",
      background: "#f9f9f9",
      borderRadius: "10px"
    }}>

      <h2>Mental Health Assessment</h2>

      {/* Progress */}
      <p>Question {current + 1} of {questions.length}</p>

      {/* Question */}
      <h3>{questions[current]}</h3>

      {/* Options */}
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => selectAnswer(opt.value)}
          style={{
            display: "block",
            width: "100%",
            margin: "10px 0",
            padding: "10px",
            background: answers[current] === opt.value ? "#4CAF50" : "#eee",
            color: answers[current] === opt.value ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {opt.text}
        </button>
      ))}

      {/* Navigation */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={prev} disabled={current === 0}>
          ⬅ Previous
        </button>

        {current < questions.length - 1 ? (
          <button onClick={next} style={{ marginLeft: "10px" }}>
            Next ➡
          </button>
        ) : (
          <button onClick={submit} style={{ marginLeft: "10px" }}>
            Submit ✔
          </button>
        )}
      </div>

    </div>
  );
}

export default Assessment;