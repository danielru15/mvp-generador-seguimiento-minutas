import { Escritura } from '../types';

/**
 * Genera un documento Word a partir de una plantilla de Firebase Storage y los datos de una escritura
 * @param plantillaPath - Ruta completa de la plantilla en Firebase Storage
 * @param plantillaNombre - Nombre del archivo de plantilla
 * @param escritura - Datos de la escritura
 * @returns Promise que se resuelve cuando el documento se descarga
 */
export const generarDocumentoEscritura = async (
  plantillaPath: string,
  plantillaNombre: string,
  escritura: Escritura
): Promise<void> => {
  try {
    // Preparar los datos para la plantilla
    const data = {
      ubicacion: escritura.ubicacion,
      nomenclatura: escritura.nomenclatura,
      matriculasInmobiliarias: escritura.matriculasInmobiliarias,
      nombre: escritura.nombre,
      identificacion: escritura.identificacion,
      escritura: escritura.escritura || 'N/A',
      idVissagio: escritura.idVissagio,
      prioridad: escritura.prioridad || 'media',
      estado: obtenerTextoEstado(escritura.estado),
      fechaActual: new Date().toLocaleDateString('es-CO'),
    };

    // Llamar al API con la ruta de la plantilla en Firebase Storage
    // El servidor se encargará de descargar la plantilla
    const response = await fetch('/api/generar-documento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plantillaPath,
        plantillaNombre,
        data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al generar documento');
    }

    // Obtener el blob del documento generado
    const blob = await response.blob();
    
    // Obtener el nombre del archivo del header
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'documento.docx';
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch) {
        fileName = fileNameMatch[1];
      }
    }

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al generar documento:', error);
    throw error;
  }
};

/**
 * Obtiene el texto legible del estado
 */
const obtenerTextoEstado = (estado: string): string => {
  const estadosTexto: Record<string, string> = {
    'envio_escrituracion': 'Envío Escrituración',
    'pendiente_firma': 'Pendiente de Firma',
    'enviadas_notaria': 'Enviadas Notaría',
    'regreso_registrada': 'Regreso Registrada',
  };
  
  return estadosTexto[estado] || estado;
};

