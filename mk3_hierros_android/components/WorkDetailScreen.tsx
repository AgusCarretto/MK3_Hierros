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
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Work, WorkImage } from '../types/work';
import { COLORS } from '../assets/constants/colors';
import { workService } from '../services/api';

interface WorkDetailScreenProps {
  workId?: string;
  initialWork?: Work;
  onWorkUpdated?: () => void;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imageSize = (screenWidth - 64) / 3; // 3 imágenes por fila con padding

export default function WorkDetailScreen({
  workId,
  initialWork,
  onWorkUpdated,
  onClose
}: WorkDetailScreenProps) {
  const [work, setWork] = useState<Work | null>(initialWork || null);
  const [workImages, setWorkImages] = useState<WorkImage[]>([]);
  const [loading, setLoading] = useState(!initialWork);
  const [updating, setUpdating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Estados para el visor de imágenes
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<(WorkImage | string)[]>([]);

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    measures: '',
    priority: '',
    price: 0,
    finalPrice: 0,
  });

  const priorityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];
  const statusOptions = ['Cotización', 'Pendiente Aprobación', 'Compra Materiales', 'En curso', 'Finalizado', 'Cancelado'];

  useEffect(() => {
    if (workId && !initialWork) {
      loadWorkDetails();
    } else if (initialWork) {
      initializeEditForm(initialWork);
      setWorkImages(initialWork.images || []);
    }
  }, [workId, initialWork]);

  // Actualizar la lista completa de imágenes cuando cambien las imágenes guardadas o seleccionadas
  useEffect(() => {
    setAllImages([...workImages, ...selectedImages]);
  }, [workImages, selectedImages]);

  const loadWorkDetails = async () => {
    if (!workId) return;

    try {
      setLoading(true);
      const workDetails = await workService.getWorkById(workId);
      setWork(workDetails);
      setWorkImages(workDetails.images || []);
      initializeEditForm(workDetails);
    } catch (error) {
      console.error('Error loading work details:', error);
      Alert.alert('Error', 'No se pudo cargar el detalle del trabajo');
    } finally {
      setLoading(false);
    }
  };

  const initializeEditForm = (workData: Work) => {
    setEditForm({
      title: workData.title,
      description: workData.description,
      measures: workData.measures,
      priority: workData.priority,
      price: workData.price,
      finalPrice: workData.finalPrice,
    });
  };

  // Función para abrir el visor de imágenes
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerVisible(true);
  };

  // Función para cerrar el visor de imágenes
  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  // Función para navegar a la imagen anterior
  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  // Función para navegar a la siguiente imagen
  const goToNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Función para obtener la URL de una imagen
  const getImageUrl = (item: WorkImage | string, index: number): string => {
    if (typeof item === 'string') {
      return item; // Es una imagen seleccionada (URI local)
    } else {
      // Validar que work existe antes de usarlo
      if (!work) {
        console.warn('Work is null when trying to get image URL');
        return ''; // O una imagen placeholder
      }
      return workService.getWorkImageUrl(work.id, item.id); // Es una imagen guardada
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

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const deleteImage = async (imageId: string) => {
    Alert.alert(
      'Eliminar Imagen',
      '¿Estás seguro de que quieres eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await workService.deleteWorkImage(imageId);
              setWorkImages(prev => prev.filter(img => img.id !== imageId));
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la imagen');
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!work) return;

    try {
      setUpdating(true);

      await workService.updateWorkById(work.id, editForm);

      if (selectedImages.length > 0) {
        setUploadingImages(true);
        await workService.uploadWorkImages(work.id, selectedImages);
        setSelectedImages([]);

        const updatedImages = await workService.getWorkImages(work.id);
        setWorkImages(updatedImages);
      }

      setIsEditing(false);
      onClose();
      onWorkUpdated?.();
      Alert.alert('Éxito', 'Trabajo actualizado correctamente');
    } catch (error) {
      console.error('Error updating work:', error);
      Alert.alert('Error', 'No se pudo actualizar el trabajo');
    } finally {
      setUpdating(false);
      setUploadingImages(false);
    }
  };

  const handleCancel = () => {
    if (work) {
      initializeEditForm(work);
    }
    setSelectedImages([]);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado': return COLORS.SUCCESS;
      case 'En curso': return COLORS.ACCENT;
      case 'Pendiente Aprobación': return COLORS.WARNING;
      case 'Cotización': return '#3498DB';
      case 'Compra Materiales': return '#9B59B6';
      case 'Cancelado': return COLORS.ERROR;
      default: return COLORS.TEXT_TERTIARY;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return COLORS.ERROR;
      case 'Alta': return COLORS.WARNING;
      case 'Media': return COLORS.ACCENT;
      case 'Baja': return COLORS.SUCCESS;
      default: return COLORS.TEXT_TERTIARY;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Componente para renderizar imagen de la galería
  const renderWorkImage = ({ item, index }: { item: WorkImage; index: number }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => openImageViewer(index)}>
        <Image
          source={{ uri: workService.getWorkImageUrl(work!.id, item.id) }}
          style={styles.galleryImage}
          onError={() => console.log('Error loading image:', item.id)}
        />
      </TouchableOpacity>
      {isEditing && (
        <TouchableOpacity
          style={styles.deleteImageButton}
          onPress={() => deleteImage(item.id)}
        >
          <Text style={styles.deleteImageText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Componente para renderizar imagen seleccionada
  const renderSelectedImage = ({ item, index }: { item: string; index: number }) => {
    const globalIndex = workImages.length + index;
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => openImageViewer(globalIndex)}>
          <Image
            source={{ uri: item }}
            style={[styles.galleryImage, styles.selectedImageBorder]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteImageButton}
          onPress={() => removeSelectedImage(index)}
        >
          <Text style={styles.deleteImageText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Modal del visor de imágenes
  const ImageViewerModal = () => {
    // No mostrar el modal si no hay trabajo cargado o no hay imágenes
    if (!work || allImages.length === 0 || selectedImageIndex >= allImages.length) {
      return null;
    }

    return (
      <Modal
        visible={isImageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <SafeAreaView style={styles.imageViewerContainer}>
          {/* Header del visor */}
          <View style={styles.imageViewerHeader}>
            <TouchableOpacity onPress={closeImageViewer} style={styles.closeViewerButton}>
              <Text style={styles.closeViewerText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.imageCounter}>
              {selectedImageIndex + 1} de {allImages.length}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Imagen principal */}
          <View style={styles.imageViewerContent}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToPreviousImage}
              disabled={allImages.length <= 1}
            >
              <Text style={[styles.navButtonText, allImages.length <= 1 && styles.navButtonDisabled]}>
                ‹
              </Text>
            </TouchableOpacity>

            <Image
              source={{ uri: getImageUrl(allImages[selectedImageIndex], selectedImageIndex) }}
              style={styles.fullScreenImage}
              resizeMode="contain"
              onError={() => console.log('Error loading full screen image')}
            />

            <TouchableOpacity
              style={styles.navButton}
              onPress={goToNextImage}
              disabled={allImages.length <= 1}
            >
              <Text style={[styles.navButtonText, allImages.length <= 1 && styles.navButtonDisabled]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Thumbnails en la parte inferior */}
          {allImages.length > 1 && (
            <View style={styles.thumbnailContainer}>
              <FlatList
                data={allImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `thumb-${index}`}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.selectedThumbnail
                    ]}
                    onPress={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      source={{ uri: getImageUrl(item, index) }}
                      style={styles.thumbnailImage}
                      onError={() => console.log('Error loading thumbnail')}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

 if (loading) {
   return (
     <View style={{ flex: 1 }}>
       <Modal visible={true} animationType="slide">
         <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color={COLORS.PRIMARY} />
           <Text style={styles.loadingText}>Cargando detalles...</Text>
         </View>
       </Modal>
     </View>
   );
 }

 if (!work) {
   return (
     <View style={{ flex: 1 }}>
       <Modal visible={true} animationType="slide">
         <View style={styles.errorContainer}>
           <Text style={styles.errorText}>No se pudo cargar el trabajo</Text>
           <TouchableOpacity style={styles.button} onPress={onClose}>
             <Text style={styles.buttonText}>Volver</Text>
           </TouchableOpacity>
         </View>
       </Modal>
     </View>
   );
 }

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Trabajo' : 'Detalle del Trabajo'}
          </Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.label}>Título</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editForm.title}
                onChangeText={(text) => setEditForm({...editForm, title: text})}
                placeholder="Título del trabajo"
              />
            ) : (
              <Text style={styles.value}>{work.title}</Text>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.description}
                onChangeText={(text) => setEditForm({...editForm, description: text})}
                placeholder="Descripción del trabajo"
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.value}>{work.description}</Text>
            )}
          </View>

          {/* GALERÍA DE IMÁGENES */}
          <View style={styles.section}>
            <View style={styles.imageSectionHeader}>
              <Text style={styles.label}>
                Imágenes ({workImages.length + selectedImages.length})
              </Text>
              {isEditing && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={showImageOptions}
                  disabled={uploadingImages}
                >
                  <Text style={styles.addImageButtonText}>
                    {uploadingImages ? 'Subiendo...' : '+ Agregar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Imágenes guardadas */}
            {workImages.length > 0 && (
              <FlatList
                data={workImages}
                renderItem={renderWorkImage}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                style={styles.imageGrid}
              />
            )}

            {/* Imágenes seleccionadas (nuevas) */}
            {selectedImages.length > 0 && (
              <View>
                <Text style={styles.sectionSubtitle}>Nuevas imágenes:</Text>
                <FlatList
                  data={selectedImages}
                  renderItem={renderSelectedImage}
                  keyExtractor={(item, index) => `selected-${index}`}
                  numColumns={3}
                  scrollEnabled={false}
                  style={styles.imageGrid}
                />
              </View>
            )}

            {/* Estado de subida */}
            {uploadingImages && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
                <Text style={styles.uploadingText}>Subiendo imágenes...</Text>
              </View>
            )}

            {/* Mensaje cuando no hay imágenes */}
            {workImages.length === 0 && selectedImages.length === 0 && (
              <View style={styles.noImagesContainer}>
                <Text style={styles.noImagesText}>Sin imágenes</Text>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={showImageOptions}
                  >
                    <Text style={styles.addImageButtonText}>Agregar Primera Imagen</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Medidas */}
          <View style={styles.section}>
            <Text style={styles.label}>Medidas</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editForm.measures}
                onChangeText={(text) => setEditForm({...editForm, measures: text})}
                placeholder="Medidas del trabajo"
              />
            ) : (
              <Text style={styles.value}>{work.measures}</Text>
            )}
          </View>

          {/* Prioridad */}
          <View style={styles.section}>
            <Text style={styles.label}>Prioridad</Text>
            {isEditing ? (
              <View style={styles.pickerContainer}>
                {priorityOptions.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerOption,
                      editForm.priority === priority && styles.pickerOptionSelected
                    ]}
                    onPress={() => setEditForm({...editForm, priority})}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      editForm.priority === priority && styles.pickerOptionTextSelected
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.priorityContainer}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(work.priority) }]} />
                <Text style={styles.priorityText}>{work.priority}</Text>
              </View>
            )}
          </View>

          {/* Precios */}
          <View style={styles.pricesContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.label}>Precio Base</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.price.toString()}
                  onChangeText={(text) => setEditForm({
                    ...editForm,
                    price: parseInt(text.replace(/[^0-9]/g, '')) || 0
                  })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              ) : (
                <Text style={styles.priceValue}>{formatPrice(work.price)}</Text>
              )}
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.label}>Precio Final</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.finalPrice.toString()}
                  onChangeText={(text) => setEditForm({
                    ...editForm,
                    finalPrice: parseInt(text.replace(/[^0-9]/g, '')) || 0
                  })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              ) : (
                <Text style={styles.priceValue}>{formatPrice(work.finalPrice)}</Text>
              )}
            </View>
          </View>

          {/* Información NO EDITABLE */}
          <View style={styles.readOnlySection}>
            <Text style={styles.sectionTitle}>Información del Sistema</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Categoría</Text>
              <Text style={styles.value}>{work.category}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Estado</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(work.status) }]}>
                <Text style={styles.statusText}>{work.status}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha de Finalización</Text>
              <Text style={styles.value}>{formatDate(work.endDate)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha de Creación</Text>
              <Text style={styles.value}>{formatDate(work.createAt)}</Text>
            </View>
          </View>
        </ScrollView>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={updating || uploadingImages}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={updating || uploadingImages}
            >
              {updating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Modal del visor de imágenes */}
        <ImageViewerModal />
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
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginVertical: 8,
  },
  readOnlySection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    flex: 2,
  },
  priceValue: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // ESTILOS PARA MÚLTIPLES IMÁGENES
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  selectedImageBorder: {
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
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
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  uploadingText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },

  // ESTILOS PARA EL VISOR DE IMÁGENES
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeViewerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeViewerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  imageViewerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  fullScreenImage: {
    flex: 1,
    width: screenWidth - 100,
    height: screenHeight - 200,
  },
  thumbnailContainer: {
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  thumbnail: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: COLORS.ACCENT,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },

  // OTROS ESTILOS EXISTENTES
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  pickerOptionText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  pickerOptionTextSelected: {
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  pricesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginVertical: 12,
  },
  priceSection: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 24,
    textAlign: 'center',
  },
});