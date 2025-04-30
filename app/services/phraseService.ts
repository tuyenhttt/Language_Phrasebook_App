import { db } from "../../src/config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  writeBatch,
} from "firebase/firestore";

export interface Phrase {
  id?: string;
  category: string;
  english: string;
  vietnamese: string;
  pronunciation?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
}

export interface Theme {
  id?: string;
  title: string;
  icon: string;
  createdAt: Date;
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Favorite {
  id?: string;
  userId: string;
  phraseId: string;
  createdAt: Date;
}

export interface History {
  id?: string;
  userId: string;
  phraseId: string;
  action: "view" | "search" | "favorite";
  timestamp: Date;
}

const phrasesCollection = collection(db, "phrases");
const themesCollection = collection(db, "themes");
const usersCollection = collection(db, "users");
const favoritesCollection = collection(db, "favorites");
const historyCollection = collection(db, "history");

// Sample data to initialize Firebase
const samplePhrases = [
  {
    category: "Chào hỏi",
    english: "Hello",
    vietnamese: "Xin chào",
    pronunciation: "sin chow",
  },
  {
    category: "Chào hỏi",
    english: "Good morning",
    vietnamese: "Chào buổi sáng",
    pronunciation: "chow boo-ee sang",
  },
  {
    category: "Ẩm thực",
    english: "I am hungry",
    vietnamese: "Tôi đói",
    pronunciation: "toy doy",
  },
  {
    category: "Ẩm thực",
    english: "This is delicious",
    vietnamese: "Món này ngon",
    pronunciation: "mon nay ngon",
  },
  {
    category: "Du lịch",
    english: "Where is the airport?",
    vietnamese: "Sân bay ở đâu?",
    pronunciation: "san bay o dow",
  },
  {
    category: "Mua sắm",
    english: "How much is it?",
    vietnamese: "Bao nhiêu tiền?",
    pronunciation: "bow nyew tyen",
  },
];

// Sample data to initialize Firebase
const sampleThemes = [
  {
    title: "Chào hỏi",
    icon: "chatbubble-outline",
  },
  {
    title: "Ẩm thực",
    icon: "restaurant-outline",
  },
  {
    title: "Du lịch",
    icon: "airplane-outline",
  },
  {
    title: "Mua sắm",
    icon: "cart-outline",
  },
];

export const initializeSampleData = async (): Promise<void> => {
  try {
    const themesSnapshot = await getDocs(themesCollection);
    const phrasesSnapshot = await getDocs(phrasesCollection);

    if (themesSnapshot.empty) {
      for (const theme of sampleThemes) {
        try {
          const docRef = await addDoc(themesCollection, {
            ...theme,
            createdAt: new Date(),
          });
        } catch (error) {
          console.error("Error adding theme document:", error);
          throw error;
        }
      }
    } else {
      console.log("Themes collection already has data");
    }

    if (phrasesSnapshot.empty) {
      for (const phrase of samplePhrases) {
        try {
          const docRef = await addDoc(phrasesCollection, phrase);
          console.log("Added phrase document with ID:", docRef.id);
          console.log("Phrase data:", phrase);
        } catch (error) {
          console.error("Error adding phrase document:", error);
          throw error;
        }
      }
      console.log("Sample phrases added successfully");
    } else {
      console.log("Phrases collection already has data");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log("Starting getCategories function...");
    console.log("Firebase db instance:", db);
    console.log("Collection reference:", themesCollection);

    // Get all documents from themes collection
    let querySnapshot = await getDocs(themesCollection);
    console.log("Query snapshot:", querySnapshot);
    console.log("Number of documents:", querySnapshot.docs.length);

    if (querySnapshot.empty) {
      console.log("No documents found in the collection");
      // If no documents found, try to add sample data
      await initializeSampleData();
      // Try to get documents again after adding sample data
      querySnapshot = await getDocs(themesCollection);
      console.log(
        "Number of documents after initialization:",
        querySnapshot.docs.length
      );

      if (querySnapshot.empty) {
        throw new Error("Failed to initialize sample data");
      }
    }

    const categories: Category[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        icon: data.icon,
      };
    });

    console.log("\nFinal categories array:", categories);

    if (categories.length === 0) {
      console.log("No categories found in any documents");
      console.log(
        "Document IDs:",
        querySnapshot.docs.map((doc) => doc.id)
      );
      throw new Error("No categories found in the documents");
    }

    return categories;
  } catch (error) {
    console.error("Error in getCategories:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};

const getIconForCategory = (category: string | undefined | null): string => {
  if (!category) return "book-outline";

  switch (category.toLowerCase()) {
    case "chào hỏi":
      return "chatbubble-outline";
    case "ẩm thực":
      return "restaurant-outline";
    case "du lịch":
      return "airplane-outline";
    case "mua sắm":
      return "cart-outline";
    default:
      return "book-outline";
  }
};

export const getPhrases = async (): Promise<Phrase[]> => {
  try {
    const querySnapshot = await getDocs(phrasesCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Phrase[];
  } catch (error) {
    console.error("Error getting phrases:", error);
    throw error;
  }
};

export const addPhrase = async (
  phrase: Omit<Phrase, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(phrasesCollection, phrase);
    return docRef.id;
  } catch (error) {
    console.error("Error adding phrase:", error);
    throw error;
  }
};

export const updatePhrase = async (
  id: string,
  phrase: Partial<Phrase>
): Promise<void> => {
  try {
    const docRef = doc(db, "phrases", id);
    await updateDoc(docRef, phrase);
  } catch (error) {
    console.error("Error updating phrase:", error);
    throw error;
  }
};

export const deletePhrase = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "phrases", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting phrase:", error);
    throw error;
  }
};

// User functions
export const createUser = async (user: Omit<User, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(usersCollection, user);
    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  user: Partial<User>
): Promise<void> => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, user);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Favorite functions
export const addFavorite = async (
  userId: string,
  phraseId: string
): Promise<string> => {
  try {
    const favorite: Omit<Favorite, "id"> = {
      userId,
      phraseId,
      createdAt: new Date(),
    };
    const docRef = await addDoc(favoritesCollection, favorite);
    return docRef.id;
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (favoriteId: string): Promise<void> => {
  try {
    const docRef = doc(db, "favorites", favoriteId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    const q = query(favoritesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Favorite)
    );
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw error;
  }
};

// History functions
export const addHistory = async (
  userId: string,
  phraseId: string,
  action: "view" | "search" | "favorite"
): Promise<string> => {
  try {
    const history: Omit<History, "id"> = {
      userId,
      phraseId,
      action,
      timestamp: new Date(),
    };
    const docRef = await addDoc(historyCollection, history);
    return docRef.id;
  } catch (error) {
    console.error("Error adding history:", error);
    throw error;
  }
};

export const getUserHistory = async (userId: string): Promise<History[]> => {
  try {
    const q = query(historyCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as History)
    );
  } catch (error) {
    console.error("Error getting user history:", error);
    throw error;
  }
};

export const addTheme = async (
  theme: Omit<Theme, "id" | "createdAt">
): Promise<string> => {
  try {
    const newTheme: Omit<Theme, "id"> = {
      ...theme,
      createdAt: new Date(),
    };
    const docRef = await addDoc(themesCollection, newTheme);
    return docRef.id;
  } catch (error) {
    console.error("Error adding theme:", error);
    throw error;
  }
};

export const deleteTheme = async (themeId: string): Promise<void> => {
  try {
    // Get the theme to get its title
    const themeDoc = await getDoc(doc(db, "themes", themeId));
    if (!themeDoc.exists()) {
      throw new Error("Theme not found");
    }
    const themeData = themeDoc.data();
    const themeTitle = themeData.title;

    // Start a batch write
    const batch = writeBatch(db);

    // Delete all phrases associated with this theme
    const phrasesQuery = query(
      phrasesCollection,
      where("category", "==", themeTitle)
    );
    const phrasesSnapshot = await getDocs(phrasesQuery);

    // Add each phrase deletion to the batch
    phrasesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Add theme deletion to the batch
    batch.delete(doc(db, "themes", themeId));

    // Commit the batch
    await batch.commit();

    console.log(
      `Successfully deleted theme "${themeTitle}" and ${phrasesSnapshot.docs.length} associated phrases`
    );
  } catch (error) {
    console.error("Error deleting theme:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete theme: ${error.message}`);
    }
    throw new Error("Failed to delete theme");
  }
};

export const getPhrasesByCategory = async (
  categoryId: string
): Promise<Phrase[]> => {
  try {
    // First get the category title from the theme
    const themeDoc = await getDoc(doc(db, "themes", categoryId));
    if (!themeDoc.exists()) {
      throw new Error("Theme not found");
    }
    const themeData = themeDoc.data();
    const categoryTitle = themeData.title;

    // Then get all phrases for this category
    const q = query(phrasesCollection, where("category", "==", categoryTitle));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Phrase)
    );
  } catch (error) {
    console.error("Error getting phrases by category:", error);
    throw error;
  }
};
