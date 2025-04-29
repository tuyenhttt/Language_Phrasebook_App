import { db } from "../config/firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
}

const usersCollection = collection(db, "users");

export const createUserDocument = async (
  uid: string,
  email: string,
  displayName: string
): Promise<void> => {
  if (!uid || !email || !displayName) {
    throw new Error("Missing required user information");
  }

  try {
    console.log("Creating user document with data:", {
      uid,
      email,
      displayName,
    });

    // Check if user document already exists
    const userRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log("User document already exists, updating...");
      await updateDoc(userRef, {
        email,
        displayName,
        lastLoginAt: new Date(),
      });
    } else {
      console.log("Creating new user document...");
      const userData: User = {
        uid,
        email,
        displayName,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      await setDoc(userRef, {
        ...userData,
        createdAt: userData.createdAt.toISOString(),
        lastLoginAt: userData.lastLoginAt.toISOString(),
      });
    }

    console.log("User document operation completed successfully");
  } catch (error) {
    console.error("Error in createUserDocument:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create user document: ${error.message}`);
    } else {
      throw new Error("Failed to create user document: Unknown error");
    }
  }
};

export const getUserData = async (uid: string): Promise<User | null> => {
  if (!uid) {
    throw new Error("User ID is required");
  }

  try {
    console.log("Fetching user data for:", uid);
    const userRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        lastLoginAt: new Date(data.lastLoginAt),
      } as User;
    }
    console.log("No user document found");
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUserLastLogin = async (uid: string): Promise<void> => {
  if (!uid) {
    throw new Error("User ID is required");
  }

  try {
    console.log("Updating last login for user:", uid);
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, {
      lastLoginAt: new Date().toISOString(),
    });
    console.log("Last login updated successfully");
  } catch (error) {
    console.error("Error updating user last login:", error);
    throw error;
  }
};
