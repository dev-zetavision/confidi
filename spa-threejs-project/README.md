# Proyecto SPA

SPA (Single Page App) con HTML, CSS y JS vanilla + Three.js

## Estructura
/public              -> HTMLs y CSS asociados  
   ├─ index.html    -> usa home.css  
   ├─ about.html    -> usa about.css  
   ├─ contact.html  -> usa contact.css  
   ├─ 404.html      -> usa 404.css  
   └─ assets/       -> imgs, icons, modelos 3D, textures  

/src                -> Codigo fuente  
   ├─ js/          -> Scripts JS  
   │   ├─ router.js   -> Nav SPA (sin recarga)  
   │   ├─ main.js     -> Codigo principal  
   │   └─ forms.js    -> Logica de formularios  
   └─ three/       -> Modulos Three.js  
       ├─ scene.js    -> Config escena 3D  
       ├─ models.js   -> Carga de modelos  
       └─ controls.js -> Controles de escena  

/utils              -> Helpers y funciones  
   ├─ api.js       -> Llamadas a API  
   └─ helpers.js   -> Funciones reutilizables  

index.css           -> Vars globales (paleta, estilos comunes)  
.gitignore          -> Archivos a ignorar  
README.md           -> Este documento  

## Contribucion
-> Seguir estructura  
-> Usar nombres descriptivos (ej: index.html y home.css)  
-> Comentar codigo brevemente  
-> Actualizar router.js al agregar/eliminar HTMLs  

