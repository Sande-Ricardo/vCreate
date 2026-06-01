# Documento de Especificación de Requerimientos de Software (SRS)

> **Nombre del Proyecto:** vCreate
> **Identificador de Proyecto:** CV-Generator-MVP
> **Público Objetivo:** Agentes Autónomos de Desarrollo (Antigravity IDE)
> **Objetivo Principal:** Desarrollar una aplicación web sin estado (stateless) para la creación, edición y generación (opcionalmente bilingüe) de currículums vitae, entregando los resultados consolidados en un paquete ZIP.

---

## 1. Arquitectura y Stack Tecnológico

El sistema debe construirse como una aplicación basada en el framework Next.js, separando estrictamente la interfaz de cliente y la lógica de servidor a través de API Routes.

| Componente              | Tecnología Designada                        | Rol en el Sistema                                                              |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| **Frontend**            | Next.js (App Router), React, Tailwind CSS   | Gestión de estado UI, renderizado de formularios y descarga de archivos.       |
| **Backend**             | Next.js API Routes (Serverless)             | Orquestación de peticiones, traducción, inyección de plantillas y empaquetado. |
| **Fuente de Datos**     | Archivo `.json` local                       | Única fuente de verdad global del sistema.                                     |
| **Traducción**          | DeepL API (REST)                            | Traducción automática opcional de campos de texto libre.                       |
| **Motor de Plantillas** | Handlebars o EJS                            | Inyección del objeto JSON dentro de la plantilla base `.tex`.                  |
| **Compilación PDF**     | API Pública de LaTeX (ej. `latexonline.cc`) | Transformación del código fuente LaTeX renderizado a formato binario (PDF).    |
| **Empaquetado**         | Paquete nativo de Node / `jszip`            | Compresión de los PDFs y el JSON actualizado en un único archivo de salida.    |

---

## 2. Restricciones del Sistema (Límites Estrictos)

- **Ausencia de Autenticación:** El sistema no debe poseer módulos de login, registro ni manejo de sesiones de usuario.
- **Procesamiento Efímero:** El servidor no debe guardar ningún archivo temporal `.pdf`, `.tex` o `.json` en el disco. Todo el procesamiento y la manipulación de archivos debe realizarse en memoria (mediante Buffers) durante el ciclo de vida de la petición HTTP.
- **Ejecución Paralela:** Las llamadas a APIs externas (específicamente la compilación concurrente de los archivos LaTeX si se selecciona la generación bilingüe) deben ejecutarse en paralelo mediante promesas para evitar exceder los límites de _timeout_ del entorno de ejecución.

---

## 3. Especificaciones de Interfaz (UI/UX)

El diseño visual debe implementarse utilizando Tailwind CSS, apegándose estrictamente a una estética oscura, minimalista y geométrica. Todo el texto de la interfaz debe estar en inglés.

- **Paleta de Colores:** El fondo principal debe ser un gradiente de azul medianoche muy profundo hacia negro absoluto. El color secundario para tipografías y delineados será blanco brillante.
- **Estilo de Componentes (Efecto Neón/Luz):** Los bordes de los inputs de texto, paneles contenedores y botones deben ser ultra finos y luminosos. Deben simular cortes de transparencia con iluminación trasera blanca. Nunca utilizar emojis, emplear logotipos SVG.
- **Estructura del Layout:**

1. Panel de navegación lateral para el salto rápido entre secciones (Datos Personales, Experiencia, Educación, Skills).
2. Área central expansiva para el formulario dinámico de ingreso de datos.
3. Área de previsualización mostrando un wireframe estilizado (HTML/CSS) del CV.
4. Consola de exportación con los controles principales: "Load JSON", "Save Draft", "Download ZIP", selección de idioma de entrada, y opción de "Generación Bilingüe".

---

## 4. Requerimientos Funcionales (Flujo de Ejecución)

### F1. Carga de Estado Inicial y Selección de Idioma

El cliente web debe permitir al usuario seleccionar el idioma de entrada. El sistema ofertará nativamente las dos plantillas de idioma (secciones en ES o EN). El usuario puede iniciar con un formulario vacío o cargar un archivo `cv_data.json` previamente guardado. Al procesar el archivo, los datos deben poblar automáticamente los inputs correspondientes.

### F2. Edición Reactiva

Cualquier inserción o modificación en los campos del formulario debe actualizar instantáneamente el objeto de estado centralizado en el lado del cliente (por ejemplo, usando Zustand).

### F3. Acción de Generación (Endpoint `/api/generate`)

Al iniciar el proceso de generación, el cliente enviará el estado JSON completo al servidor mediante una petición POST, indicando si se desea generación simple o bilingüe. El servidor ejecutará secuencialmente:

1. **Traducción (Opcional):** Si se solicitó la versión bilingüe, filtrar los campos de texto narrativo del JSON original y enviarlos a la API de DeepL. Mapear las traducciones devueltas en un nuevo objeto espejo en el otro idioma.
2. **Plantillado:** Cargar en memoria la/s plantilla/s locales `.tex`. Inyectar las variables del JSON para generar la cadena de texto origen, y hacer lo mismo para el segundo idioma si corresponde.
3. **Compilación Externa:** Enviar la/s cadena/s de código LaTeX a una API pública de compilación. Si son múltiples, en paralelo. El servidor debe recibir y procesar las respuestas como objetos de tipo `Buffer`.
4. **Empaquetado en Memoria:** Crear un contenedor ZIP que agrupe: `CV_Principal.pdf`, `CV_Secundario.pdf` (opcional) y `cv_data.json`.
5. **Transmisión:** Retornar el stream del ZIP al cliente configurando las cabeceras `Content-Type: application/zip` y `Content-Disposition: attachment`.

### F4. Descarga del Cliente

El frontend debe interceptar la respuesta binaria de la API y forzar el diálogo de descarga nativo del navegador del usuario.

---

## 5. Directivas de Ejecución para Agentes

- **Prioridad de Inicialización:** Comienza la construcción definiendo los esquemas estáticos de tipado (TypeScript Interfaces) basados en `structure.json`. Esto asegurará congruencia en todo el código.
- **Sanitización de Datos:** Es obligatorio programar una función utilitaria en el backend que intercepte y escape caracteres reservados de LaTeX (`&`, `%`, `$`, `#`, `_`, `{`, `}`, `~`, `^`, `\`) provenientes del JSON del usuario antes de que toquen el motor de plantillas.
- **Desarrollo Basado en Mocks:** Antes de conectar las llamadas reales a DeepL o a la API de compilación LaTeX, construye y verifica la totalidad del endpoint `/api/generate` utilizando respuestas _mock_ (devolviendo PDFs de prueba pre-guardados en código) para validar que el sistema de empaquetado ZIP y la descarga del cliente funcionan correctamente.
- **Gestión de Artefactos de Error:** Implementa un manejo de excepciones que capture la salida de la consola (_log_) del compilador LaTeX externo si este falla, y propague ese mensaje en formato de texto legible hacia el frontend.
