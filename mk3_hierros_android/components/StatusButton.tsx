import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../assets/constants/colors';
import { Work } from '../types/work';

interface StatusButtonProps {
  work: Work;
  onPress: () => void;
}

export default function StatusButton({ work, onPress }: StatusButtonProps) {
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

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getStatusColor(work.status) }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.statusText} numberOfLines={1}>
        {work.status}
      </Text>
      <Text style={styles.arrow}>▼</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 120,
    maxWidth: 160,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    marginRight: 4,
  },
  arrow: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
});