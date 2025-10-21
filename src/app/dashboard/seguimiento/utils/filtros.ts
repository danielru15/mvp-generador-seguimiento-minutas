import { Escritura } from '../types';

interface FiltrosAplicados {
  estado: string;
  prioridad: string;
}

export const aplicarFiltros = (
  escrituras: Escritura[],
  filtros: FiltrosAplicados
): Escritura[] => {
  let resultado = [...escrituras];

  // Filtrar por estado
  if (filtros.estado && filtros.estado !== 'todos') {
    resultado = resultado.filter((escritura) => escritura.estado === filtros.estado);
  }

  // Filtrar por prioridad
  if (filtros.prioridad && filtros.prioridad !== 'todas') {
    resultado = resultado.filter((escritura) => escritura.prioridad === filtros.prioridad);
  }

  return resultado;
};

