import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Animated } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Navigate after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToMain();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const navigateToMain = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      
      try {
        // Fade out animation before navigation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          // Navigate after fade out completes
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 100);
        });
      } catch (error: unknown) {
        console.error('Navigation error:', error);
        setError('Navigation failed. Please restart the app.');
      }
    }
  };

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image 
          source={require('../../assets/videos/sscreenVideo.gif')} 
          style={styles.gifBackground}
          resizeMode="cover"
        />
        <View style={styles.textOverlay}>
          <Text style={styles.title}>Insight Daily</Text>
          <Text style={styles.subtitle}>Your Daily News Companion</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  gifBackground: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});
