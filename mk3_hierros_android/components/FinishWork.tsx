import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { COLORS } from '../assets/constants/colors';
import { workService, categoryService } from '../services/api';
import { Work } from '../types/work';
import { Category } from '../types/category';

interface FinishWorkProps {
  work: Work;
  visible: boolean;
  onClose: () => void;
  onWorkFinished: () => void;
}

export default function FinishWork({
  work,
  visible,
  onClose,
  onWorkFinished
}: FinishWorkProps) {
  const [finishing, setFinishing] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    marketingTitle: '',
    marketingDescription: '',
    images: [''],
    categoryId: 0,
  });

  useEffect(() => {
    if (visible) {
      loadCategories();
      // Pre-llenar con datos del trabajo actual
      setForm(prev => ({
        ...prev,
        marketingTitle: work.title,
        marketingDescription: work.description,
        images: work.image ? [work.image] : [''],
      }));
    }
  }, [visible, work]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleFinishWork = async () => {
    // Validaciones
    if (!form.marketingTitle.trim()) {
      Alert.alert('Error', 'El título para web es obligatorio');
      return;
    }
    if (!form.marketingDescription.trim()) {
      Alert.alert('Error', 'La descripción para web es obligatoria');
      return;
    }
    if (form.categoryId === 0) {
      Alert.alert('Error', 'Debes seleccionar una categoría');
      return;
    }
    if (!form.images.some(img => img.trim())) {
      Alert.alert('Error', 'Debes agregar al menos una imagen');
      return;
    }

    try {
      setFinishing(true);

      // Filtrar imágenes vacías
      const validImages = form.images.filter(img => img.trim());

      await workService.updateWorkById(work.id, {
        status: 'Finalizado',
        marketingTitle: form.marketingTitle,
        marketingDescription: form.marketingDescription,
        marketingImages: validImages,
        categoryId: form.categoryId,
      });

      Alert.alert(
        'Trabajo Finalizado',
        'El trabajo ha sido marcado como finalizado y estará disponible para mostrar en la web.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onWorkFinished();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error finishing work:', error);
      Alert.alert('Error', 'No se pudo finalizar el trabajo');
    } finally {
      setFinishing(false);
    }
  };

  const addImageField = () => {
    if (form.images.length < 5) { // Límite de 5 imágenes
      setForm(prev => ({
        ...prev,
        images: [...prev.images, '']
      }));
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const removeImage = (index: number) => {
    if (form.images.length > 1) {
      const newImages = form.images.filter((_, i) => i !== index);
      setForm(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const selectedCategory = categories.find(cat => cat.id === form.categoryId);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finalizar Trabajo</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Información del trabajo */}
          <View style={styles.workInfo}>
            <Text style={styles.workTitle}>{work.title}</Text>
            <Text style={styles.workSubtitle}>
              Este trabajo se mostrará en la web promocional
            </Text>
          </View>

          {/* Título para marketing */}
          <View style={styles.section}>
            <Text style={styles.label}>Título para Web *</Text>
            <Text style={styles.hint}>
              Título atractivo que se mostrará a los potenciales clientes
            </Text>
            <TextInput
              style={styles.input}
              value={form.marketingTitle}
              onChangeText={(text) => setForm({...form, marketingTitle: text})}
              placeholder="Ej: Portón de Hierro Forjado Artesanal"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Descripción para marketing */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción para Web *</Text>
            <Text style={styles.hint}>
              Descripción detallada y profesional para mostrar en la web
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.marketingDescription}
              onChangeText={(text) => setForm({...form, marketingDescription: text})}
              placeholder="Describe el trabajo realizado, materiales utilizados, técnicas aplicadas..."
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Categoría */}
          <View style={styles.section}>
            <Text style={styles.label}>Categoría *</Text>
            <Text style={styles.hint}>
              Categoría para organizar el trabajo en la web
            </Text>
            {loadingCategories ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.ACCENT} />
                <Text style={styles.loadingText}>Cargando categorías...</Text>
              </View>
            ) : (
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      form.categoryId === category.id && styles.categoryOptionSelected
                    ]}
                    onPress={() => setForm({...form, categoryId: category.id})}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      form.categoryId === category.id && styles.categoryOptionTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Imágenes */}
          <View style={styles.section}>
            <Text style={styles.label}>Imágenes para Web *</Text>
            <Text style={styles.hint}>
              Fotos finales del trabajo que se mostrarán en la galería web
            </Text>

            {form.images.map((image, index) => (
              <View key={index} style={styles.imageInputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={image}
                  onChangeText={(text) => updateImage(index, text)}
                  placeholder={`URL de imagen ${index + 1}`}
                  placeholderTextColor={COLORS.TEXT_TERTIARY}
                />
                {form.images.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Preview de imágenes */}
            <View style={styles.imagePreviewContainer}>
              {form.images.filter(img => img.trim()).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  onError={() => console.log('Error loading preview image')}
                />
              ))}
            </View>

            {form.images.length < 5 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={addImageField}
              >
                <Text style={styles.addImageText}>+ Agregar otra imagen</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Preview de cómo se verá */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview Web:</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewCardTitle}>
                {form.marketingTitle || 'Título para web...'}
              </Text>
              <Text style={styles.previewCardCategory}>
                {selectedCategory?.name || 'Seleccionar categoría...'}
              </Text>
              <Text style={styles.previewCardDescription} numberOfLines={3}>
                {form.marketingDescription || 'Descripción para web...'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={finishing}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.finishButton]}
            onPress={handleFinishWork}
            disabled={finishing}
          >
            {finishing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Finalizar Trabajo</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  workInfo: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SUCCESS,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  workSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: COLORS.TEXT_SECONDARY,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
  },
  categoryOptionText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  categoryOptionTextSelected: {
    color: COLORS.BACKGROUND_PRIMARY,
    fontWeight: '600',
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  removeImageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ERROR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  addImageButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER_COLOR,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addImageText: {
    color: COLORS.ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  previewSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  previewCardCategory: {
    fontSize: 12,
    color: COLORS.ACCENT,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  previewCardDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.TEXT_TERTIARY,
  },
  finishButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});