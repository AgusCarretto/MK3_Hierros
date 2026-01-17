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
  FlatList,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

const { width: screenWidth } = Dimensions.get('window');
const imageSize = (screenWidth - 64) / 3; // 3 imágenes por fila con padding

export default function FinishWork({
  work,
  visible,
  onClose,
  onWorkFinished
}: FinishWorkProps) {
  const [finishing, setFinishing] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    marketingTitle: '',
    marketingDescription: '',
    categoryId: 0,
  });

  useEffect(() => {
    if (visible) {
      loadCategories();
      // Pre-llenar con datos del trabajo actual
      setForm({
        marketingTitle: work.title,
        marketingDescription: work.description,
        categoryId: 0,
      });
  // ✅ En lugar de limpiar, pre-cargamos las imágenes actuales
      if (work.images && work.images.length > 0) {
        const currentImages = work.images.map(img =>
          workService.getWorkImageUrl(work.id, img.id)
        );
        setSelectedImages(currentImages);
      } else {
        setSelectedImages([]);
      }
      // Limpiar imágenes seleccionadas - las imágenes para web se eligen nuevas
      //setSelectedImages([]);
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

  const selectImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...uris]);
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para usar la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Agregar Imágenes',
      'Elige cómo quieres agregar imágenes',
      [
        { text: 'Cámara', onPress: takePhoto },
        { text: 'Galería', onPress: selectImages },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos una imagen');
      return;
    }

    try {
        setFinishing(true);

        // 1. Identificar imágenes a borrar del servidor
        const currentServerImageUrls = work.images.map(img => workService.getWorkImageUrl(work.id, img.id));
        const imagesToDelete = work.images.filter(img =>
          !selectedImages.includes(workService.getWorkImageUrl(work.id, img.id))
        );

        for (const img of imagesToDelete) {
          await workService.deleteWorkImage(img.id);
        }

        // 2. Identificar solo las fotos NUEVAS (las que no tienen http)
        const newImagesToUpload = selectedImages.filter(uri => !uri.startsWith('http'));

        // 3. Actualizar datos de texto
        await workService.updateWorkById(work.id, {
          status: 'Finalizado',
          marketingTitle: form.marketingTitle,
          marketingDescription: form.marketingDescription,
          categoryId: form.categoryId,
        });

        // 4. Subir solo las nuevas
        if (newImagesToUpload.length > 0) {
          await workService.uploadWorkImages(work.id, newImagesToUpload);
        }

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

  const selectedCategory = categories.find(cat => cat.id === form.categoryId);

  const renderSelectedImage = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.galleryImage}
      />
      <TouchableOpacity
        style={styles.deleteImageButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.deleteImageText}>×</Text>
      </TouchableOpacity>
    </View>
  );

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

          {/* Imágenes para Web */}
          <View style={styles.section}>
            <View style={styles.imageSectionHeader}>
              <View>
                <Text style={styles.label}>Imágenes para Mostrar en Web *</Text>
                <Text style={styles.hint}>
                  Selecciona las fotos finales que se mostrarán a los clientes (máximo 5)
                </Text>
              </View>
              {selectedImages.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={showImageOptions}
                  disabled={finishing}
                >
                  <Text style={styles.addImageButtonText}>+ Agregar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Galería de imágenes seleccionadas */}
            {selectedImages.length > 0 ? (
              <FlatList
                data={selectedImages}
                renderItem={renderSelectedImage}
                keyExtractor={(item, index) => `image-${index}`}
                numColumns={3}
                scrollEnabled={false}
                style={styles.imageGrid}
              />
            ) : (
              <View style={styles.noImagesContainer}>
                <Text style={styles.noImagesText}>
                  Selecciona las fotos finales para mostrar en la web
                </Text>
                <TouchableOpacity
                  style={styles.addFirstImageButton}
                  onPress={showImageOptions}
                >
                  <Text style={styles.addImageButtonText}>Seleccionar Fotos para Web</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Preview de cómo se verá */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview Web:</Text>
            <View style={styles.previewCard}>
              {selectedImages.length > 0 && (
                <Image
                  source={{ uri: selectedImages[0] }}
                  style={styles.previewImage}
                />
              )}
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
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  imageGrid: {
    marginVertical: 8,
  },
  imageContainer: {
    position: 'relative',
    margin: 4,
  },
  galleryImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  addImageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.ACCENT,
  },
  addImageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  noImagesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    borderWidth: 2,
    borderColor: COLORS.BORDER_COLOR,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  noImagesText: {
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
    marginBottom: 16,
  },
  addFirstImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.ACCENT,
  },
  existingImagesContainer: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  existingImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
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
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
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