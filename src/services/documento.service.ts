import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { obtenerFechaColombia } from "@/utils/fecha/fechaHora.util";

/**
 * Genera un documento Word a partir de una plantilla .docx
 * @param plantilla - Nombre del archivo de plantilla (debe estar en src/templates)
 * @param data - Datos para rellenar la plantilla
 * @returns Buffer del documento generado y nombre del archivo
 */
export const createDocumentoWordService = async (
  plantilla: string,
  data: any
): Promise<{ buffer: Buffer; fileName: string }> => {
  // Validar que la plantilla tenga extensión .docx
  if (!plantilla.endsWith(".docx")) {
    throw new Error("El archivo debe tener extensión .docx");
  }

  // Construir la ruta de la plantilla
  const templatePath = path.join(process.cwd(), "src", "templates", plantilla);

  // Verificar que la plantilla exista
  if (!fs.existsSync(templatePath)) {
    throw new Error(`La plantilla no existe en ${templatePath}`);
  }

  // Leer el contenido de la plantilla
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  // Crear instancia de Docxtemplater
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Rellenar la plantilla con los datos
  doc.render(data);

  // Generar el buffer del documento
  const buffer = doc.getZip().generate({ type: "nodebuffer" });

  // Generar nombre del archivo con fecha
  const fileName = `${plantilla.replace('.docx', '')} ${obtenerFechaColombia(new Date())}.docx`;

  return { buffer, fileName };
};

/**
 * Lista todas las plantillas disponibles en la carpeta templates
 * @returns Array con los nombres de las plantillas
 */
export const listarPlantillas = (): string[] => {
  const templatesPath = path.join(process.cwd(), "src", "templates");

  // Verificar que el directorio exista
  if (!fs.existsSync(templatesPath)) {
    fs.mkdirSync(templatesPath, { recursive: true });
    return [];
  }

  // Leer archivos del directorio y filtrar solo .docx
  const archivos = fs.readdirSync(templatesPath);
  return archivos.filter(archivo => archivo.endsWith('.docx'));
};

/**
 * Verifica si una plantilla existe
 * @param plantilla - Nombre del archivo de plantilla
 * @returns true si existe, false si no
 */
export const existePlantilla = (plantilla: string): boolean => {
  const templatePath = path.join(process.cwd(), "src", "templates", plantilla);
  return fs.existsSync(templatePath);
};

