import { db } from '../config/firebase';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Interface để định nghĩa kiểu dữ liệu cho mỗi favorite
interface Favorite {
  id: string;
  phraseId: string;
  category: string;
}

// Thêm một favorite
export async function addFavorite(
  userId: string,
  phraseId: string,
  category: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'favorites'), {
      userId,
      phraseId,
      category,
    });
    console.log('Favorite added successfully');
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

// Xoá một favorite
export async function removeFavorite(favoriteDocId: string): Promise<void> {
  try {
    const favoriteDocRef = doc(db, 'favorites', favoriteDocId);
    await deleteDoc(favoriteDocRef);
    console.log('Favorite removed successfully');
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

// Lấy danh sách favorites của người dùng
export async function getFavorites(userId: string): Promise<Favorite[]> {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const results: Favorite[] = [];
    querySnapshot.forEach(docSnap => {
      const favorite = docSnap.data() as Omit<Favorite, 'id'>; // Loại bỏ 'id' khỏi favorite
      results.push({ id: docSnap.id, ...favorite }); // Đảm bảo 'id' không bị ghi đè
    });
    return results;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}
