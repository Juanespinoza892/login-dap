# Control de Acceso

Sistema de ingreso seguro con verificación por email usando MailerSend.

## Características

- Landing page moderna con descripción y opciones
- Verificación por email (código de 6 dígitos)
- UI fluida con transiciones suaves
- Diseño responsive (mobile-first)

## Requisitos

- Node.js >= 18
- API key de [MailerSend](https://www.mailersend.com/)

## Instalación

```bash
npm install
```

## Uso

```bash
MAILERSEND_API_KEY=tu_api_key npm start
```

El servidor se inicia en `http://localhost:3000`

## Estructura

```
public/          # Frontend (HTML, CSS, JS)
  index.html     # Página principal (SPA)
  styles.css     # Estilos con animaciones fluidas
  app.js         # Lógica del frontend
server/          # Backend (Express)
  index.js       # API para envío y verificación de emails
```

## Flujo

1. Landing page con descripción del sistema
2. Ingreso de email
3. Se envía código de verificación por email (MailerSend)
4. Ingreso del código de 6 dígitos
5. Acceso al panel principal
