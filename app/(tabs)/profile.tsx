import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../src/config/firebase";
import { getUserData, User } from "../../src/services/userService";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser?.uid) {
        const data = await getUserData(auth.currentUser.uid);
        setUser(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {user.avatar ? (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {" "}
                  {/* You can use Image if avatar is a URL */}
                  <Ionicons name="person" size={80} color="#fff" />
                </Text>
              </View>
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={80} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.name}>{user.displayName}</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Your Email</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={user.email}
                editable={false}
                style={styles.input}
              />
              <Ionicons name="mail-outline" size={20} color="#aaa" />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={user.phone || ""}
                editable={false}
                style={styles.input}
              />
              <Ionicons name="call-outline" size={20} color="#aaa" />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Website</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={user.website || ""}
                editable={false}
                style={styles.input}
              />
              <Ionicons name="globe-outline" size={20} color="#aaa" />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={"**********"}
                editable={false}
                secureTextEntry
                style={styles.input}
              />
              <Ionicons name="lock-closed-outline" size={20} color="#aaa" />
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8e7cf0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  job: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    backgroundColor: "transparent",
    borderWidth: 0,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
