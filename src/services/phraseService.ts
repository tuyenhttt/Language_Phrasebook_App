import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface Phrase {
  id?: string;
  category: string;
  english: string;
  vietnamese: string;
  pronunciation: string;
}

const phrasesCollection = collection(db, "phrases");

export const getPhrases = async (): Promise<Phrase[]> => {
  try {
    const querySnapshot = await getDocs(phrasesCollection);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Phrase)
    );
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

export const getPhrasesByCategory = async (categoryId: string) => {
  try {
    const allPhrases = await getPhrases();
    return allPhrases.filter((phrase) => phrase.category === categoryId);
  } catch (error) {
    console.error("Error getting phrases by category:", error);
    throw error;
  }
};
