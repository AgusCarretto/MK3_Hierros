import React, { useState } from 'react';
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
import { workService } from '../services/api';

interface CreateNewWorkProps {
  onWorkCreated?: () => void;
  onClose: () => void;
}

export default function CreateNewWork({
  onWorkCreated,
  onClose
}: CreateNewWorkProps) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    measures: '',
    priority: 'Media',
    price: 0,
    finalPrice: 0,
  });

  // Opciones de prioridad
  const priorityOptions = ['Baja', 'Media', 'Alta', 'Crítica'];

  const handleSave = async () => {
    // Validaciones básicas
    if (!form.title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    if (!form.description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    try {
      setCreating(true);
      await workService.createWork({
        ...form,
        category: 4, // Categoría por defecto
        status: 'Cotización', // Estado inicial por defecto
        endDate: new Date().toISOString(), // Fecha tentativa
      });

      Alert.alert('Éxito', 'Trabajo creado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            onWorkCreated?.();
          }
        }
      ]);
    } catch (error) {
      console.error('Error creating work:', error);
      Alert.alert('Error', 'No se pudo crear el trabajo');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro que deseas cancelar? Se perderán los datos ingresados.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: onClose }
      ]
    );
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

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo Trabajo</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(text) => setForm({...form, title: text})}
              placeholder="Título del trabajo"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
            />
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => setForm({...form, description: text})}
              placeholder="Descripción detallada del trabajo"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Imagen */}
          <View style={styles.section}>
            <Text style={styles.label}>Imagen</Text>
            <TextInput
              style={styles.input}
              value={form.image}
              onChangeText={(text) => setForm({...form, image: text})}
              placeholder="URL de la imagen"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
            />
            {form.image && (
              <Image
                source={{ uri: form.image }}
                style={styles.imagePreview}
                onError={() => console.log('Error loading image')}
              />
            )}
          </View>

          {/* Medidas */}
          <View style={styles.section}>
            <Text style={styles.label}>Medidas</Text>
            <TextInput
              style={styles.input}
              value={form.measures}
              onChangeText={(text) => setForm({...form, measures: text})}
              placeholder="Ej: 2m x 1.5m x 0.5m"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
            />
          </View>

          {/* Prioridad */}
          <View style={styles.section}>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.pickerContainer}>
              {priorityOptions.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.pickerOption,
                    form.priority === priority && styles.pickerOptionSelected
                  ]}
                  onPress={() => setForm({...form, priority})}
                >
                  <View style={styles.priorityOption}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(priority) }]} />
                    <Text style={[
                      styles.pickerOptionText,
                      form.priority === priority && styles.pickerOptionTextSelected
                    ]}>
                      {priority}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Precios */}
          <View style={styles.pricesContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.label}>Precio Base</Text>
              <TextInput
                style={styles.input}
                value={form.price.toString()}
                onChangeText={(text) => setForm({
                  ...form,
                  price: parseInt(text.replace(/[^0-9]/g, '')) || 0
                })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.TEXT_TERTIARY}
              />
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.label}>Precio Final</Text>
              <TextInput
                style={styles.input}
                value={form.finalPrice.toString()}
                onChangeText={(text) => setForm({
                  ...form,
                  finalPrice: parseInt(text.replace(/[^0-9]/g, '')) || 0
                })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.TEXT_TERTIARY}
              />
            </View>
          </View>

          {/* Información adicional */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              • El trabajo se creará con estado "Cotización"
            </Text>
            <Text style={styles.infoText}>
              • La categoría se asignará como "Otros" por defecto
            </Text>
            <Text style={styles.infoText}>
              • Los campos marcados con (*) son obligatorios
            </Text>
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={creating}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={creating || !form.title.trim() || !form.description.trim()}
          >
            {creating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Crear Trabajo</Text>
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
    width: 40, // Para balancear el header
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
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
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.ACCENT,
    borderColor: COLORS.ACCENT,
  },
  pickerOptionText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  pickerOptionTextSelected: {
    color: COLORS.BACKGROUND_PRIMARY,
    fontWeight: '600',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  infoSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ACCENT,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
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
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.TEXT_TERTIARY,
  },
  saveButton: {
    backgroundColor: COLORS.ACCENT,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});