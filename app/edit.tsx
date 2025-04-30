import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Phrase } from "./types";
import { getPhrases, updatePhrase } from "./services/phraseService";
import { SafeAreaView } from "react-native-safe-area-context";

const TOPICS = ["Greetings", "Food", "Travel", "Shopping"];

export default function EditPhraseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phraseId = params.id as string;
  const themeId = params.themeId as string;

  const [topic, setTopic] = useState(TOPICS[0]);
  const [showTopicList, setShowTopicList] = useState(false);
  const [phrase_native, setPhraseNative] = useState("");
  const [phrase_translation, setPhraseTranslation] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhrase = async () => {
      try {
        const phrases = await getPhrases();
        const phrase = phrases.find((p) => p.id === phraseId);
        if (phrase) {
          setTopic(phrase.category);
          setPhraseNative(phrase.vietnamese);
          setPhraseTranslation(phrase.english);
          setPhonetic(phrase.pronunciation || "");
        }
      } catch (error) {
        console.error("Error loading phrase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhrase();
  }, [phraseId]);

  const handleSave = async () => {
    try {
      await updatePhrase(phraseId, {
        category: topic,
        vietnamese: phrase_native,
        english: phrase_translation,
        pronunciation: phonetic || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Error saving phrase:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Android-style AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.appBarAction}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Edit Phrase</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.appBarAction}>Save</Text>
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
            <Text style={styles.selectInputText}>{topic}</Text>
          </TouchableOpacity>
          {showTopicList && (
            <View style={styles.topicList}>
              {TOPICS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.topicListItem}
                  onPress={() => {
                    setTopic(t);
                    setShowTopicList(false);
                  }}
                >
                  <Text
                    style={[
                      styles.topicListItemText,
                      t === topic && { color: "#2563eb", fontWeight: "bold" },
                    ]}
                  >
                    {t}
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
    </SafeAreaView>
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
