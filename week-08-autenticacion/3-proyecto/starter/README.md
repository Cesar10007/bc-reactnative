# Pizza Ruta — Semana 08

Aplicación acumulativa de pizzería con catálogo API/offline, formularios, favoritos, preferencias y autenticación JWT.

## Credenciales de demostración

- Usuario: `emilys`
- Contraseña: `emilyspass`

## Autenticación

- Login JWT contra `dummyjson.com/auth/login`.
- Access y refresh tokens cifrados exclusivamente con Expo SecureStore.
- Restauración de sesión con `/auth/me` al reiniciar.
- Refresh automático y reintento ante respuestas 401.
- Logout elimina ambos tokens.
- Formularios de login y registro validados con React Hook Form y Zod.

DummyJSON simula la creación de usuarios pero no persiste cuentas nuevas. El flujo de registro demuestra el formulario y la petición; para una sesión verificable se usan las credenciales de demostración.

## Funcionalidades acumuladas

- Catálogo Pizza Ruta con Axios y TanStack Query.
- Crear, editar y eliminar pizzas con persistencia local.
- Búsqueda, detalle, favoritos Zustand y navegación tipada.
- Caché offline con AsyncStorage.
- Preferencias reactivas con MMKV.
- PIN de entrega con SecureStore.

## Ejecución

```bash
pnpm install
pnpm tsc
pnpm expo start --dev-client --clear
```

MMKV requiere development build; no funciona en Expo Go.
