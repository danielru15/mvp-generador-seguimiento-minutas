import { NextRequest, NextResponse } from 'next/server';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { obtenerFechaColombia } from "@/utils/fecha/fechaHora.util";
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

/**
 * POST /api/generar-documento
 * Genera un documento Word a partir de una plantilla en Firebase Storage
 * 
 * Body esperado:
 * {
 *   plantillaPath: string,      // Ruta de la plantilla en Firebase Storage
 *   plantillaNombre: string,    // Nombre del archivo de plantilla
 *   data: any                   // Datos para rellenar la plantilla
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body de la petición
    const body = await request.json();
    const { plantillaPath, plantillaNombre, data } = body;

    // Validar que se envíen los datos necesarios
    if (!plantillaPath) {
      return NextResponse.json(
        { error: 'El campo "plantillaPath" es requerido' },
        { status: 400 }
      );
    }

    if (!plantillaNombre) {
      return NextResponse.json(
        { error: 'El campo "plantillaNombre" es requerido' },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'El campo "data" es requerido' },
        { status: 400 }
      );
    }

    // Validar que la plantilla tenga extensión .docx o .doc
    if (!plantillaNombre.endsWith(".docx") && !plantillaNombre.endsWith(".doc")) {
      return NextResponse.json(
        { error: 'El archivo debe tener extensión .docx o .doc' },
        { status: 400 }
      );
    }

    // Advertencia: .doc puede tener problemas de compatibilidad
    if (plantillaNombre.endsWith(".doc")) {
      console.warn('Advertencia: Los archivos .doc pueden tener problemas de compatibilidad. Se recomienda usar .docx');
    }

    // Descargar la plantilla desde Firebase Storage
    const plantillaRef = ref(storage, plantillaPath);
    const plantillaUrl = await getDownloadURL(plantillaRef);

    // Descargar el contenido de la plantilla
    const plantillaResponse = await fetch(plantillaUrl);
    if (!plantillaResponse.ok) {
      throw new Error('Error al descargar la plantilla desde Firebase Storage');
    }
    
    // Convertir a buffer
    const plantillaArrayBuffer = await plantillaResponse.arrayBuffer();
    const content = Buffer.from(plantillaArrayBuffer);
    const zip = new PizZip(content);

    // Crear instancia de Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Rellenar la plantilla con los datos
    doc.render(data);

    // Generar el documento como arraybuffer
    const arrayBuffer = doc.getZip().generate({ 
      type: "arraybuffer"
    }) as ArrayBuffer;

    // Generar nombre del archivo con fecha (siempre .docx)
    const nombreBase = plantillaNombre.replace('.docx', '').replace('.doc', '');
    const fileName = `${nombreBase} ${obtenerFechaColombia(new Date())}.docx`;

    // Crear la respuesta con el archivo
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error al generar documento:', error);
    
    // Manejo de errores específicos
    if (error.message.includes('extensión')) {
      return NextResponse.json(
        { error: 'Formato de plantilla inválido', detalles: error.message },
        { status: 400 }
      );
    }

    // Error genérico
    return NextResponse.json(
      { error: 'Error al generar el documento', detalles: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generar-documento
 * Retorna información sobre el endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para generar documentos Word',
    metodo: 'POST',
    body: {
      plantilla: 'string (nombre del archivo .docx en src/templates)',
      data: 'object (datos para rellenar la plantilla)',
    },
    ejemplo: {
      plantilla: 'escritura.docx',
      data: {
        ubicacion: 'Calle 123 # 45-67',
        nombre: 'Juan Pérez',
        identificacion: 'CC 1234567890',
      },
    },
  });
}

