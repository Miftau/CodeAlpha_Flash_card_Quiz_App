// app/manage.js
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useFlashcards } from '../src/context/FlashcardContext';

// ─── Card Form Modal ──────────────────────────────────────────────────────────
function CardModal({ visible, initial, onSave, onClose }) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [answer, setAnswer] = useState(initial?.answer ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');

  const isEdit = !!initial;

  function handleSave() {
    if (!question.trim()) {
      Alert.alert('Missing field', 'Please enter a question.');
      return;
    }
    if (!answer.trim()) {
      Alert.alert('Missing field', 'Please enter an answer.');
      return;
    }
    onSave({ question, answer, category });
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            {isEdit ? '✏️  Edit Card' : '➕  New Card'}
          </Text>

          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. What is the capital of Japan?"
            placeholderTextColor="#b2bec3"
            value={question}
            onChangeText={setQuestion}
            multiline
          />

          <Text style={styles.label}>Answer</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tokyo"
            placeholderTextColor="#b2bec3"
            value={answer}
            onChangeText={setAnswer}
            multiline
          />

          <Text style={styles.label}>Category (optional)</Text>
          <TextInput
            style={[styles.input, { marginBottom: 20 }]}
            placeholder="e.g. Geography"
            placeholderTextColor="#b2bec3"
            value={category}
            onChangeText={setCategory}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={onClose}
            >
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnSave]}
              onPress={handleSave}
            >
              <Text style={styles.btnSaveText}>
                {isEdit ? 'Save Changes' : 'Add Card'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Single Card Row ──────────────────────────────────────────────────────────
function CardRow({ card, onEdit, onDelete }) {
  return (
    <View style={styles.cardRow}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.cardQuestion} numberOfLines={2}>
          {card.question}
        </Text>
        <Text style={styles.cardAnswer} numberOfLines={1}>
          {card.answer}
        </Text>
        {card.category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{card.category}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 8 }}>
        <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, styles.iconBtnDanger]} onPress={onDelete}>
          <Text style={{ fontSize: 16 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Manage Screen ────────────────────────────────────────────────────────────
export default function ManageScreen() {
  const { cards, addCard, updateCard, deleteCard, resetToDefaults } =
    useFlashcards();

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode

  function openAdd() {
    setEditTarget(null);
    setModalVisible(true);
  }

  function openEdit(card) {
    setEditTarget(card);
    setModalVisible(true);
  }

  function handleSave({ question, answer, category }) {
    if (editTarget) {
      updateCard(editTarget.id, { question, answer, category });
    } else {
      addCard({ question, answer, category });
    }
  }

  function handleDelete(card) {
    Alert.alert(
      'Delete Card',
      `Delete "${card.question}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCard(card.id),
        },
      ]
    );
  }

  function handleReset() {
    Alert.alert(
      'Reset to Defaults',
      'This will replace all cards with the original sample deck. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetToDefaults,
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-light">
      {/* Header bar */}
      <View className="bg-white px-5 py-4 flex-row items-center justify-between shadow">
        <Text className="text-dark font-bold text-base">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} in deck
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text className="text-gray text-sm">Reset ↺</Text>
        </TouchableOpacity>
      </View>

      {/* Card List */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-5xl mb-4">📭</Text>
            <Text className="text-dark font-bold text-xl mb-2">No cards yet</Text>
            <Text className="text-gray text-center">
              Tap the + button below to add your first flashcard.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CardRow
            card={item}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openAdd}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Card Form Modal */}
      <CardModal
        visible={modalVisible}
        initial={editTarget}
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  cardAnswer: {
    fontSize: 13,
    color: '#636E72',
  },
  badge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    color: '#0984E3',
    fontWeight: '600',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDanger: {
    backgroundColor: '#ffeaea',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0984E3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0984E3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
    marginTop: -2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2D3436',
    marginBottom: 14,
    minHeight: 48,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#F5F7FA',
  },
  btnCancelText: {
    color: '#636E72',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSave: {
    backgroundColor: '#0984E3',
  },
  btnSaveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});