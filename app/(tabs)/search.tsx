import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Phrase } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Temporary mock data
const mockPhrases: Phrase[] = [
  {
    id: 1,
    topic: 'Greetings',
    phrase_native: 'こんにちは',
    phrase_translation: 'Hello',
    phonetic: 'Konnichiwa',
    is_favorite: false,
    created_at: new Date(),
  },
  {
    id: 2,
    topic: 'Greetings',
    phrase_native: 'こんばんは',
    phrase_translation: 'Good evening',
    phonetic: 'Konbanwa',
    is_favorite: false,
    created_at: new Date(),
  },
  {
    id: 3,
    topic: 'Greetings',
    phrase_native: 'もしもし',
    phrase_translation: 'Hello',
    phonetic: 'Moshi moshi',
    is_favorite: false,
    created_at: new Date(),
  },
  {
    id: 4,
    topic: 'Greetings',
    phrase_native: 'やあ',
    phrase_translation: 'Hello',
    phonetic: 'Y',
    is_favorite: false,
    created_at: new Date(),
  },
];

const notes: Record<number, string> = {
  3: 'on the phone',
  4: 'informal',
};

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>(mockPhrases);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = mockPhrases.filter(phrase => 
      phrase.phrase_native.toLowerCase().includes(text.toLowerCase()) ||
      phrase.phrase_translation.toLowerCase().includes(text.toLowerCase()) ||
      (phrase.phonetic?.toLowerCase().includes(text.toLowerCase()) ?? false)
    );
    setFilteredPhrases(filtered);
  };

  const renderPhraseItem = ({ item }: { item: Phrase }) => (
    <View style={styles.resultRow}>
      <View style={styles.resultLeft}>
        <Text style={styles.phraseNative}>{item.phrase_native}</Text>
        {item.phonetic && <Text style={styles.phonetic}>{item.phonetic}</Text>}
      </View>
      <View style={styles.resultRight}>
        <Text style={styles.phraseTranslation}>{item.phrase_translation}</Text>
        {notes[item.id] && <Text style={styles.note}>( {notes[item.id]} )</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Dark header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{'Simple Language\nPhrasebook'}</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => {}}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>
      {/* Results */}
      <View style={styles.resultsContainer}>
        <FlatList
          data={filteredPhrases}
          renderItem={renderPhraseItem}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery.length > 0 
                  ? 'No phrases found'
                  : 'Search for phrases to get started'}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#222',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 22,
  },
  headerIcon: {
    marginLeft: 10,
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  searchBar: {
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 0,
    color: '#222',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f0f1f4',
    paddingHorizontal: 18,
    paddingTop: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultLeft: {
    flex: 1.2,
  },
  resultRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  phraseNative: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  phonetic: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  phraseTranslation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  note: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 