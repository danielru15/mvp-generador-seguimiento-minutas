/**
 * Obtiene la fecha y hora actual en formato colombiano
 * @param fecha - Fecha a formatear (opcional, por defecto usa la fecha actual)
 * @returns String con formato: DD-MM-YYYY HH:MM:SS
 */
export const obtenerFechaColombia = (fecha?: Date): string => {
  const fechaActual = fecha || new Date();
  
  // Configurar zona horaria de Colombia (UTC-5)
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatoColombia = new Intl.DateTimeFormat('es-CO', opciones);
  const partes = formatoColombia.formatToParts(fechaActual);

  const dia = partes.find(p => p.type === 'day')?.value || '01';
  const mes = partes.find(p => p.type === 'month')?.value || '01';
  const año = partes.find(p => p.type === 'year')?.value || '2024';
  const hora = partes.find(p => p.type === 'hour')?.value || '00';
  const minuto = partes.find(p => p.type === 'minute')?.value || '00';
  const segundo = partes.find(p => p.type === 'second')?.value || '00';

  return `${dia}-${mes}-${año} ${hora}:${minuto}:${segundo}`;
};

/**
 * Obtiene solo la fecha en formato colombiano
 * @param fecha - Fecha a formatear (opcional, por defecto usa la fecha actual)
 * @returns String con formato: DD-MM-YYYY
 */
export const obtenerSoloFechaColombia = (fecha?: Date): string => {
  const fechaActual = fecha || new Date();
  
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const formatoColombia = new Intl.DateTimeFormat('es-CO', opciones);
  const partes = formatoColombia.formatToParts(fechaActual);

  const dia = partes.find(p => p.type === 'day')?.value || '01';
  const mes = partes.find(p => p.type === 'month')?.value || '01';
  const año = partes.find(p => p.type === 'year')?.value || '2024';

  return `${dia}-${mes}-${año}`;
};

/**
 * Formatea una fecha para nombre de archivo
 * @param fecha - Fecha a formatear (opcional, por defecto usa la fecha actual)
 * @returns String con formato: DDMMYYYY_HHMMSS
 */
export const obtenerFechaParaNombreArchivo = (fecha?: Date): string => {
  const fechaActual = fecha || new Date();
  
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatoColombia = new Intl.DateTimeFormat('es-CO', opciones);
  const partes = formatoColombia.formatToParts(fechaActual);

  const dia = partes.find(p => p.type === 'day')?.value || '01';
  const mes = partes.find(p => p.type === 'month')?.value || '01';
  const año = partes.find(p => p.type === 'year')?.value || '2024';
  const hora = partes.find(p => p.type === 'hour')?.value || '00';
  const minuto = partes.find(p => p.type === 'minute')?.value || '00';
  const segundo = partes.find(p => p.type === 'second')?.value || '00';

  return `${dia}${mes}${año}_${hora}${minuto}${segundo}`;
};

