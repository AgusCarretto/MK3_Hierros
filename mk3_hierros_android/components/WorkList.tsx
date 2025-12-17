import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../assets/constants/colors';
import { Status, Work } from '../types/work';
import WorkCard from './WorkCard';
import WorkDetailScreen from './WorkDetailScreen';

interface WorkListProps {
  works: Work[];
  loading?: boolean;
  onWorksUpdate?: () => void;
  onStatusPress?: (work: Work) => void;
}

export default function WorkList({
  works,
  loading = false,
  onWorksUpdate,
  onStatusPress
}: WorkListProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const WorkListHeader = ({
    totalWorks,
    groupedWorks
  }: {
    totalWorks: number;
    groupedWorks: Record<Status, Work[]>;
  }) => (
    <View style={styles.headerStats}>
      <Text style={styles.totalWorks}>
        Total: {totalWorks} trabajo{totalWorks !== 1 ? 's' : ''}
      </Text>
      <View style={styles.statusSummary}>
        {Object.entries(groupedWorks).map(([status, statusWorks]) => (
          <View key={status} style={styles.statusCount}>
            <Text style={styles.statusCountNumber}>{statusWorks.length}</Text>
            <Text style={styles.statusCountLabel}>{status}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const handleWorkPress = (work: Work) => {
    setSelectedWork(work);
  };

  const handleWorkUpdated = () => {
    // Solo llamar la función de recarga del padre
    onWorksUpdate?.();
  };

  const handleCloseDetail = () => {
    setSelectedWork(null);
  };

  const handleStatusPress = (work: Work) => {
    onStatusPress?.(work);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando trabajos...</Text>
      </View>
    );
  }

  if (works.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay trabajos</Text>
        <Text style={styles.emptySubtitle}>Aún no se han cargado trabajos en el sistema</Text>
      </View>
    );
  }

  const getWorksByStatus = () => {
    const grouped = works.reduce((acc, work) => {
      if (!acc[work.status]) {
        acc[work.status] = [];
      }
      acc[work.status].push(work);
      return acc;
    }, {} as Record<Status, Work[]>);

    return grouped;
  };

  const groupedWorks = getWorksByStatus();

  return (
    <View style={styles.container}>
      <FlatList
        data={works}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WorkCard
            work={item}
            onPress={() => handleWorkPress(item)}
            onStatusPress={handleStatusPress}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <WorkListHeader
            totalWorks={works.length}
            groupedWorks={groupedWorks}
          />
        }
      />

      {/* Modal de detalle */}
      {selectedWork && (
        <WorkDetailScreen
          initialWork={selectedWork}
          onWorkUpdated={handleWorkUpdated}
          onClose={handleCloseDetail}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  headerStats: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  totalWorks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statusCount: {
    alignItems: 'center',
    minWidth: 80,
    marginBottom: 4,
  },
  statusCountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
  },
  statusCountLabel: {
    fontSize: 10,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
});