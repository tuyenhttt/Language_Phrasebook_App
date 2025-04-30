import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  getCategories,
  Category,
  initializeSampleData,
  addTheme,
  deleteTheme,
} from "../services/phraseService";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../src/config/firebase";

const uid = auth.currentUser?.uid;

export default function HomeScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const router = useRouter();

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Initialize sample data if needed
      await initializeSampleData();
      // Get categories
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error("Error in loadCategories:", error);
      let errorMessage = "Failed to load categories";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleFavoritePress = () => {
    router.push("/(tabs)/favorites");
  };

  const handleAddPress = () => {
    router.push("/add-phrase");
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên topic",
      });
      return;
    }
    try {
      await addTheme({ title: newTopic.trim(), icon: "book-outline" });
      setShowAddTopic(false);
      setNewTopic("");
      loadCategories();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã thêm topic mới",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể thêm topic",
      });
    }
  };

  const handleDeleteTopic = async (
    categoryId: string,
    categoryTitle: string
  ) => {
    Alert.alert(
      "Delete Topic",
      `Are you sure you want to delete topic? "${categoryTitle}"? All vocabulary in this topic will also be deleted.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTheme(categoryId);

              Toast.show({
                type: "success",
                text1: "Success",
                text2: `Topic deleted "${categoryTitle}"`,
                position: "bottom",
                visibilityTime: 2000,
              });

              // Refresh the categories list
              await loadCategories();
            } catch (error) {
              console.error("Error deleting topic:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error instanceof Error
                    ? error.message
                    : "Cannot deleted topic",
                position: "bottom",
                visibilityTime: 3000,
              });
            }
          },
        },
      ]
    );
  };

  const handleThemePress = (categoryId: string) => {
    router.push({ pathname: "/(tabs)/details", params: { categoryId } });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={handleFavoritePress}
        >
          <Ionicons name="star-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simple Language Phrasebook</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.push("/(tabs)/search" as any)}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add Topic Button */}
      <TouchableOpacity
        style={styles.addTopicBtn}
        onPress={() => setShowAddTopic(true)}
      >
        <Ionicons name="add-circle-outline" size={22} color="#4169E1" />
        <Text style={styles.addTopicText}>Add Topic</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search phrases..."
            placeholderTextColor="#666"
          />
        </View>
      )}

      {/* Body */}
      <ScrollView
        style={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4169E1"]}
          />
        }
      >
        {categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No categories found</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadCategories}
            >
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category.id} style={styles.themeItem}>
              <TouchableOpacity
                style={styles.themeContent}
                onPress={() => handleThemePress(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color="#4169E1"
                />
                <Text style={styles.themeTitle}>{category.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  handleDeleteTopic(category.id, category.title);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Topic Modal */}
      <Modal
        visible={showAddTopic}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddTopic(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}
            >
              Add New Topic
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Topic name"
              value={newTopic}
              onChangeText={setNewTopic}
            />
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#4169E1" }]}
                onPress={handleAddTopic}
              >
                <Text style={{ color: "#fff" }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: "#ccc", marginLeft: 8 },
                ]}
                onPress={() => setShowAddTopic(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Toast component at the end of the container */}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4169E1",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  body: {
    flex: 1,
  },
  themeItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 500,
    alignSelf: "center",
    width: "95%",
  },
  themeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#4169E1",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorText: {
    color: "#666",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  addTopicBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eaf0fb",
    borderRadius: 20,
  },
  addTopicText: {
    color: "#4169E1",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 15,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
    width: "100%",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
});
