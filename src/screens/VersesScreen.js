import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { HIGHLIGHT_COLORS } from '../constants/highlightColors';
const DARK_THEME = {
  background: '#181919',
  card: '#1C1E1E',
  text: '#000000',
};

const HIGHLIGHT_LABEL_COLORS = {
  Red: '#E00000', // changed only for label
  Blue: '#0092CC',
  Green: '#00A380',
  Orange: '#A37500',
};
const HIGHLIGHT_BORDER_COLORS = {
  Red: '#521800',
  Blue: '#02356C',
  Green: '#00523C',
  Orange: '#524300',
};

const VersesScreen = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [highlights, setHighlights] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);

  const getHighlightKey = (chapterNum, verseNum) => `psalm-${chapterNum}:${verseNum}`;

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const highlightKeys = keys.filter(key => key.startsWith(`psalm-${chapter.chapter}:`));
        const storedHighlights = await AsyncStorage.multiGet(highlightKeys);
        const highlightsObj = storedHighlights.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        setHighlights(highlightsObj);
      } catch (e) {
        console.error("Failed to load highlights.", e);
      }
    };
    loadHighlights();
  }, [chapter.chapter]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Psalm ${chapter.chapter}`,
    });
  }, [navigation, chapter]);

  const handleVersePress = (verse) => {
    setSelectedVerse(verse);
    setModalVisible(true);
  };

  const handleHighlight = async (color) => {
    if (!selectedVerse) return;
    const key = getHighlightKey(chapter.chapter, selectedVerse.verse);

    try {
      if (color) {
        await AsyncStorage.setItem(key, color);
        setHighlights(prev => ({ ...prev, [key]: color }));
      } else {
        await AsyncStorage.removeItem(key);
        setHighlights(prev => {
          const newHighlights = { ...prev };
          delete newHighlights[key];
          return newHighlights;
        });
      }
    } catch (e) {
      console.error("Failed to save or remove highlight.", e);
    } finally {
      setModalVisible(false);
      setSelectedVerse(null);
    }
  };

  const renderItem = ({ item }) => {
    const key = getHighlightKey(chapter.chapter, item.verse);
    // Use the highlight color or the dark theme card color as the background
    const backgroundColor = highlights[key] || DARK_THEME.card;

    return (
      <TouchableOpacity onPress={() => handleVersePress(item)}>
        <View style={[styles.itemContainer, { backgroundColor }]}>
          <Text style={styles.itemText}>
            <Text style={styles.verseNumber}>{item.verse}. </Text>
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chapter.verses}
        renderItem={renderItem}
        keyExtractor={(item) => item.verse.toString()}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: '#E5E5E2', marginBottom: 24 }]}>Highlight Verse</Text>
          <View style={{ marginBottom: 4 }}>
            <FlatList
              data={HIGHLIGHT_COLORS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={({ hex }) => hex}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item: { hex, label } }) => (
                <TouchableOpacity
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: hex,
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: HIGHLIGHT_BORDER_COLORS[label] || '#fff',
                      minWidth: 80,
                      height: undefined,
                      minHeight: 0,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => handleHighlight(hex)}
                >
                  <Text style={[
                    styles.colorButtonText,
                    {
                      color: HIGHLIGHT_LABEL_COLORS[label] || '#fff',
                      fontFamily: 'FKGroteskNeueTrial-Regular',
                      fontSize: 14,
                      fontWeight: '400', // ensure not bold
                    },
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          {/* Only show Remove Highlight if the selected verse is already highlighted */}
          {selectedVerse && highlights[getHighlightKey(chapter.chapter, selectedVerse.verse)] && (
            <>
              <View style={[styles.separator, { marginTop: 8, marginBottom: 12 }]} />
              <Button title="Remove Highlight" color='#B9B9B1' onPress={() => handleHighlight(null)} />
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181919',
  },
  itemContainer: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  itemText: {
    fontSize: 17,
    fontFamily: 'FKGroteskNeueTrial-Regular',
    lineHeight: 24,
    color: '#B9B9B1',
  },
  verseNumber: {
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#181919',
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'FKGroteskNeueTrial',
    marginBottom: 12,
    textAlign: 'center',
    color: '#B9B9B1',
  },
  colorButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  colorButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#555555',
    marginVertical: 10,
  },
});

export default VersesScreen;