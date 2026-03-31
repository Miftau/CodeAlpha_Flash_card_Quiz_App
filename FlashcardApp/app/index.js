// app/index.js
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Animated } from 'react-native';
import { Link, router } from 'expo-router';
import { useFlashcards } from '../src/context/FlashcardContext';
import { useState, useRef, useEffect } from 'react';

export default function HomeScreen() {
  const { cards, isLoaded } = useFlashcards();
  const [modalVisible, setModalVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!isLoaded) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.8, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [isLoaded]);

  const categories = ['All', ...new Set(cards.map((c) => c.category).filter(Boolean))];

  const handleStartQuiz = (category) => {
    setModalVisible(false);
    router.push({ pathname: '/quiz', params: { category } });
  };

  return (
    <View className="flex-1 bg-light px-6 pt-14 pb-8">
      {/* Hero Section */}
      <View className="items-center mb-10">
        <Text className="text-5xl mb-2">🧠</Text>
        <Text className="text-4xl font-bold text-dark mb-2">FlashQuiz Pro</Text>
        <Text className="text-gray text-lg text-center">
          Study smarter, remember longer
        </Text>
      </View>

      {/* Stats Card */}
      <View className="bg-white rounded-2xl p-5 mb-8 shadow">
        {isLoaded ? (
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary">{cards.length}</Text>
              <Text className="text-gray text-sm mt-1">Total Cards</Text>
            </View>
            <View className="w-px bg-gray opacity-20" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-secondary">
                {[...new Set(cards.map((c) => c.category))].length}
              </Text>
              <Text className="text-gray text-sm mt-1">Categories</Text>
            </View>
          </View>
        ) : (
          <View className="items-center py-2">
            <Animated.Text style={{ fontSize: 40, transform: [{ scale: pulseAnim }] }}>
              🧠
            </Animated.Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="gap-4">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg"
          disabled={!isLoaded || cards.length === 0}
        >
          <Text className="text-white font-bold text-lg">▶  Start Quiz</Text>
          {cards.length === 0 && isLoaded && (
            <Text className="text-white text-xs opacity-75 mt-1">
              Add cards first
            </Text>
          )}
        </TouchableOpacity>

        <Link href="/manage" asChild>
          <TouchableOpacity className="w-full bg-white border border-primary py-4 rounded-2xl items-center shadow">
            <Text className="text-primary font-bold text-lg">✏️  Manage Cards</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <Text className="text-gray text-xs text-center mt-auto">
        Tap a card during quiz to reveal the answer
      </Text>

      {/* Category Selection Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl w-full p-6 shadow-xl">
            <Text className="text-2xl font-bold text-dark mb-4 text-center">Select Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => handleStartQuiz(cat)} className="bg-light py-4 rounded-xl mb-3 items-center border border-gray/20">
                <Text className="text-primary font-bold text-lg">{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-2 py-3 items-center">
              <Text className="text-gray font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}