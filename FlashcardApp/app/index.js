// app/index.js
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useFlashcards } from '../src/context/FlashcardContext';

export default function HomeScreen() {
  const { cards, isLoaded } = useFlashcards();

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
          <ActivityIndicator color="#0984E3" />
        )}
      </View>

      {/* Action Buttons */}
      <View className="gap-4">
        <Link href="/quiz" asChild>
          <TouchableOpacity
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
        </Link>

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
    </View>
  );
}