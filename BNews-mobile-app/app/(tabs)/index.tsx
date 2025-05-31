import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, useColorScheme, Alert, FlatList, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { ENV } from '../../env';

const categories = [
  { id: 'general', name: 'General' },
  { id: 'business', name: 'Business' },
  { id: 'technology', name: 'Technology' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' }
];

const TabOneScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [news, setNews] = useState<any[]>([]);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  // Navigation to contact screen
  const navigateToContact = () => {
    router.push('/(tabs)/modal');
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_URL = `https://newsapi.org/v2/everything?q=${selectedCategory}&sortBy=publishedAt&language=en&apiKey=${ENV.NEWS_API_KEY}`;
      console.log('Starting news fetch for category:', selectedCategory);
      const response = await fetch(API_URL);
      console.log('Response received:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data fetched successfully, status:', data.status);

      if (data.status === 'ok') {
        setNews(data.articles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      Alert.alert(
        'Error',
        `Failed to load news: ${errorMessage}. Please check your internet connection and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openNewsLink = (url: string) => {
    setWebViewUrl(url);
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
        isDarkMode && styles.darkModeCategoryItem,
        selectedCategory === item.id && isDarkMode && styles.darkModeSelectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
          isDarkMode && styles.darkModeCategoryText,
          selectedCategory === item.id && isDarkMode && styles.darkModeSelectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkModeContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
        <View style={styles.headerContainer}>
          <View>
            <TouchableOpacity onPress={() => setSelectedCategory('general')}>
              <Text style={[styles.appTitle, isDarkMode && styles.darkModeTitle]}>Insight Daily</Text>
            </TouchableOpacity>
            <Text style={[styles.title, isDarkMode && styles.darkModeTitle]}>Latest News</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={navigateToContact}
          >
            <FontAwesome5 
              name="address-card" 
              size={24} 
              color={isDarkMode ? "#fff" : "#007AFF"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
        </View>

        {isLoading ? (
          <View style={[styles.container, styles.centerContent]}>
            <Text style={[styles.loadingText, isDarkMode && styles.darkModeText]}>Loading news...</Text>
          </View>
        ) : error ? (
          <View style={[styles.container, styles.centerContent]}>
            <Text style={[styles.errorText, isDarkMode && styles.darkModeText]}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {news.map((article, index) => (
              <TouchableOpacity
                key={index}
                style={styles.articleContainer}
                onPress={() => openNewsLink(article.url)}
              >
                <Image style={styles.articleImage} source={{ uri: article.urlToImage }} />
                <View style={styles.textContainer}>
                  <Text style={[styles.articleTitle, isDarkMode && styles.darkModeText]}>
                    {article.title}
                  </Text>
                  <Text style={[styles.articleDescription, isDarkMode && styles.darkModeText]}>
                    {article.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Modal visible={webViewVisible} animationType="slide">
          <View style={{ flex: 1 }}>
            <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
            <TouchableOpacity onPress={closeWebView} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contactButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  articleContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textContainer: {
    padding: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 16,
    color: '#555',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
  
  darkModeContainer: {
    backgroundColor: '#000',
  },
  darkModeTitle: {
    color: '#fff',
  },
  darkModeText: {
    color: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryList: {
    flexGrow: 0,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  darkModeCategoryItem: {
    backgroundColor: '#333',
  },
  darkModeSelectedCategory: {
    backgroundColor: '#0A84FF',
  },
  darkModeCategoryText: {
    color: '#fff',
  },
  darkModeSelectedCategoryText: {
    color: '#fff',
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
    textDecorationLine: 'none',
  },
});

export default TabOneScreen;
