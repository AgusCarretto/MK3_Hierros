import { FlatList, View, StyleSheet } from 'react-native';
import { Category } from '../types/category';
import CategoryCard from './CategoryCard';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const handleCategoryPress = (category: Category) => {
    console.log('Categoría seleccionada:', category.name);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => handleCategoryPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
});