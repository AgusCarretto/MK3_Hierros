 export const sortWorksByStatus = (works: Work[]) => {
    return works.sort((a, b) => {
      const aIsCompleted = a.status === 'Finalizado' || a.status === 'Cancelado';
      const bIsCompleted = b.status === 'Finalizado' || b.status === 'Cancelado';

      // Si uno está completado y el otro no, el completado va al final
      if (aIsCompleted && !bIsCompleted) return 1;
      if (!aIsCompleted && bIsCompleted) return -1;

      return 0;
    });
  };