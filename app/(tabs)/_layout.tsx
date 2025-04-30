import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../src/config/firebase";
import { addFavorite, getFavorites } from "../../src/services/favoriteService";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function TabLayout() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddFavorite = async (phraseId: string, category: string) => {
    const uid = auth.currentUser?.uid || "";
    await addFavorite(uid, phraseId, category);
  };

  useEffect(() => {
    const fetchUserFavorites = async () => {
      const uid = auth.currentUser?.uid || "";

      const favs = await getFavorites(uid);

      for (const fav of favs) {
        const phraseDoc = await getDoc(doc(db, "phrases", fav.phraseId));
      }
    };
    fetchUserFavorites();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4169E1",
        },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#4169E1",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Khám phá",
          headerTitle: "Khám phá",
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerTitle: "Favorites",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="details"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
