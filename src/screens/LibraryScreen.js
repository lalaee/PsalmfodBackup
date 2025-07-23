import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import psalmsData from '../data/psalms.json';
import { HIGHLIGHT_COLORS, COLOR_LABELS } from '../constants/highlightColors';

const LibraryScreen = ({ navigation }) => {
  const [groupedHighlights, setGroupedHighlights] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);

  // useFocusEffect runs every time the user focuses on this screen
  useFocusEffect(
    useCallback(() => {
      const loadHighlights = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const highlightKeys = keys.filter(key => key.startsWith('psalm-'));
          const storedHighlights = await AsyncStorage.multiGet(highlightKeys);

          const groupedByColor = {};

          // Process and group highlights by color
          storedHighlights.forEach(([key, color]) => {
            const [chapterNum, verseNum] = key.replace('psalm-', '').split(':').map(Number);
            
            const chapter = psalmsData.find(p => p.chapter === chapterNum);
            const verse = chapter?.verses.find(v => v.verse === verseNum);

            if (verse) {
              if (!groupedByColor[color]) {
                groupedByColor[color] = [];
              }
              groupedByColor[color].push({
                ...verse,
                chapter: chapterNum,
                color: color,
                fullChapter: chapter, // Pass the full chapter object for navigation
              });
            }
          });
          
          setGroupedHighlights(groupedByColor);
          
          // Set the first available color as the default selection
          const firstColor = Object.keys(groupedByColor)[0];
          if(firstColor) {
            setSelectedColor(firstColor);
          } else {
            setSelectedColor(null);
          }

        } catch (e) {
          console.error("Failed to load highlights for library.", e);
        }
      };

      loadHighlights();
    }, [])
  );

  const handleVersePress = (item) => {
    navigation.navigate('Psalms', {
      screen: 'Verses',
      params: { chapter: item.fullChapter },
    });
  };

  const renderColorPill = ({ item }) => {
  const isActive = item === selectedColor;
  const label = COLOR_LABELS[item] || item;
  return (
    <TouchableOpacity onPress={() => setSelectedColor(item)}>
      <View style={[styles.pillContainer, isActive && styles.activePillContainer]}>
        <Text style={[styles.pillText, isActive && styles.activePillText]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
  
  const renderVerseItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVersePress(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>"{item.text}"</Text>
        <Text style={styles.itemReference}>
          Psalm {item.chapter}:{item.verse}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const availableColors = Object.keys(groupedHighlights);

  return (
    <SafeAreaView style={styles.container}>
      {availableColors.length > 0 ? (
        <>
          <View>
            <FlatList
              data={availableColors}
              renderItem={renderColorPill}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsListContainer}
            />
          </View>
          <FlatList
            data={groupedHighlights[selectedColor] || []}
            renderItem={renderVerseItem}
            keyExtractor={(item, index) => `${item.chapter}:${item.verse}:${index}`}
            contentContainerStyle={styles.verseListContainer}
           />
        </>
      ) : (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No highlights yet.</Text>
            <Text style={styles.emptySubText}>Go to the Psalms tab to select and highlight verses.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181919',
  },
  pillsListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pillContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#2C2C2C',
  },
  activePillContainer: {
    backgroundColor: '#EAEAEA',
  },
  pillText: {
    color: '#EAEAEA',
    fontWeight: 'bold',
  },
  activePillText: {
    color: '#121212',
  },
  verseListContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#1C1E1E',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'FKGroteskNeueTrial-Regular',
    lineHeight: 24,
    marginBottom: 8,
    color: '#B9B9B1',
  },
  itemReference: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#A9A9A9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptySubText: {
    fontSize: 14,
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 8,
  }
});

export default LibraryScreen;