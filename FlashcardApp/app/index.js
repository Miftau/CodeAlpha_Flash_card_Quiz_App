// app/index.js
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { styled } from 'nativewind';

// Wrapping native components to use className
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

export default function HomeScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-light p-6">
      <StyledText className="text-4xl font-bold text-dark mb-2">FlashQuiz Pro</StyledText>
      <StyledText className="text-gray text-lg mb-10">Master your knowledge</StyledText>

      {/* Link works like TouchableOpacity but handles navigation */}
      <Link href="/quiz" asChild>
        <StyledButton className="w-full bg-primary py-4 rounded-xl mb-4 items-center shadow-lg">
          <StyledText className="text-white font-bold text-lg">Start Quiz</StyledText>
        </StyledButton>
      </Link>

      <Link href="/manage" asChild>
        <StyledButton className="w-full bg-white border border-gray py-4 rounded-xl items-center shadow">
          <StyledText className="text-dark font-bold text-lg">Manage Cards</StyledText>
        </StyledButton>
      </Link>
    </StyledView>
  );
}