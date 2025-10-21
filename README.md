# 📋 MVP Generador de Seguimiento de Minutas

Dashboard completo para la gestión de minutas y seguimiento de futuras escrituras, construido con Next.js 15, Firebase y Ant Design.

## 📑 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [Instalación](#-instalación)
- [Configuración de Firebase](#️-configuración-de-firebase)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Generación de Documentos](#-generación-de-documentos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Páginas del Dashboard](#-páginas-del-dashboard)
- [Personalización](#-personalización)
- [Scripts Disponibles](#-scripts-disponibles)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🚀 Stack Tecnológico

- **Next.js 15.5.6** - Framework React con App Router y Turbopack
- **React 19.1.0** - Biblioteca de UI
- **Firebase 12.4.0** - Backend completo
  - Authentication (Email/Password)
  - Firestore Database
  - Storage
- **Ant Design 5.27.6** - Biblioteca de componentes UI
- **TypeScript 5** - Tipado estático
- **Docxtemplater 3.66.7** - Generación de documentos Word
- **PizZip 3.2.0** - Manipulación de archivos .docx
- **pnpm** - Gestor de paquetes

---

## 🎨 Características

### 🔐 Autenticación de Usuarios

- ✅ Registro de usuarios con email y contraseña
- ✅ Inicio de sesión seguro
- ✅ Protección de rutas privadas
- ✅ Persistencia de sesión automática
- ✅ Cerrar sesión con confirmación
- ✅ Redirección inteligente según estado de autenticación
- ✅ Manejo de errores personalizado
- ✅ UI moderna con gradientes y animaciones

### 📄 Gestión de Minutas

- ✅ Carga de archivos con drag & drop a Firebase Storage
- ✅ Visualización de archivos en nueva pestaña
- ✅ Descarga de archivos
- ✅ Eliminación de archivos con confirmación
- ✅ Progreso en tiempo real durante la subida
- ✅ Iconos diferenciados por tipo de archivo (PDF, Word, Excel)
- ✅ Estadísticas de archivos y tamaño total
- ✅ Uso como plantillas para generar documentos
- ✅ Formatos soportados: PDF, Word, Excel, TXT (máx. 10MB)

### 📊 Seguimiento de Futuras Escrituras

- ✅ Gestión completa (CRUD) de escrituras
- ✅ Integración en tiempo real con Firestore
- ✅ Tabla con múltiples columnas de información
- ✅ Estadísticas: Total, Envío Escrituración, Pendientes de Firma, Enviadas Notaría, Regreso Registrada
- ✅ Barra de progreso general
- ✅ Búsqueda por ubicación, nombre o nomenclatura
- ✅ Filtros por estado y prioridad
- ✅ Modal para crear y editar escrituras
- ✅ Dropdown de acciones: Editar, Eliminar, Generar doc
- ✅ **Generación de documentos Word desde plantillas en Firebase Storage**
- ✅ Confirmación antes de eliminar
- ✅ Arquitectura modular con componentes reutilizables

**Campos de las escrituras:**
- Ubicación
- Nomenclatura
- Matrículas Inmobiliarias
- Nombre
- Identificación
- Escritura (opcional)
- ID Vissagio
- Prioridad (Alta, Media, Baja) - opcional
- Estado (Envío Escrituración, Pendiente de Firma, Enviadas Notaría, Regreso Registrada)

### 📝 Generación de Documentos Word

- ✅ Selección de plantillas desde Firebase Storage (carpeta minutas)
- ✅ Modal de selección de plantilla
- ✅ Sustitución automática de variables
- ✅ Descarga directa desde el navegador
- ✅ API REST para integración
- ✅ Soporte para formato, tablas y estilos
- ✅ Fecha y hora automáticas en zona horaria de Colombia

### 🎨 Diseño Moderno

- Esquema de colores en **gris y morado**
- Sidebar colapsable con navegación
- Header con menú de usuario
- Diseño responsive
- Animaciones suaves

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd mvp-generador-seguimiento-minutas
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

### 4. Configurar Firebase

Sigue las instrucciones en la sección [Configuración de Firebase](#️-configuración-de-firebase).

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

### 6. Abrir en el navegador

Abre tu navegador en: `http://localhost:3000`

---

## ⚙️ Configuración de Firebase

### 🔐 Paso 1: Habilitar Authentication

**Este paso es OBLIGATORIO para que funcione el login y registro.**

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"Authentication"**
4. Si es la primera vez, haz clic en **"Get started"**
5. Ve a la pestaña **"Sign-in method"**
6. Busca **"Email/Password"** en la lista
7. Haz clic sobre él para expandir las opciones
8. **Activa el toggle** de "Email/Password"
9. Haz clic en **"Save"**
10. Verifica que aparezca como "Enabled" en verde

**Errores comunes:**
- `auth/operation-not-allowed` → Email/Password no está habilitado

### 📦 Paso 2: Configurar Storage Rules

**Para desarrollo (permisivo):**

1. Ve a Firebase Console > **Storage** > **Rules**
2. Copia y pega estas reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /minutas/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

**Para producción (con autenticación):**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /minutas/{allPaths=**} {
      // Solo usuarios autenticados
      allow read, write: if request.auth != null;
      
      // Limitar tamaño de archivo a 10MB
      allow write: if request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 🔥 Paso 3: Configurar Firestore Rules

**Para desarrollo (permisivo):**

1. Ve a Firebase Console > **Firestore Database** > **Rules**
2. Copia y pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de seguimiento de escrituras
    match /seguimiento-minutas/{document=**} {
      allow read, write: if true;
    }
    
    // Colección de minutas
    match /minutas/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

**Para producción (con autenticación):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de seguimiento de escrituras
    match /seguimiento-minutas/{escrituraId} {
      allow read: if request.auth != null;
      
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll([
                      'ubicacion', 'nomenclatura', 'matriculasInmobiliarias',
                      'nombre', 'identificacion', 'idVissagio', 'estado'
                    ]);
      
      allow update, delete: if request.auth != null;
    }
    
    // Colección de minutas
    match /minutas/{minutaId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### ⚠️ Importante sobre las reglas

- **NO uses las reglas de desarrollo en producción** - son inseguras
- Las reglas de desarrollo (`allow read, write: if true;`) permiten acceso público
- Las reglas de producción requieren autenticación

---

## 🔐 Sistema de Autenticación

### 📁 Arquitectura Modular

El sistema de autenticación está completamente modularizado:

```
src/
├── app/
│   └── auth/
│       ├── login/page.tsx          # Página de login
│       └── registro/page.tsx       # Página de registro
├── components/
│   └── auth/
│       ├── LoginForm.tsx           # Formulario de login
│       ├── RegistroForm.tsx        # Formulario de registro
│       └── ProtectedRoute.tsx      # HOC para proteger rutas
├── contexts/
│   └── AuthContext.tsx             # Context global de autenticación
├── hooks/
│   └── useAuth.ts                  # Hook personalizado de auth
└── types/
    └── auth.ts                     # Tipos TypeScript
```

### 🔄 Flujos de Usuario

#### Registro
1. Accede a `/auth/registro`
2. Ingresa nombre, email y contraseña
3. Confirma la contraseña
4. Crea la cuenta
5. Redirige automáticamente al dashboard

#### Login
1. Accede a `/auth/login`
2. Ingresa email y contraseña
3. Inicia sesión
4. Redirige automáticamente al dashboard

#### Protección de Rutas
- Todas las rutas `/dashboard/*` están protegidas
- Si no estás autenticado, te redirige a `/auth/login`
- La sesión persiste automáticamente

#### Cerrar Sesión
1. Haz clic en tu avatar en el header
2. Selecciona "Cerrar sesión"
3. Confirma en el modal
4. Redirige a `/auth/login`

---

## 📝 Generación de Documentos

### 🎯 Cómo Funciona

1. Sube plantillas Word (.docx) a Firebase Storage (carpeta **minutas**)
2. En el dashboard de Seguimiento, haz clic en **"Acciones" → "Generar doc"**
3. Se abre un modal mostrando todas las plantillas disponibles
4. Selecciona la plantilla que desees
5. El sistema genera el documento con los datos de la escritura
6. Se descarga automáticamente

### 📋 Variables Disponibles

Las plantillas Word deben usar variables con formato `{nombreVariable}`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{ubicacion}` | Ubicación completa | "Calle 123 # 45-67, Bogotá" |
| `{nomenclatura}` | Nomenclatura del inmueble | "Calle 123 # 45-67" |
| `{matriculasInmobiliarias}` | Matrículas inmobiliarias | "50C-123456, 50C-789012" |
| `{nombre}` | Nombre del propietario | "Juan Pérez García" |
| `{identificacion}` | Identificación | "CC 1234567890" |
| `{escritura}` | Número de escritura | "ESC-2025-001" |
| `{idVissagio}` | ID de Vissagio | "VIS-123456" |
| `{prioridad}` | Prioridad del caso | "alta", "media", "baja" |
| `{estado}` | Estado actual | "Envío Escrituración", etc. |
| `{fechaActual}` | Fecha de generación | "21/10/2025" |

### 📄 Crear una Plantilla

1. Abre Microsoft Word
2. Crea tu documento con el formato deseado
3. Usa variables con el formato `{nombreVariable}`
4. Guarda como `.docx`
5. Sube el archivo a Firebase Storage en la carpeta **minutas**
6. ¡Listo! La plantilla estará disponible en el modal de selección

**Ejemplo de plantilla:**

```
═══════════════════════════════════════════
           ESCRITURA PÚBLICA
═══════════════════════════════════════════

INFORMACIÓN DEL INMUEBLE

Ubicación:           {ubicacion}
Nomenclatura:        {nomenclatura}
Matrículas Inmob.:   {matriculasInmobiliarias}

═══════════════════════════════════════════
           DATOS DEL PROPIETARIO
═══════════════════════════════════════════

Nombre Completo:     {nombre}
Identificación:      {identificacion}

═══════════════════════════════════════════
           INFORMACIÓN DE TRÁMITE
═══════════════════════════════════════════

Escritura:           {escritura}
ID Vissagio:         {idVissagio}
Prioridad:           {prioridad}
Estado Actual:       {estado}

Fecha de Generación: {fechaActual}
═══════════════════════════════════════════
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                       # Autenticación
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   ├── dashboard/                  # Dashboard protegido
│   │   ├── layout.tsx              # Layout con ProtectedRoute
│   │   ├── page.tsx                # Redirige a minutas
│   │   ├── minutas/
│   │   │   └── page.tsx            # Gestión de archivos
│   │   └── seguimiento/
│   │       ├── page.tsx            # Página principal
│   │       ├── types.ts            # Tipos TypeScript
│   │       ├── components/         # Componentes UI
│   │       │   ├── EstadisticasCards.tsx
│   │       │   ├── FiltrosAcciones.tsx
│   │       │   ├── TablaEscrituras.tsx
│   │       │   ├── ModalEscritura.tsx
│   │       │   ├── ModalSeleccionPlantilla.tsx
│   │       │   └── index.ts
│   │       ├── hooks/              # Hooks personalizados
│   │       │   └── useEscrituras.ts
│   │       └── utils/              # Utilidades
│   │           ├── estadisticas.ts
│   │           ├── acciones.ts
│   │           └── documentos.ts
│   ├── api/
│   │   └── generar-documento/
│   │       └── route.ts            # API endpoint
│   ├── layout.tsx                  # Layout raíz con AuthProvider
│   └── page.tsx                    # Página principal con redirección
├── components/
│   ├── auth/                       # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── RegistroForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   └── DashboardLayout.tsx         # Layout del dashboard
├── contexts/
│   ├── AuthContext.tsx             # Context de autenticación
│   └── index.ts
├── hooks/
│   ├── useAuth.ts                  # Hook de autenticación
│   └── index.ts
├── lib/
│   ├── AntdRegistry.tsx            # Tema de Ant Design
│   └── firebase.ts                 # Configuración de Firebase
├── services/
│   └── documento.service.ts        # Servicio de documentos
├── types/
│   └── auth.ts                     # Tipos de autenticación
└── utils/
    └── fecha/
        └── fechaHora.util.ts       # Utilidades de fecha
```

---

## 📄 Páginas del Dashboard

### 1. Minutas (`/dashboard/minutas`)

Gestión completa de archivos de minutas en Firebase Storage.

**Características:**
- Upload con drag & drop
- Visualización en nueva pestaña
- Descarga de archivos
- Eliminación con confirmación
- Progreso en tiempo real
- Iconos por tipo de archivo
- Estadísticas de archivos
- **Los archivos .docx se pueden usar como plantillas para generar documentos**

**Formatos soportados:**
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Texto (.txt)
- Tamaño máximo: 10MB

### 2. Seguimiento de Futuras Escrituras (`/dashboard/seguimiento`)

Sistema completo de seguimiento de escrituras con Firestore.

**Características principales:**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Sincronización en tiempo real
- Búsqueda y filtros
- Estadísticas dinámicas
- Modal reutilizable para crear/editar
- **Generación de documentos desde plantillas en Storage**
- Arquitectura modular

**Componentes:**
- `EstadisticasCards` - Tarjetas con estadísticas
- `FiltrosAcciones` - Búsqueda y filtros
- `TablaEscrituras` - Tabla de datos
- `ModalEscritura` - Modal crear/editar
- `ModalSeleccionPlantilla` - Modal para seleccionar plantilla

**Hooks personalizados:**
- `useEscrituras` - CRUD con Firestore

**Utilidades:**
- `estadisticas.ts` - Cálculos de estadísticas
- `acciones.ts` - Handlers de acciones
- `documentos.ts` - Generación de documentos

---

## 🎨 Personalización

### Tema de Colores

Edita `src/lib/AntdRegistry.tsx` para cambiar el tema:

```typescript
theme={{
  token: {
    colorPrimary: '#7c3aed',        // Morado principal
    colorInfo: '#7c3aed',
    colorBgLayout: '#f5f5f7',       // Gris claro
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
    colorText: '#374151',
    colorTextSecondary: '#6b7280',
    borderRadius: 8,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#1f2937',           // Gris oscuro sidebar
    },
    Menu: {
      darkItemBg: '#1f2937',
      darkItemSelectedBg: '#7c3aed', // Morado selección
      darkItemHoverBg: '#374151',
    },
  },
}}
```

### Colores del Dashboard

- **Color primario**: Morado `#7c3aed`
- **Sidebar**: Gris oscuro `#1f2937`
- **Fondo**: Gris claro `#f5f5f7`
- **Texto**: Gris oscuro `#374151`
- **Texto secundario**: `#6b7280`

---

## 🎯 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo

# Producción
pnpm build        # Construye para producción
pnpm start        # Inicia servidor de producción

# Utilidades
pnpm lint         # Ejecuta linter
```

---

## 🐛 Solución de Problemas

### Error: `auth/operation-not-allowed`

**Causa:** Email/Password no está habilitado en Firebase.

**Solución:**
1. Ve a Firebase Console > Authentication > Sign-in method
2. Habilita "Email/Password"
3. Guarda los cambios
4. Espera 10-20 segundos y recarga la app

### Error al subir archivos

**Causa:** Reglas de Firebase Storage no configuradas.

**Solución:**
1. Ve a Firebase Console > Storage > Rules
2. Copia y pega las reglas de desarrollo (ver sección de configuración)
3. Publica las reglas

### Error: `Missing or insufficient permissions`

**Causa:** Reglas de Firestore no configuradas.

**Solución:**
1. Ve a Firebase Console > Firestore Database > Rules
2. Copia y pega las reglas de desarrollo (ver sección de configuración)
3. Publica las reglas

### No aparecen plantillas en el modal

**Causa:** No hay archivos .docx en Firebase Storage (carpeta minutas).

**Solución:**
1. Ve a Dashboard > Minutas
2. Sube archivos .docx que serán tus plantillas
3. Intenta generar documento nuevamente

### Las variables no se reemplazan en el documento

**Causa:** Sintaxis incorrecta en la plantilla.

**Solución:**
1. Usa exactamente: `{variable}` (sin espacios)
2. Verifica que los nombres coincidan con las variables disponibles
3. No uses `{` o `}` en el texto normal de la plantilla

### La sesión no persiste

**Causa:** Firebase Auth está configurado correctamente pero hay un error en el código.

**Solución:**
1. Verifica que `AuthProvider` esté en el layout raíz
2. Revisa la consola del navegador para errores
3. Limpia el localStorage del navegador

### Error de conexión a Firebase

**Causa:** Variables de entorno incorrectas o servidor no reiniciado.

**Solución:**
1. Verifica que `.env.local` tenga todas las variables correctas
2. **Reinicia el servidor** después de cambiar `.env.local`:
   ```bash
   # Detén el servidor (Ctrl+C)
   pnpm dev
   ```
3. Verifica que el proyecto de Firebase esté activo en la consola

---

## 🔒 Seguridad

- ✅ El archivo `.env.local` está en `.gitignore`
- ✅ Las contraseñas son manejadas por Firebase (nunca en texto plano)
- ✅ Tokens de autenticación manejados automáticamente
- ✅ Sesiones persistentes con refresh tokens
- ✅ Protección de rutas del lado del cliente
- ✅ Validación de formularios en tiempo real
- ⚠️ Configura las reglas de producción antes de desplegar

---

## 📚 Tecnologías y Librerías

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Ant Design** - Componentes UI

### Backend (Firebase)
- **Authentication** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL
- **Storage** - Almacenamiento de archivos

### Generación de Documentos
- **Docxtemplater** - Motor de plantillas Word
- **PizZip** - Manipulación de archivos .docx

### Estado y Context
- **React Context API** - Estado global de autenticación
- **Custom Hooks** - Lógica reutilizable

---

## 🚀 Próximos Pasos

- [ ] Implementar recuperación de contraseña
- [ ] Agregar verificación de email
- [ ] Implementar roles y permisos de usuario
- [ ] Agregar más tipos de variables para plantillas
- [ ] Implementar generación de PDF además de Word
- [ ] Implementar exportación de reportes (PDF, Excel)
- [ ] Agregar notificaciones en tiempo real
- [ ] Implementar búsqueda avanzada con filtros múltiples
- [ ] Agregar gráficos y analytics
- [ ] Implementar historial de cambios
- [ ] Agregar tests unitarios y de integración

---

## 📝 Notas Importantes

1. **Primer Uso:**
   - Debes habilitar Email/Password en Firebase Authentication
   - Configura las reglas de Storage y Firestore
   - Crea un archivo `.env.local` con tus credenciales
   - Sube plantillas .docx a Firebase Storage (carpeta minutas)

2. **Desarrollo:**
   - Usa las reglas permisivas de Firebase
   - El servidor debe reiniciarse después de cambiar `.env.local`

3. **Producción:**
   - Cambia a las reglas de producción en Firebase
   - Verifica que todas las variables de entorno estén configuradas
   - Realiza pruebas de seguridad

4. **Autenticación:**
   - La sesión persiste automáticamente
   - Los usuarios deben registrarse antes de iniciar sesión
   - El dashboard completo está protegido

5. **Generación de Documentos:**
   - Las plantillas deben subirse a Firebase Storage (carpeta minutas)
   - Solo se reconocen archivos .docx
   - Las variables deben usar el formato `{nombreVariable}`

---

## 📄 Licencia

Este proyecto es un MVP (Producto Mínimo Viable) para gestión de minutas y seguimiento de escrituras.

---

**Desarrollado con ❤️ usando Next.js, Firebase, Ant Design y Docxtemplater**
