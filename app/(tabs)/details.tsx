import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  getCategories,
  getPhrasesByCategory,
  Category,
  Phrase,
} from "../../app/services/phraseService";

interface PhraseWithFavorite extends Phrase {
  is_favorite?: boolean;
}

export default function TopicDetailScreen() {
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;
  const router = useRouter();

  const [theme, setTheme] = useState<Category | null>(null);
  const [phrases, setPhrases] = useState<PhraseWithFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categories = await getCategories();
        const foundTheme = categories.find(
          (c: Category) => c.id === categoryId
        );
        setTheme(foundTheme || null);

        if (foundTheme) {
          const phraseList = await getPhrasesByCategory(categoryId);
          setPhrases(
            phraseList.map((phrase) => ({ ...phrase, is_favorite: false }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load phrases");
      }
      setLoading(false);
    };
    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (!theme) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Theme not found</Text>
      </View>
    );
  }

  // Helper: are all phrases favorite?
  const allFavorite = phrases.length > 0 && phrases.every((p) => p.is_favorite);

  const handleEdit = (phraseId: string) => {
    router.push({
      pathname: "/edit",
      params: { id: phraseId, themeId: theme.id },
    });
  };

  const handleDelete = (phraseId: string) => {
    if (Platform.OS === "ios") {
      Alert.alert("Are you sure you want to delete this phrase?", "", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => setPhrases(phrases.filter((p) => p.id !== phraseId)),
          style: "destructive",
        },
      ]);
    } else {
      Alert.alert(
        "Delete Phrase",
        "Are you sure you want to delete this phrase?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => setPhrases(phrases.filter((p) => p.id !== phraseId)),
            style: "destructive",
          },
        ]
      );
    }
  };

  const handleToggleFavorite = (phraseId: string) => {
    setPhrases(
      phrases.map((p) =>
        p.id === phraseId ? { ...p, is_favorite: !p.is_favorite } : p
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconLeft}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{theme.title}</Text>
        <TouchableOpacity
          style={styles.headerIconRight}
          onPress={() =>
            setPhrases(
              phrases.map((p) => ({ ...p, is_favorite: !allFavorite }))
            )
          }
        >
          <Ionicons
            name={allFavorite ? "star" : "star-outline"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={phrases}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.translation}>{item.english}</Text>
              <Text style={styles.native}>{item.vietnamese}</Text>
              {item.pronunciation && (
                <Text style={styles.pronunciation}>{item.pronunciation}</Text>
              )}
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleEdit(item.id!)}
              >
                <MaterialIcons name="edit" size={22} color="#4169E1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(item.id!)}
              >
                <MaterialIcons name="delete" size={22} color="#4169E1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleToggleFavorite(item.id!)}
              >
                <Ionicons
                  name={item.is_favorite ? "star" : "star-outline"}
                  size={22}
                  color="#4169E1"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4169E1",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIconLeft: {
    position: "absolute",
    left: 16,
    top: 48,
    zIndex: 2,
  },
  headerIconRight: {
    position: "absolute",
    right: 16,
    top: 48,
    zIndex: 2,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: {
    flex: 1,
  },
  translation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  native: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  pronunciation: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 8,
  },
  errorText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
});
