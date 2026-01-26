# Genesis Sign WhatsApp Landing

Landing ligera para redirecciones desde WhatsApp hacia Genesis Sign.

## Variables de entorno

Crea un archivo `.env.local` con:

```
NEXT_PUBLIC_APP_BASE_URL=https://innova.genesisempresarial.com/sign
```

## Desarrollo local

```bash
pnpm dev
# o
npm run dev
```

Abrir: `http://localhost:3000/w/35`

## Deploy bajo /sign-landing

Esta app se publica bajo el subpath `/sign-landing`. Next.js se configura con `basePath` para que los assets se soliciten como `/sign-landing/_next/static/...`.

**Nota de proxy:** el servidor (Nginx/ALB/ingress) debe reenviar tanto:

- `/sign-landing`
- `/sign-landing/_next/*`

hacia el proceso de Next.js.

## Pruebas manuales rápidas con User Agents

Puedes simular el comportamiento cambiando el user agent en tu navegador o con cURL:

```bash
curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)" http://localhost:3000/w/35
curl -A "Mozilla/5.0 (Linux; Android 13; Pixel 7)" http://localhost:3000/w/35
curl -A "Mozilla/5.0 (Linux; Android 13; Pixel 7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 WhatsApp" http://localhost:3000/w/35
```

## Ejemplo de URL

`http://localhost:3000/w/35`
