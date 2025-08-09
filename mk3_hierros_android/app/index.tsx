import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import WorkList from '../components/WorkList';
import { workService } from '../services/api';
import { Work } from '../types/work';
import { COLORS } from '../assets/constants/colors';

export default function HomeScreen() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const worksData = await workService.getWorks();
      console.log(worksData)
      setWorks(worksData);
      console.log('✅ Trabajos cargados:', worksData.length);
    } catch (error) {
      console.error('❌ Error loading works:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando trabajos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_PRIMARY} />

      <View style={styles.header}>
        <Text style={styles.title}>MK3 Hierros</Text>
        <Text style={styles.subtitle}>
          {works.length} trabajo{works.length !== 1 ? 's' : ''} en sistema
        </Text>
      </View>

      <WorkList works={works} />
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
    paddingTop: 60,
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