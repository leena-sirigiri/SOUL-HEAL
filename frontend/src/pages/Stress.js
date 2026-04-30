import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStoredUserProfile } from "../utils/profileStorage";
import "../premium.css";
import "./stress.css";

const answerOptions = [
  { label: "Never", value: 0, marks: 0 },
  { label: "Almost never", value: 1, marks: 1.25 },
  { label: "Sometimes", value: 2, marks: 2.5 },
  { label: "Fairly often", value: 3, marks: 3.75 },
  { label: "Very often", value: 4, marks: 5 },
];

const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things outside your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
];

function Stress() {
  const nav = useNavigate();
  const profile = useMemo(() => getStoredUserProfile(), []);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const next = async () => {
    if (answers[current] === null) {
      alert("Please select an answer");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    await calculate();
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const calculate = async () => {
    try {
      setSubmitting(true);
      const response = await axios.post("http://localhost:5000/api/stress/assessment", {
        answers,
        userEmail: profile.email || "guest@soulheal.app",
        userName: profile.name || "SoulHeal User",
      });

      nav("/result", {
        state: {
          score: response.data.score,
          result: response.data.level,
          recommendedAction: response.data.recommendedAction,
          userEmail: profile.email || "guest@soulheal.app",
          userName: profile.name || "SoulHeal User",
        },
      });
    } catch (error) {
      alert(error.response?.data?.error || "Could not save assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="container">
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <p>
        {current + 1} / {questions.length}
      </p>

      <h2 className="title">Stress Assessment</h2>
      <p style={{ textAlign: "center", color: "#4b647e" }}>
        10 standard stress questions, total score: 50.
      </p>

      <div className="question-card">{questions[current]}</div>

      <div className="options">
        {answerOptions.map((option) => (
          <button
            key={option.label}
            className={answers[current] === option.value ? "selected" : ""}
            onClick={() => handleAnswer(option.value)}
          >
            {option.label} ({option.marks} marks)
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button className="btn" onClick={prev} disabled={current === 0 || submitting}>
          Previous
        </button>

        <button className="btn" onClick={next} disabled={submitting}>
          {submitting ? "Saving..." : current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Stress;
