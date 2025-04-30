import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getPhrases, Phrase } from "../../app/services/phraseService";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

// Nếu cần notes, hãy dùng Record<string, string> và id là string
const notes: Record<string, string> = {
  "3": "on the phone",
  "4": "informal",
};

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhrases = async () => {
      setLoading(true);
      try {
        const phrases = await getPhrases();
        setAllPhrases(phrases);
        setFilteredPhrases(phrases);
      } catch (error) {
        setAllPhrases([]);
        setFilteredPhrases([]);
      }
      setLoading(false);
    };
    fetchPhrases();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = allPhrases.filter(
      (phrase) =>
        phrase.vietnamese?.toLowerCase().includes(text.toLowerCase()) ||
        phrase.english?.toLowerCase().includes(text.toLowerCase()) ||
        (phrase.pronunciation?.toLowerCase().includes(text.toLowerCase()) ??
          false)
    );
    setFilteredPhrases(filtered);
  };

  const renderPhraseItem = ({ item }: { item: Phrase }) => (
    <View style={styles.resultRow}>
      <View style={styles.resultLeft}>
        <Text style={styles.phraseNative}>{item.vietnamese}</Text>
        {item.pronunciation && (
          <Text style={styles.phonetic}>{item.pronunciation}</Text>
        )}
      </View>
      <View style={styles.resultRight}>
        <Text style={styles.phraseTranslation}>{item.english}</Text>
        {item.id && notes[item.id] && (
          <Text style={styles.note}>( {notes[item.id]} )</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Dark header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            marginRight: 12,
            padding: 6,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Simple Language Phrasebook"}</Text>
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4169E1"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={filteredPhrases}
            renderItem={renderPhraseItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 0
                    ? "No phrases found"
                    : "Search for phrases to get started"}
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4169E1",
    paddingTop: 30,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4169E1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  headerIcon: {
    marginLeft: 10,
    padding: 6,
  },
  searchBarContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  searchBar: {
    backgroundColor: "#f6f7fa",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 0,
    color: "#222",
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#f0f1f4",
    paddingHorizontal: 18,
    paddingTop: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultLeft: {
    flex: 1.2,
  },
  resultRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  phraseNative: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  phonetic: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  phraseTranslation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  note: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
    textAlign: "right",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
