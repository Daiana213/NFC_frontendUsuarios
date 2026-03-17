# Sistema de Acceso con NFC - Frontend

## Descripción

Este proyecto corresponde al **frontend de un sistema de control de accesos mediante tecnología NFC**, desarrollado como parte de un trabajo académico.

La aplicación permite gestionar y visualizar la información de usuarios que acceden a un sistema físico (por ejemplo, una biblioteca) utilizando tarjetas o dispositivos NFC.

Forma parte de una solución más amplia que incluye:

* Dispositivo físico (ESP32 + lector NFC PN532)
* Backend/API
* Interfaz web (este repositorio)

## Objetivo

Desarrollar una interfaz web que permita:

* Visualizar registros de accesos
* Gestionar usuarios
* Interactuar con el sistema de control de acceso
* Centralizar la información capturada por dispositivos NFC

## ¿Cómo funciona el sistema?

1. El usuario se identifica mediante una tarjeta o dispositivo NFC
2. El lector NFC (PN532 + ESP32) captura el identificador
3. El backend procesa la información
4. El frontend muestra los datos en tiempo real o consultables

##  Tecnologías utilizadas

* React
* JavaScript
* HTML
* CSS
* Axios 

## Integración con el sistema

Este frontend se comunica con un backend que:

* Recibe datos desde el ESP32 con lector NFC
* Procesa los accesos
* Almacena la información en una base de datos
* Expone endpoints para consulta

## Estado del proyecto

🟡 En desarrollo / prototipo funcional

## 📚 Contexto académico

Este proyecto fue desarrollado en el marco de la materia **Comunicación de Datos**, integrando tecnologías de hardware (NFC) y software para resolver un problema real de control de accesos.

### URL Backend 
https://github.com/milivignoolo/NFC_backend
### URL Documentación
https://docs.google.com/document/d/1QBkQ9OWDJW9OflgPWrOIX13-NvQPO8QD3X3lQEQh5jg/edit?usp=sharing
