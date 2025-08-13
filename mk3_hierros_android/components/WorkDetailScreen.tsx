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
import { Work } from '../types/work';
import { COLORS } from '../assets/constants/colors';
import { workService } from '../services/api';

interface WorkDetailScreenProps {
  workId?: string;
  initialWork?: Work;
  onWorkUpdated?: () => void; // Cambiar a función sin parámetros
  onClose: () => void;
}

export default function WorkDetailScreen({
  workId,
  initialWork,
  onWorkUpdated,
  onClose
}: WorkDetailScreenProps) {
  const [work, setWork] = useState<Work | null>(initialWork || null);
  const [loading, setLoading] = useState(!initialWork);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image: '',
    measures: '',
    priority: '',
    price: 0,
    finalPrice: 0,
  });

  // Opciones de prioridad y estado como strings en español
  const priorityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];
  const statusOptions = ['Cotización', 'Pendiente Aprobación', 'Compra Materiales', 'En curso', 'Finalizado', 'Cancelado'];

  useEffect(() => {
    if (workId && !initialWork) {
      loadWorkDetails();
    } else if (initialWork) {
      initializeEditForm(initialWork);
    }
  }, [workId, initialWork]);

  const loadWorkDetails = async () => {
    if (!workId) return;

    try {
      setLoading(true);
      const workDetails = await workService.getWorkById(workId);
      setWork(workDetails);
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
      image: workData.image,
      measures: workData.measures,
      priority: workData.priority,
      price: workData.price,
      finalPrice: workData.finalPrice,
    });
  };

  const handleSave = async () => {
    if (!work) return;

    try {
      setUpdating(true);
      await workService.updateWorkById(work.id, editForm);

      setIsEditing(false);
      onClose(); // Cerrar el modal
      onWorkUpdated?.(); // Disparar recarga en el padre
      Alert.alert('Éxito', 'Trabajo actualizado correctamente');
    } catch (error) {
      console.error('Error updating work:', error);
      Alert.alert('Error', 'No se pudo actualizar el trabajo');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (work) {
      initializeEditForm(work);
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return COLORS.SUCCESS;
      case 'En curso':
        return COLORS.ACCENT;
      case 'Pendiente Aprobación':
        return COLORS.WARNING;
      case 'Cotización':
        return '#3498DB';
      case 'Compra Materiales':
        return '#9B59B6';
      case 'Cancelado':
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_TERTIARY;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return COLORS.ERROR;
      case 'Alta':
        return COLORS.WARNING;
      case 'Media':
        return COLORS.ACCENT;
      case 'Baja':
        return COLORS.SUCCESS;
      default:
        return COLORS.TEXT_TERTIARY;
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

  if (loading) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </Modal>
    );
  }

  if (!work) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el trabajo</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
          {/* Título - EDITABLE */}
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

          {/* Descripción - EDITABLE */}
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

          {/* Imagen - EDITABLE */}
          <View style={styles.section}>
            <Text style={styles.label}>Imagen</Text>
            {isEditing ? (
              <View>
                <TextInput
                  style={styles.input}
                  value={editForm.image}
                  onChangeText={(text) => setEditForm({...editForm, image: text})}
                  placeholder="URL de la imagen"
                />
                {editForm.image && (
                  <Image
                    source={{ uri: editForm.image }}
                    style={styles.imagePreview}
                    onError={() => console.log('Error loading image')}
                  />
                )}
              </View>
            ) : (
              <View>
                {work.image && (
                  <Image
                    source={{ uri: work.image }}
                    style={styles.image}
                    onError={() => console.log('Error loading image')}
                  />
                )}
                <Text style={styles.imageUrl}>{work.image || 'Sin imagen'}</Text>
              </View>
            )}
          </View>

          {/* Medidas - EDITABLE */}
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

          {/* Prioridad - EDITABLE */}
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

          {/* Precios - EDITABLE */}
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
              disabled={updating}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  readOnlySection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  imageUrl: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontStyle: 'italic',
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
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
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