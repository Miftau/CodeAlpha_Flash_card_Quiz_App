// app/manage.js
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function ManageScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-light p-6">
      <StyledText className="text-2xl font-bold text-dark">Manage Deck</StyledText>
      <StyledText className="text-gray mt-2">Logic coming in Step 4</StyledText>
    </StyledView>
  );
}