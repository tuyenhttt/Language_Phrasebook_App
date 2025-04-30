import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../src/config/firebase";
import { getFavorites } from "../../src/services/favoriteService";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritesScreen() {
  const router = useRouter();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const uid = auth.currentUser?.uid || "";

  const fetchUserFavorites = async () => {
    try {
      const favs = await getFavorites(uid);
      const phraseMap: { [key: string]: any } = {};

      for (const fav of favs) {
        const phraseDoc = await getDoc(doc(db, "phrases", fav.phraseId));
        console.log(
          "Check phraseId:",
          fav.phraseId,
          "exists:",
          phraseDoc.exists()
        );
        if (phraseDoc.exists()) {
          const phraseData = phraseDoc.data();
          const category =
            typeof fav.category === "string" ? fav.category : "Unknown";
          if (!phraseMap[category]) phraseMap[category] = [];
          phraseMap[category].push({
            id: fav.phraseId,
            english: phraseData.english,
            vietnamese: phraseData.vietnamese,
          });
        } else {
          console.warn("Phrase not found for id:", fav.phraseId);
        }
      }

      const formattedSections = Object.entries(phraseMap).map(
        ([category, data]) => ({
          topic: category,
          data,
        })
      );

      setSections(formattedSections);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, [uid]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserFavorites();
    }, [uid])
  );

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
        edges={["top", "left", "right"]}
      >
        <ActivityIndicator size="large" color="#4169E1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerIcon} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { topic } }) => (
          <Text style={styles.sectionHeader}>{topic}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.phrase}>
              {item.english} - {item.vietnamese}
            </Text>
            <Ionicons
              name="star"
              size={22}
              color="#FFD700"
              style={styles.starIcon}
            />
          </View>
        )}
        ListHeaderComponent={
          <Text style={styles.title}>Your Favorite Phrases</Text>
        }
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4169E1",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIcon: { padding: 8 },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  listContent: { padding: 18, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 18, color: "#222" },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#888",
    marginTop: 18,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  phrase: { fontSize: 16, color: "#222", flex: 1 },
  starIcon: { marginLeft: 10 },
});
