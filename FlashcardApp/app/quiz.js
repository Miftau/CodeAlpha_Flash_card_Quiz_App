// app/quiz.js
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFlashcards } from '../src/context/FlashcardContext';

// ─── Card Flip Component ──────────────────────────────────────────────────────
const SCREEN_WIDTH = Dimensions.get('window').width;

function FlipCard({ card, isFlipped, onFlip, onAnswer }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // Reset position for new card
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [card]);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gesture) => Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > 120) {
          Animated.timing(pan, { toValue: { x: SCREEN_WIDTH * 1.5, y: gesture.dy }, duration: 250, useNativeDriver: true }).start(() => onAnswer(true));
        } else if (gesture.dx < -120) {
          Animated.timing(pan, { toValue: { x: -SCREEN_WIDTH * 1.5, y: gesture.dy }, duration: 250, useNativeDriver: true }).start(() => onAnswer(false));
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: true }).start();
        }
      }
    })
  ).current;

  const panRotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.cardWrapper,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: panRotate }] }
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onFlip} style={{ width: '100%', height: '100%' }}>
      {/* Front — Question */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={styles.cardLabel}>QUESTION</Text>
        <Text style={styles.cardText}>{card.question}</Text>
        <Text style={styles.tapHint}>Tap to reveal answer</Text>
      </Animated.View>

      {/* Back — Answer */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <Text style={styles.cardLabel}>ANSWER</Text>
        <Text style={styles.cardText}>{card.answer}</Text>
        {card.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{card.category}</Text>
          </View>
        ) : null}
      </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ correct, total, onRetry, onHome }) {
  const pct = Math.round((correct / total) * 100);
  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪';
  const message =
    pct === 100
      ? 'Perfect score!'
      : pct >= 70
        ? 'Great job!'
        : pct >= 40
          ? 'Keep practising!'
          : "You'll get there!";

  return (
    <View className="flex-1 bg-light items-center justify-center px-6">
      <Text style={{ fontSize: 72 }}>{emoji}</Text>
      <Text className="text-3xl font-bold text-dark mt-4 mb-2">{message}</Text>
      <Text className="text-gray text-lg mb-8">
        {correct} / {total} correct ({pct}%)
      </Text>

      {/* Score bar */}
      <View className="w-full bg-white rounded-full h-4 mb-10 shadow overflow-hidden">
        <View
          className="h-4 rounded-full bg-secondary"
          style={{ width: `${pct}%` }}
        />
      </View>

      <TouchableOpacity
        className="w-full bg-primary py-4 rounded-2xl items-center mb-4 shadow-lg"
        onPress={onRetry}
      >
        <Text className="text-white font-bold text-lg">🔄  Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full bg-white border border-primary py-4 rounded-2xl items-center"
        onPress={onHome}
      >
        <Text className="text-primary font-bold text-lg">🏠  Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
export default function QuizScreen() {
  const { cards } = useFlashcards();
  const { category } = useLocalSearchParams();

  // Shuffle cards once on mount and filter by category
  const [deck] = useState(() => {
    let filtered = cards;
    if (category && category !== 'All') {
      filtered = cards.filter(c => c.category === category);
    }
    return [...filtered].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentCard = deck[currentIndex];
  const progress = (currentIndex / deck.length) * 100;

  function handleFlip() {
    setIsFlipped((f) => !f);
  }

  function handleAnswer(wasCorrect) {
    if (wasCorrect) setCorrect((c) => c + 1);

    if (currentIndex + 1 >= deck.length) {
      setShowResults(true);
    } else {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i + 1), 150);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setCorrect(0);
    setIsFlipped(false);
    setShowResults(false);
  }

  if (deck.length === 0) {
    return (
      <View className="flex-1 bg-light items-center justify-center px-6">
        <Text className="text-5xl mb-4">📭</Text>
        <Text className="text-2xl font-bold text-dark mb-2">No cards yet</Text>
        <Text className="text-gray text-center mb-8">
          Add some flashcards in Manage Cards first.
        </Text>
        <TouchableOpacity
          className="bg-primary px-8 py-4 rounded-2xl"
          onPress={() => router.replace('/manage')}
        >
          <Text className="text-white font-bold text-lg">Go to Manage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResults) {
    return (
      <ResultsScreen
        correct={correct}
        total={deck.length}
        onRetry={handleRetry}
        onHome={() => router.replace('/')}
      />
    );
  }

  return (
    <View className="flex-1 bg-light px-5 pt-6 pb-8">
      {/* Progress */}
      <View className="flex-row items-center mb-2">
        <Text className="text-gray text-sm flex-1">
          Card {currentIndex + 1} of {deck.length}
        </Text>
        <Text className="text-gray text-sm">{Math.round(progress)}%</Text>
      </View>
      <View className="w-full bg-white rounded-full h-2 mb-6 overflow-hidden">
        <View
          className="h-2 rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Score indicator */}
      <View className="flex-row justify-end mb-4">
        <View className="flex-row items-center bg-white rounded-full px-4 py-1 shadow">
          <Text className="text-secondary font-bold">✓ {correct}</Text>
          <Text className="text-gray mx-2">|</Text>
          <Text className="text-danger font-bold">
            ✗ {currentIndex - correct}
          </Text>
        </View>
      </View>

      {/* Flip Card */}
      <FlipCard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onAnswer={handleAnswer}
      />

      {/* Answer buttons — show only when flipped */}
      {isFlipped && (
        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            className="flex-1 bg-danger py-4 rounded-2xl items-center shadow"
            onPress={() => handleAnswer(false)}
          >
            <Text className="text-white font-bold text-base">✗  Got it Wrong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-secondary py-4 rounded-2xl items-center shadow"
            onPress={() => handleAnswer(true)}
          >
            <Text className="text-white font-bold text-base">✓  Got it Right</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isFlipped && (
        <Text className="text-gray text-center text-sm mt-6">
          Tap the card to flip it and reveal the answer
        </Text>
      )}
    </View>
  );
}

// ─── Styles (only for the animated flip card which needs StyleSheet) ─────────
const styles = StyleSheet.create({
  cardWrapper: {
    height: 300,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFront: {
    backgroundColor: '#fff',
  },
  cardBack: {
    backgroundColor: '#0984E3',
  },
  cardLabel: {
    position: 'absolute',
    top: 18,
    left: 22,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#636E72',
    opacity: 0.7,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2D3436',
    lineHeight: 32,
  },
  tapHint: {
    position: 'absolute',
    bottom: 18,
    fontSize: 12,
    color: '#636E72',
    opacity: 0.6,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
