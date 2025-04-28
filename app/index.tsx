import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Topic } from './types';

// Temporary mock data
const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Greetings',
    description: 'Basic greeting phrases',
    phrases: []
  },
  {
    id: '2',
    name: 'Food & Dining',
    description: 'Common phrases for restaurants and food',
    phrases: []
  },
  {
    id: '3',
    name: 'Travel',
    description: 'Useful phrases for traveling',
    phrases: []
  }
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Language Phrasebook</Text>
      <FlatList
        data={mockTopics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/topic/${item.id}`} asChild>
            <TouchableOpacity style={styles.topicCard}>
              <Text style={styles.topicName}>{item.name}</Text>
              <Text style={styles.topicDescription}>{item.description}</Text>
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  topicCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 