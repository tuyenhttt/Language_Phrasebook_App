import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Phrase } from '../types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { themes, phrasesByTheme } from '../data/phrases';

export default function TopicDetailScreen() {
  const params = useLocalSearchParams();
  const themeId = typeof params.id === 'string' ? parseInt(params.id, 10) : Number(params.id);
  const theme = themes.find(t => t.id === themeId);
  const router = useRouter();
  
  const [phrases, setPhrases] = useState<Phrase[]>(
    themeId && phrasesByTheme[themeId] ? phrasesByTheme[themeId] : []
  );
  
  // Helper: are all phrases favorite?
  const allFavorite = phrases.length > 0 && phrases.every(p => p.is_favorite);

  const handleEdit = (phraseId: number) => {
    router.push({
      pathname: "/edit",
      params: { id: phraseId, themeId }
    });
  };

  const handleDelete = (phraseId: number) => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Are you sure you want to delete this phrase?',
        '',
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => setPhrases(phrases.filter(p => p.id !== phraseId)),
            style: 'destructive'
          }
        ]
      );
    } else {
      Alert.alert(
        'Delete Phrase',
        'Are you sure you want to delete this phrase?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: () => setPhrases(phrases.filter(p => p.id !== phraseId)),
            style: 'destructive'
          }
        ]
      );
    }
  };

  const handleToggleFavorite = (phraseId: number) => {
    setPhrases(phrases.map(p => p.id === phraseId ? { ...p, is_favorite: !p.is_favorite } : p));
  };

  if (!theme) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconLeft} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Theme not found</Text>
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Theme not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconLeft} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{theme.title}</Text>
        <TouchableOpacity
          style={styles.headerIconRight}
          onPress={() => setPhrases(phrases.map(p => ({ ...p, is_favorite: !allFavorite })))}
        >
          <Ionicons name={allFavorite ? 'star' : 'star-outline'} size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={phrases}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.translation}>{item.phrase_translation}</Text>
              <Text style={styles.native}>{item.phrase_native}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item.id)}>
                <MaterialIcons name="edit" size={22} color="#4169E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={22} color="#4169E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleToggleFavorite(item.id)}>
                <Ionicons 
                  name={item.is_favorite ? 'star' : 'star-outline'} 
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4169E1',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIconLeft: {
    position: 'absolute',
    left: 16,
    top: 48,
    zIndex: 2,
  },
  headerIconRight: {
    position: 'absolute',
    right: 16,
    top: 48,
    zIndex: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    padding: 18,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardLeft: {
    flex: 1,
  },
  translation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  native: {
    fontSize: 15,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconBtn: {
    marginLeft: 8,
    padding: 4,
  },
}); 