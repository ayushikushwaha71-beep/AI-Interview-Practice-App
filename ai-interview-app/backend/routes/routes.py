from flask import Blueprint, request, jsonify
from services.evaluator import evaluate_answer
import sqlite3

main = Blueprint("main", __name__)

# Single question
@main.route("/question", methods=["GET"])
def get_question():
    return jsonify({"question": "Tell me about yourself"})

# Evaluate answer
@main.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.json
        answer = data.get("answer", "").strip()

        if not answer:
            return jsonify({"score": 0, "feedback": ["Answer cannot be empty"]})

        result = evaluate_answer(answer)

        # Save to DB
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO responses (answer, score) VALUES (?, ?)",
            (answer, result["score"])
        )
        conn.commit()
        conn.close()

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch history
@main.route("/history", methods=["GET"])
def history():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, answer, score FROM responses ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    data = [{"id": r[0], "answer": r[1], "score": r[2]} for r in rows]
    return jsonify(data)