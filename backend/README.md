pos/
├── backend/ # Todo el código del servidor
│ ├── config/ # Configuraciones globales
│ ├── controllers/ # Controladores organizados por módulo
│ │ ├── admin/ # Controladores de administración
│ │ ├── pos/ # Controladores del POS
│ │ └── shared/ # Controladores compartidos
│ ├── models/ # Modelos de base de datos
│ ├── routes/ # Definición de rutas
│ │ ├── admin/ # Rutas de administración
│ │ ├── pos/ # Rutas del POS
│ │ └── index.js # Agregador de rutas
│ ├── services/ # Lógica de negocio
│ │ ├── admin/ # Servicios de admin
│ │ ├── pos/ # Servicios del POS
│ │ └── shared/ # Servicios compartidos
│ ├── public/ # Archivos públicos
│ │ └── uploads/ # Archivos subidos
│ │ ├── products/ # Imágenes de productos
│ │ └── temp/ # Archivos temporales
│ ├── utils/ # Utilidades compartidas
│ └── app.js # Aplicación principal
