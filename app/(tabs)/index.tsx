import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Topic } from '../types';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const mockTopics: Topic[] = [
  {
    id: 1,
    name: 'Greetings',
    description: 'Basic greeting phrases',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Food',
    description: 'Common phrases for restaurants and food',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Travel',
    description: 'Useful phrases for traveling',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'Shopping',
    description: 'Phrases for shopping',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const topicIcons: Record<string, JSX.Element> = {
  Greetings: <Ionicons name="chatbubble-ellipses" size={28} color="#2563eb" />, // speech bubble
  Food: <MaterialIcons name="restaurant" size={28} color="#2563eb" />, // fork & knife
  Travel: <FontAwesome5 name="plane" size={26} color="#2563eb" />, // airplane
  Shopping: <MaterialIcons name="shopping-cart" size={28} color="#2563eb" />, // cart
};

export default function HomeScreen() {
  const router = useRouter();

  const renderTopicItem = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={() => router.push({ pathname: '/topic/[id]', params: { id: item.id } })}
    >
      <View style={styles.topicIcon}>{topicIcons[item.name] || <Ionicons name="folder" size={28} color="#2563eb" />}</View>
      <Text style={styles.topicName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Custom Blue Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconLeft} onPress={() => router.push('/(tabs)/favorites' as any)}>
          <Ionicons name="star" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simple Language Phrasebook</Text>
        <TouchableOpacity style={styles.headerIconRight} onPress={() => router.push('/(tabs)/search' as any)}>
          <Ionicons name="search" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Topics List */}
      <FlatList
        data={mockTopics}
        renderItem={renderTopicItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.topicsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/phrase/add' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={48} color="#2563eb" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIconLeft: {
    position: 'absolute',
    left: 16,
    top: 48,
    zIndex: 2,
  },
  headerIconRight: {
    position: 'absolute',
    right: 16,
    top: 48,
    zIndex: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  topicsList: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topicIcon: {
    marginRight: 18,
  },
  topicName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 2,
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
