import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Work, Priority, Status } from '../types/work';
import { COLORS } from '../assets/constants/colors';

interface WorkCardProps {
  work: Work;
  onPress?: () => void;
  onStatusPress?: (work: Work) => void;
}

export default function WorkCard({ work, onPress, onStatusPress }: WorkCardProps) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleStatusPress = (event: any) => {
    event.stopPropagation(); // Evita que se dispare el onPress del card
    onStatusPress?.(work);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header de la card */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{work.title}</Text>
          <Text style={styles.category}>{work.category}</Text>
        </View>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(work.status) }]}
            onPress={handleStatusPress}
            activeOpacity={0.8}
          >
            <Text style={styles.statusText} numberOfLines={1}>
              {work.status}
            </Text>
            <Text style={styles.statusArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.cardContent}>
        <Text style={styles.description} numberOfLines={2}>
          {work.description}
        </Text>

        <View style={styles.measuresContainer}>
          <Text style={styles.measuresLabel}>Medidas:</Text>
          <Text style={styles.measures}>{work.measures}</Text>
        </View>
      </View>

      {/* Footer con precios y fecha */}
      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio:</Text>
          <Text style={styles.price}>
            {work.finalPrice ? formatPrice(work.finalPrice) : formatPrice(work.price)}
          </Text>
          {work.finalPrice && work.finalPrice !== work.price && (
            <Text style={styles.originalPrice}>{formatPrice(work.price)}</Text>
          )}
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(work.priority) }]} />
            <Text style={styles.priorityText}>{work.priority}</Text>
          </View>

          {work.endDate && (
            <Text style={styles.endDate}>
              Entrega: {formatDate(work.endDate)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: COLORS.ACCENT,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 110,
    maxWidth: 150,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 4,
  },
  statusArrow: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  measuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measuresLabel: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    marginRight: 8,
  },
  measures: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  cardFooter: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  endDate: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    fontStyle: 'italic',
  },
});