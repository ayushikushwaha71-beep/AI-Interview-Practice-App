def evaluate_answer(answer):
    score = 0
    feedback = []

    if len(answer) > 20:
        score += 3
    else:
        feedback.append("Answer too short")

    if "experience" in answer.lower():
        score += 3
    else:
        feedback.append("Mention your experience")

    if "skills" in answer.lower():
        score += 4
    else:
        feedback.append("Add your skills")

    return {"score": score, "feedback": feedback}