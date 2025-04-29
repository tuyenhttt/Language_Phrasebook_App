import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock grouped favorite data
const mockFavorites = [
  {
    topic: 'Greetings',
    data: [
      { id: 1, phrase: 'Hello' },
      { id: 2, phrase: 'Goodbye' },
    ],
  },
  {
    topic: 'Essentials',
    data: [
      { id: 3, phrase: 'Please' },
      { id: 4, phrase: 'Thank you' },
    ],
  },
  {
    topic: 'Social',
    data: [
      { id: 5, phrase: 'How are you?' },
      { id: 6, phrase: 'My name is...' },
    ],
  },
  {
    topic: 'Travel',
    data: [
      { id: 7, phrase: 'Where is the bathroom?' },
    ],
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Blue header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simple Language Phrasebook</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/(tabs)/search' as any)}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={mockFavorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { topic } }) => (
          <Text style={styles.sectionHeader}>{topic}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.phrase}>{item.phrase}</Text>
            <Ionicons name="star" size={22} color="#FFD700" style={styles.starIcon} />
          </View>
        )}
        ListHeaderComponent={<Text style={styles.title}>Favorites</Text>}
        stickySectionHeadersEnabled={false}
      />
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
    justifyContent: 'space-between',
    backgroundColor: '#4169E1',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    padding: 18,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 18,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  phrase: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  starIcon: {
    marginLeft: 10,
  },
}); 