// src/context/FlashcardContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadCards, saveCards } from '../utils/storage';

// ─── Default seed cards so the app is not empty on first launch ──────────────
const DEFAULT_CARDS = [
  // Web Dev
  { id: '1', question: 'What does HTML stand for?', answer: 'HyperText Markup Language', category: 'Web Dev' },
  { id: '2', question: 'What does CSS stand for?', answer: 'Cascading Style Sheets', category: 'Web Dev' },
  { id: '3', question: 'What does API stand for?', answer: 'Application Programming Interface', category: 'Web Dev' },
  { id: '4', question: 'What is the standard port for HTTP?', answer: '80', category: 'Web Dev' },
  { id: '5', question: 'What command initializes a new Git repository?', answer: 'git init', category: 'Web Dev' },

  // Geography
  { id: '6', question: 'What is the capital of France?', answer: 'Paris', category: 'Geography' },
  { id: '7', question: 'Which continent is the Sahara Desert located on?', answer: 'Africa', category: 'Geography' },
  { id: '8', question: 'What is the longest river in the world?', answer: 'The Nile', category: 'Geography' },
  { id: '9', question: 'Which country has the largest population?', answer: 'India (or China)', category: 'Geography' },

  // Math
  { id: '10', question: 'What is 2 to the power of 10?', answer: '1024', category: 'Math' },
  { id: '11', question: 'What is the square root of 144?', answer: '12', category: 'Math' },
  { id: '12', question: 'What is the value of Pi to two decimal places?', answer: '3.14', category: 'Math' },
  { id: '13', question: 'What is the only even prime number?', answer: '2', category: 'Math' },

  // Literature
  { id: '14', question: 'Who wrote "Romeo and Juliet"?', answer: 'William Shakespeare', category: 'Literature' },
  { id: '15', question: 'Who wrote the dystopian novel "1984"?', answer: 'George Orwell', category: 'Literature' },
  { id: '16', question: 'What is the pen name of Samuel Clemens?', answer: 'Mark Twain', category: 'Literature' },
  { id: '17', question: 'In what language was "Don Quixote" originally written?', answer: 'Spanish', category: 'Literature' },

  // Science
  { id: '18', question: 'What is the chemical symbol for water?', answer: 'H₂O', category: 'Science' },
  { id: '19', question: 'What is the hardest known natural material?', answer: 'Diamond', category: 'Science' },
  { id: '20', question: 'What is the largest planet in our solar system?', answer: 'Jupiter', category: 'Science' },
  { id: '21', question: 'What gas do plants absorb from the atmosphere?', answer: 'Carbon Dioxide (CO₂)', category: 'Science' },

  // History (New Category)
  { id: '22', question: 'In what year did World War II end?', answer: '1945', category: 'History' },
  { id: '23', question: 'Who was the first President of the United States?', answer: 'George Washington', category: 'History' },
  { id: '24', question: 'What year did the Berlin Wall fall?', answer: '1989', category: 'History' },

  // Pop Culture (New Category)
  { id: '25', question: 'What year was the first Star Wars movie released?', answer: '1977', category: 'Pop Culture' },
  { id: '26', question: 'Who played Neo in The Matrix?', answer: 'Keanu Reeves', category: 'Pop Culture' },
];

// ─── Context ─────────────────────────────────────────────────────────────────
const FlashcardContext = createContext(null);

export function FlashcardProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted cards (or seed defaults) on mount
  useEffect(() => {
    (async () => {
      const stored = await loadCards();
      if (stored && stored.length > 0) {
        setCards(stored);
      } else {
        setCards(DEFAULT_CARDS);
        await saveCards(DEFAULT_CARDS);
      }
      setIsLoaded(true);
    })();
  }, []);

  // Persist whenever cards change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCards(cards);
    }
  }, [cards, isLoaded]);

  // ─── CRUD helpers ──────────────────────────────────────────────────────────
  function addCard({ question, answer, category = 'General' }) {
    const newCard = {
      id: Date.now().toString(),
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || 'General',
    };
    setCards((prev) => [...prev, newCard]);
  }

  function updateCard(id, updates) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              question: updates.question?.trim() ?? c.question,
              answer: updates.answer?.trim() ?? c.answer,
              category: updates.category?.trim() ?? c.category,
            }
          : c
      )
    );
  }

  function deleteCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function resetToDefaults() {
    setCards(DEFAULT_CARDS);
  }

  return (
    <FlashcardContext.Provider
      value={{ cards, isLoaded, addCard, updateCard, deleteCard, resetToDefaults }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFlashcards() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) {
    throw new Error('useFlashcards must be used inside <FlashcardProvider>');
  }
  return ctx;
}
