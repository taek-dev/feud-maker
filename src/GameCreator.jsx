import React, { useState } from 'react';
import './feud-style.css'; // ✅ Import the CSS file here

const questionLabels = ["single", "single", "double", "triple"];

export default function GameCreator() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [questions, setQuestions] = useState(
    questionLabels.map(() => ({
      name: '',
      answers: [{ title: '', points: 0 }]
    }))
  );

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].name = value;
    setQuestions(updated);
  };

const handleAnswerChange = (qIndex, aIndex, field, value) => {
  const updated = [...questions];

  if (field === 'points') {
    // Allow empty string while typing
    if (value === '') {
      updated[qIndex].answers[aIndex].points = '';
    } else {
      // Clamp to 0–100
      const num = parseInt(value);
      updated[qIndex].answers[aIndex].points = Math.max(0, Math.min(100, isNaN(num) ? 0 : num));
    }
  } else {
    updated[qIndex].answers[aIndex][field] = value;
  }

  setQuestions(updated);
};

  const handleAddAnswer = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ title: '', points: 0 });
    setQuestions(updated);
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const downloadGame = () => {
    const gameData = {
      Title: title,
      Author: author,
      Questions: questions.map((q) => ({
        Name: q.name,
        Answers: q.answers.map((a) => ({
          Title: a.title,
          Points: a.points
        }))
      }))
    };

    const json = JSON.stringify(gameData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'game'}.feud`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h1>feud game maker</h1>

      <label>Game Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Author</label>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">
          <div className="round-label">{questionLabels[qIndex]} round</div>

          <input
            type="text"
            placeholder={`Enter question ${qIndex + 1}`}
            value={q.name}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          {q.answers.map((a, aIndex) => (
            <div key={aIndex} className="answer-row">
              <input
                type="text"
                placeholder={`Answer ${aIndex + 1}`}
                value={a.title}
                onChange={(e) =>
                  handleAnswerChange(qIndex, aIndex, 'title', e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Points"
                value={a.points === '' ? '' : a.points}
                onChange={(e) =>
                  handleAnswerChange(qIndex, aIndex, 'points', e.target.value)
                }
              />
              <button
                className="remove-answer"
                onClick={() => handleRemoveAnswer(qIndex, aIndex)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="add-answer"
            onClick={() => handleAddAnswer(qIndex)}
            disabled={q.answers.length >= 8}
          >
            + Add Answer
          </button>
        </div>
      ))}

      <button className="download-button" onClick={downloadGame}>
        Download File
      </button>
    </div>
  );
}
