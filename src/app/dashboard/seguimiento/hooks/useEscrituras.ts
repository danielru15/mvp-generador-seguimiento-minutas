import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Escritura, EscrituraFormValues } from '../types';

interface UseEscriturasReturn {
  escrituras: Escritura[];
  loading: boolean;
  crearEscritura: (values: EscrituraFormValues) => Promise<void>;
  actualizarEscritura: (id: string, values: EscrituraFormValues) => Promise<void>;
  eliminarEscritura: (id: string) => Promise<void>;
}

export const useEscrituras = (messageApi: any): UseEscriturasReturn => {
  const [escrituras, setEscrituras] = useState<Escritura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Iniciando carga de datos desde Firestore...');

    const unsubscribe = onSnapshot(
      collection(db, 'seguimiento-minutas'),
      (snapshot) => {
        console.log('Snapshot recibido, número de documentos:', snapshot.size);

        const data: Escritura[] = snapshot.docs.map((doc) => {
          const docData = doc.data();
          console.log('Documento:', doc.id, docData);
          return {
            key: doc.id,
            id: docData.id || doc.id,
            ubicacion: docData.ubicacion || '',
            nomenclatura: docData.nomenclatura || '',
            matriculasInmobiliarias: docData.matriculasInmobiliarias || '',
            nombre: docData.nombre || '',
            identificacion: docData.identificacion || '',
            escritura: docData.escritura || '',
            idVissagio: docData.idVissagio || '',
            prioridad: docData.prioridad || 'media',
            estado: docData.estado || 'envio_escrituracion',
            progreso: docData.progreso || 0,
          };
        });

        console.log('Escrituras procesadas:', data);
        setEscrituras(data);
        setLoading(false);

        if (snapshot.size === 0) {
          messageApi.info('No hay escrituras registradas en la colección seguimiento-minutas');
        }
      },
      (error) => {
        console.error('Error al cargar escrituras:', error);
        messageApi.error('Error al cargar las escrituras: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [messageApi]);

  const crearEscritura = async (values: EscrituraFormValues): Promise<void> => {
    const newEscritura = {
      ubicacion: values.ubicacion,
      nomenclatura: values.nomenclatura,
      matriculasInmobiliarias: values.matriculasInmobiliarias,
      nombre: values.nombre,
      identificacion: values.identificacion,
      escritura: values.escritura || '',
      idVissagio: values.idVissagio,
      prioridad: values.prioridad || 'media',
      estado: values.estado || 'envio_escrituracion',
      progreso: 0,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    };

    console.log('Guardando en Firestore:', newEscritura);
    await addDoc(collection(db, 'seguimiento-minutas'), newEscritura);
    messageApi.success('Escritura creada exitosamente');
  };

  const actualizarEscritura = async (id: string, values: EscrituraFormValues): Promise<void> => {
    const updatedEscritura = {
      ubicacion: values.ubicacion,
      nomenclatura: values.nomenclatura,
      matriculasInmobiliarias: values.matriculasInmobiliarias,
      nombre: values.nombre,
      identificacion: values.identificacion,
      escritura: values.escritura || '',
      idVissagio: values.idVissagio,
      prioridad: values.prioridad || 'media',
      estado: values.estado || 'envio_escrituracion',
      fechaActualizacion: serverTimestamp(),
    };

    console.log('Actualizando en Firestore:', updatedEscritura);
    await updateDoc(doc(db, 'seguimiento-minutas', id), updatedEscritura);
    messageApi.success('Escritura actualizada exitosamente');
  };

  const eliminarEscritura = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'seguimiento-minutas', id));
    messageApi.success('Escritura eliminada exitosamente');
  };

  return {
    escrituras,
    loading,
    crearEscritura,
    actualizarEscritura,
    eliminarEscritura,
  };
};

