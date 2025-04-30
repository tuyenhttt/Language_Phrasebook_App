import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/config/firebase";
import { ThemeProvider } from "./config/ThemeContext";
import { LanguageProvider } from "./config/LanguageContext";

// Kiểm tra xem segment hiện tại có phải là protected route không
const useProtectedRoute = () => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === "(auth)";
      console.log("Auth state changed:", { user: user?.email, inAuthGroup });

      if (!user && !inAuthGroup) {
        // Nếu chưa đăng nhập và không ở màn hình auth, chuyển đến login
        console.log("User not authenticated, redirecting to login");
        router.replace("/(auth)/login");
      } else if (user && inAuthGroup) {
        // Nếu đã đăng nhập và đang ở màn hình auth, chuyển đến home
        console.log("User authenticated, redirecting to home");
        router.replace("/(tabs)");
      }
    });

    return unsubscribe;
  }, [segments]);
};

export default function RootLayout() {
  useProtectedRoute();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </ThemeProvider>
  );
}
