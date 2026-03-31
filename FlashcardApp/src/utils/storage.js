// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@flashquiz_cards';

/**
 * Load flashcards from AsyncStorage.
 * Returns null if nothing is stored yet.
 */
export async function loadCards() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to load cards from storage:', e);
    return null;
  }
}

/**
 * Persist the full flashcard array to AsyncStorage.
 */
export async function saveCards(cards) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save cards to storage:', e);
  }
}
