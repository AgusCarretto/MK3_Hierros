import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import CategoryList from '../components/CategoryList';
import { categoryService } from '../services/api';
import { Category } from '../types/category';
import { COLORS } from '../assets/colors/colors';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_PRIMARY} />

      <View style={styles.header}>
        <Text style={styles.title}>MK3 Hierros</Text>
        <Text style={styles.subtitle}>Categorías de productos</Text>
      </View>

      <CategoryList categories={categories} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  header: {
    paddingTop: 60, // Para el StatusBar
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});