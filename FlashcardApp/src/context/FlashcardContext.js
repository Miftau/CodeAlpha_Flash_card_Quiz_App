// src/context/FlashcardContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadCards, saveCards } from '../utils/storage';

// ─── Default seed cards so the app is not empty on first launch ──────────────
const DEFAULT_CARDS = [
  {
    id: '1',
    question: 'What does HTML stand for?',
    answer: 'HyperText Markup Language',
    category: 'Web Dev',
  },
  {
    id: '2',
    question: 'What is the capital of France?',
    answer: 'Paris',
    category: 'Geography',
  },
  {
    id: '3',
    question: 'What is 2 to the power of 10?',
    answer: '1024',
    category: 'Math',
  },
  {
    id: '4',
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
    category: 'Literature',
  },
  {
    id: '5',
    question: 'What is the chemical symbol for water?',
    answer: 'H₂O',
    category: 'Science',
  },
  {
    id: '6',
    question: 'What does CSS stand for?',
    answer: 'Cascading Style Sheets',
    category: 'Web Dev',
  },
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
