import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

type Sender = 'me' | 'them';
type MessageStatus = 'sent' | 'delivered' | 'read';

type Message = {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  status: MessageStatus;
};

const starterMessages: Message[] = [
  {
    id: '1',
    sender: 'them',
    text: 'Your charts flow together so naturally. How are you feeling today?',
    time: '09:42',
    status: 'read',
  },
  {
    id: '2',
    sender: 'me',
    text: 'Grounded. Been journaling a lot lately.',
    time: '09:45',
    status: 'read',
  },
  {
    id: '3',
    sender: 'them',
    text: "Love that. Moon is in Taurus so it is a perfect time to settle in.",
    time: '09:46',
    status: 'read',
  },
];

const autoResponses = [
  'Want to try a 3-card pull together tonight?',
  'I set a reminder for the meteor shower on Friday.',
  'Saved a playlist that matches our composite chart vibe.',
];

export default function SoulmateChatScreen({ route }: any) {
  const matchName = route?.params?.matchName ?? 'Nora';
  const compatibility = route?.params?.compatibility ?? 92;
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const listRef = useRef<FlatList<Message>>(null);

  const connectionLabel = useMemo(() => {
    if (compatibility >= 90) return 'Vibe Locked · Real-time';
    if (compatibility >= 75) return 'Great Match · Live';
    return 'Connected';
  }, [compatibility]);

  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  const setStatus = (id: string, status: MessageStatus) => {
    setMessages(prev =>
      prev.map(message => (message.id === id ? { ...message, status } : message)),
    );
  };

  const sendResponse = () => {
    const text = autoResponses[replyIndex % autoResponses.length];
    const now = new Date();
    const response: Message = {
      id: `auto-${now.getTime()}`,
      sender: 'them',
      text,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
    setReplyIndex(prev => prev + 1);
    scrollToBottom();
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date();
    const message: Message = {
      id: `msg-${now.getTime()}`,
      sender: 'me',
      text: trimmed,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setInput('');
    scrollToBottom();

    // Simulate message lifecycle and a reply to keep UI alive without backend.
    setTimeout(() => setStatus(message.id, 'delivered'), 500);
    setTimeout(() => setStatus(message.id, 'read'), 1200);
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(sendResponse, 2000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const fromMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, fromMe && styles.messageRowMine]}>
        {!fromMe && (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{matchName[0]}</Text>
          </View>
        )}
        <View style={[styles.bubble, fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={styles.bubbleText}>{item.text}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.timeText}>{item.time}</Text>
            {fromMe && (
              <View style={styles.statusRow}>
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  color={item.status === 'read' ? '#22c55e' : '#9ca3af'}
                />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTyping = () =>
    isTyping ? (
      <View style={styles.typingRow}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>Typing</Text>
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotMedium]} />
            <View style={[styles.dot, styles.dotSlow]} />
          </View>
        </View>
        <Text style={styles.typingLabel}>{matchName} is crafting a reply</Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#181a2f', '#0f0f1e']} style={styles.header}>
        <View>
          <Text style={styles.matchLabel}>Soulmate Chat</Text>
          <Text style={styles.matchName}>{matchName}</Text>
          <Text style={styles.connection}>{connectionLabel}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.scorePill}>
            <Ionicons name="sparkles" size={16} color="#fcd34d" />
            <Text style={styles.scoreText}>{compatibility}%</Text>
          </View>
          <Ionicons name="notifications" size={20} color="#fff" />
        </View>
      </LinearGradient>

      <View style={styles.sessionCard}>
        <View style={styles.sessionLeft}>
          <View style={styles.sessionIcon}>
            <Ionicons name="heart-circle" size={20} color="#ec4899" />
          </View>
          <View>
            <Text style={styles.sessionTitle}>Live soulmate session</Text>
            <Text style={styles.sessionSubtitle}>Realtime insights, no limits</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sessionAction}>
          <Text style={styles.sessionActionText}>Add note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderTyping}
        onContentSizeChange={scrollToBottom}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <View style={styles.composer}>
          <TouchableOpacity style={styles.composerIcon}>
            <Ionicons name="add-circle-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Send a message, intention, or question"
            placeholderTextColor={colors.cosmic.textSecondary}
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchLabel: {
    color: colors.cosmic.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  matchName: {
    color: colors.cosmic.text,
    fontSize: 22,
    fontWeight: '700',
  },
  connection: {
    color: '#a78bfa',
    fontSize: 13,
    marginTop: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1f1f33',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scoreText: {
    color: '#fcd34d',
    fontWeight: '700',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cosmic.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#24243a',
    marginBottom: 8,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(236, 72, 153, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTitle: {
    color: colors.cosmic.text,
    fontWeight: '700',
    fontSize: 15,
  },
  sessionSubtitle: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
  },
  sessionAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    borderRadius: 10,
  },
  sessionActionText: {
    color: colors.cosmic.text,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    maxWidth: '90%',
  },
  messageRowMine: {
    alignSelf: 'flex-end',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: colors.cosmic.text,
    fontWeight: '700',
  },
  bubble: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f1f33',
  },
  bubbleTheirs: {
    backgroundColor: '#161726',
  },
  bubbleMine: {
    backgroundColor: '#2f2f44',
  },
  bubbleText: {
    color: colors.cosmic.text,
    fontSize: 15,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 10,
  },
  timeText: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  typingRow: {
    alignItems: 'flex-start',
    marginTop: 4,
    paddingLeft: 8,
  },
  typingBubble: {
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24243a',
  },
  typingText: {
    color: colors.cosmic.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
  },
  dotMedium: {
    opacity: 0.7,
  },
  dotSlow: {
    opacity: 0.5,
  },
  typingLabel: {
    color: colors.cosmic.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#1f1f33',
    backgroundColor: colors.cosmic.card,
    gap: 10,
  },
  composerIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    color: colors.cosmic.text,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.cosmic.purple,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
