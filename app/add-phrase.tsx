import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { addPhrase, getCategories, Category } from "./services/phraseService";

export default function AddPhraseScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<Category[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showTopicList, setShowTopicList] = useState(false);
  const [phrase_native, setPhraseNative] = useState("");
  const [phrase_translation, setPhraseTranslation] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const categories = await getCategories();
        setTopics(categories);
        if (categories.length > 0) {
          setSelectedTopic(categories[0].title);
        }
      } catch (error) {
        console.error("Error loading topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, []);

  const handleSave = async () => {
    if (!phrase_native || !phrase_translation || !selectedTopic) {
      return;
    }

    setIsSaving(true);
    try {
      await addPhrase({
        category: selectedTopic,
        vietnamese: phrase_native,
        english: phrase_translation,
        pronunciation: phonetic || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Error saving phrase:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading topics...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Android-style AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.appBarAction}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Add Phrase</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          <Text style={[styles.appBarAction, isSaving && { opacity: 0.5 }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Topic Picker */}
        <Text style={styles.label}>Topic</Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => setShowTopicList(!showTopicList)}
          activeOpacity={0.7}
        >
          <Text style={styles.selectInputText}>{selectedTopic}</Text>
        </TouchableOpacity>
        {showTopicList && (
          <View style={styles.topicList}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicListItem}
                onPress={() => {
                  setSelectedTopic(topic.title);
                  setShowTopicList(false);
                }}
              >
                <Text
                  style={[
                    styles.topicListItemText,
                    topic.title === selectedTopic && {
                      color: "#2563eb",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Phrase */}
        <Text style={styles.label}>Phrase</Text>
        <TextInput
          style={styles.input}
          value={phrase_native}
          onChangeText={setPhraseNative}
          placeholder="Enter phrase in target language"
          placeholderTextColor="#888"
        />

        {/* Translation */}
        <Text style={styles.label}>Translation</Text>
        <TextInput
          style={styles.input}
          value={phrase_translation}
          onChangeText={setPhraseTranslation}
          placeholder="Enter translation"
          placeholderTextColor="#888"
        />

        {/* Phonetic */}
        <Text style={styles.label}>Phonetic</Text>
        <TextInput
          style={styles.input}
          value={phonetic}
          onChangeText={setPhonetic}
          placeholder="Enter phonetic (optional)"
          placeholderTextColor="#888"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fa",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 16 : 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  appBarAction: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 6,
    marginTop: 18,
  },
  selectInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
    justifyContent: "center",
  },
  selectInputText: {
    fontSize: 16,
    color: "#222",
  },
  topicList: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
    marginTop: 2,
    overflow: "hidden",
  },
  topicListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topicListItemText: {
    fontSize: 16,
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 4,
  },
});
