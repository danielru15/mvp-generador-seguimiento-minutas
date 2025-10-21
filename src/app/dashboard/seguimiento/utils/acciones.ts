import { Escritura } from '../types';

export const crearAccionesHandlers = (
  messageApi: any,
  modal: any,
  eliminarEscritura: (id: string) => Promise<void>,
  abrirModalEdicion: (record: Escritura) => void,
  abrirModalPlantilla: (record: Escritura) => void
) => {
  const handleEdit = (record: Escritura) => {
    abrirModalEdicion(record);
  };

  const handleDelete = (record: Escritura) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar esta escritura?',
      content: `Se eliminará la escritura de ${record.nombre}`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarEscritura(record.key);
        } catch (error) {
          console.error('Error al eliminar:', error);
          if (error instanceof Error) {
            messageApi.error('Error al eliminar la escritura: ' + error.message);
          } else {
            messageApi.error('Error al eliminar la escritura');
          }
        }
      },
    });
  };

  const handleGenerateDoc = (record: Escritura) => {
    // Abrir el modal de selección de plantilla
    abrirModalPlantilla(record);
  };

  return {
    handleEdit,
    handleDelete,
    handleGenerateDoc,
  };
};

