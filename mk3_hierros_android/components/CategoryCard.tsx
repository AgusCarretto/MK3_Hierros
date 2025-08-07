import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '../types/category';
import { COLORS } from '../assets/colors/colors';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.name}>{category.name}</Text>
        {category.description && (
          <Text style={styles.description}>{category.description}</Text>
        )}
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Ver productos</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontStyle: 'italic',
  },
});