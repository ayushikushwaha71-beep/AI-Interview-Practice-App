import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch question
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/question")
      .then(res => setQuestion(res.data.question))
      .catch(err => console.error(err));
  }, []);

  // Fetch history
  const fetchHistory = () => {
    axios.get("http://127.0.0.1:5000/history")
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, [result]); // refresh after submission

  const handleSubmit = async () => {
    if (!answer.trim()) return alert("Answer cannot be empty");
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/evaluate", { answer });
      setResult(res.data);
      setAnswer(""); // clear textarea
    } catch (err) {
      console.error(err);
      alert("Server error, try again");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>AI Interview Practice</h1>
      <h3>{question}</h3>
      <textarea
        rows="5"
        cols="60"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />
      <br /><br />
      <button onClick={handleSubmit}>{loading ? "Checking..." : "Submit"}</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Score: {result.score}/10</h2>
          <h3>Feedback:</h3>
          <ul>
            {result.feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Past Answers:</h3>
          <ul>
            {history.map(h => (
              <li key={h.id}>{h.answer} → Score: {h.score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;