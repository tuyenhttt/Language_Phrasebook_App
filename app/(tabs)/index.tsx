import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { themes } from '../data/phrases';

export default function HomeScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const handleThemePress = (themeId: number) => {
    router.push({
      pathname: "/details",
      params: { id: themeId }
    });
  };

  const handleFavoritePress = () => {
    router.push('/(tabs)/favorites');
  };

  const handleAddPress = () => {
    router.push('/add-phrase');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={handleFavoritePress}>
          <Ionicons name="star-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simple Language Phrasebook</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/(tabs)/search' as any)}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
      <ScrollView style={styles.body}>
        {themes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.themeItem}
            onPress={() => handleThemePress(item.id)}
          >
            <View style={styles.themeContent}>
              <Ionicons name={item.icon as any} size={24} color="#4169E1" />
              <Text style={styles.themeTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    backgroundColor: '#4169E1',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  themeItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4169E1',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 