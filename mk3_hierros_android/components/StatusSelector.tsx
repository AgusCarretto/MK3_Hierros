import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../assets/constants/colors';
import { workService } from '../services/api';
import { Work } from '../types/work';

interface StatusSelectorProps {
  work: Work;
  visible: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
  onFinishWorkRequested?: (work: Work) => void;
}

export default function StatusSelector({
  work,
  visible,
  onClose,
  onStatusUpdated,
  onFinishWorkRequested
}: StatusSelectorProps) {
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    'Cotización',
    'Pendiente Aprobación',
    'Compra Materiales',
    'En curso',
    'Finalizado',
    'Cancelado'
  ];

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

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === work.status) {
      onClose();
      return;
    }

    // Si selecciona "Finalizado", abrir FinishWork en lugar de cambiar directamente
    if (newStatus === 'Finalizado') {
      onClose();
      onFinishWorkRequested?.(work);
      return;
    }

    try {
      setUpdating(true);
      await workService.updateWorkById(work.id, { status: newStatus });

      Alert.alert(
        'Estado Actualizado',
        `El trabajo "${work.title}" cambió a "${newStatus}"`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onStatusUpdated();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del trabajo');
    } finally {
      setUpdating(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Cambiar Estado</Text>
              <Text style={styles.workTitle} numberOfLines={1}>
                {work.title}
              </Text>
            </View>

            <View style={styles.statusList}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    work.status === status && styles.currentStatus
                  ]}
                  onPress={() => handleStatusChange(status)}
                  disabled={updating}
                >
                  <View style={styles.statusContent}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(status) }
                      ]}
                    />
                    <Text style={[
                      styles.statusText,
                      work.status === status && styles.currentStatusText
                    ]}>
                      {status}
                    </Text>
                    {work.status === status && (
                      <Text style={styles.currentLabel}>Actual</Text>
                    )}
                  </View>
                  {updating && work.status !== status && (
                    <ActivityIndicator size="small" color={COLORS.ACCENT} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={updating}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 12,
    minWidth: 300,
    maxWidth: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  workTitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  statusList: {
    paddingVertical: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  currentStatus: {
    backgroundColor: COLORS.BACKGROUND_CARD,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  currentStatusText: {
    fontWeight: '600',
  },
  currentLabel: {
    fontSize: 12,
    color: COLORS.ACCENT,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
});