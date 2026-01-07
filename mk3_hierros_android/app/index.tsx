import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import WorkList from '../components/WorkList';
import CreateNewWork from '../components/CreateNewWork';
import StatusSelector from '../components/StatusSelector';
import FinishWork from '../components/FinishWork';
import { workService } from '../services/api';
import { Work } from '../types/work';
import { COLORS } from '../assets/constants/colors';
import {sortWorksByStatus} from '../assets/utils/sortWorksByStatus'

export default function HomeScreen() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWork, setShowCreateWork] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [showFinishWork, setShowFinishWork] = useState(false);
  const [workToFinish, setWorkToFinish] = useState<Work | null>(null);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const worksData = await workService.getWorks();
      //Activos primero (por prioridad), luego finalizados/cancelados
      const sortedWorks = sortWorksByStatus(worksData);
      setWorks(sortedWorks);
    } catch (error) {
      return `error cargando trabajos,  ${error}`;
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar trabajos después de una actualización
  const handleWorkUpdated = async () => {
    try {
      const worksData = await workService.getWorks();
      const sortedWorks = sortWorksByStatus(worksData);
      setWorks(sortedWorks);
    } catch (error) {
      return `error cargando trabajos,  ${error}`;
    }
  };

  // Función para manejar la acción de agregar nuevo trabajo
  const handleAddWork = () => {
    setShowCreateWork(true);
  };

  // Función para cerrar el modal de crear trabajo
  const handleCloseCreateWork = () => {
    setShowCreateWork(false);
  };

  // Función para manejar cuando se crea un nuevo trabajo
  const handleWorkCreated = async () => {
    try {
      const worksData = await workService.getWorks();
      const sortedWorks = sortWorksByStatus(worksData);
      setWorks(sortedWorks);
    } catch (error) {
      console.error('Error reloading works:', error);
    }
  };

  // Función para abrir el selector de estado
  const handleStatusPress = (work: Work) => {
    setSelectedWork(work);
    setShowStatusSelector(true);
  };

  // Función para cerrar el selector de estado
  const handleCloseStatusSelector = () => {
    setShowStatusSelector(false);
    setSelectedWork(null);
  };

  // Función para manejar cuando se actualiza el estado
  const handleStatusUpdated = async () => {
    try {
      const worksData = await workService.getWorks();
      const sortedWorks = sortWorksByStatus(worksData);
      setWorks(sortedWorks);
    } catch (error) {
      console.error('Error reloading works after status update:', error);
    }
  };

  // Función para manejar cuando se solicita finalizar trabajo
  const handleFinishWorkRequested = (work: Work) => {
    setWorkToFinish(work);
    setShowFinishWork(true);
    // Cerrar el selector de estado
    setShowStatusSelector(false);
    setSelectedWork(null);
  };

  // Función para cerrar el modal de finalizar trabajo
  const handleCloseFinishWork = () => {
    setShowFinishWork(false);
    setWorkToFinish(null);
  };

  // Función para manejar cuando se finaliza un trabajo
  const handleWorkFinished = async () => {
    try {
      const worksData = await workService.getWorks();
      const sortedWorks = sortWorksByStatus(worksData);
      setWorks(sortedWorks);
      // Cerrar el modal
      setShowFinishWork(false);
      setWorkToFinish(null);
    } catch (error) {
      console.error('Error reloading works after finish:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando trabajos...</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_PRIMARY} />

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>MK3 Hierros</Text>
              <Text style={styles.subtitle}>
                {works.length} trabajo{works.length !== 1 ? 's' : ''} en sistema
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddWork}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <WorkList
          works={works}
          onWorksUpdate={handleWorkUpdated}
          onStatusPress={handleStatusPress}
        />

        {/* Envolvemos todos los modales en un View para evitar el error de React.Fragment */}
        <View>
          {showCreateWork && (
            <CreateNewWork
              onWorkCreated={handleWorkCreated}
              onClose={handleCloseCreateWork}
            />
          )}

          {showStatusSelector && selectedWork && (
            <StatusSelector
              work={selectedWork}
              visible={showStatusSelector}
              onClose={handleCloseStatusSelector}
              onStatusUpdated={handleStatusUpdated}
              onFinishWorkRequested={handleFinishWorkRequested}
            />
          )}

          {showFinishWork && workToFinish && (
            <FinishWork
              work={workToFinish}
              visible={showFinishWork}
              onClose={handleCloseFinishWork}
              onWorkFinished={handleWorkFinished}
            />
          )}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 28,
    color: COLORS.BACKGROUND_PRIMARY,
    fontWeight: '300',
    lineHeight: 28,
  },
});