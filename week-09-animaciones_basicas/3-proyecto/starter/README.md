# Pizza Ruta — Semana 09

Aplicación acumulativa de las semanas 1–9: catálogo API/offline, formularios, favoritos, preferencias, autenticación JWT y animaciones básicas.

## Credenciales

- Usuario: `emilys`
- Contraseña: `emilyspass`

## Animaciones integradas

1. **Entrada del catálogo:** header con fade/slide mediante `Animated.parallel` y `Animated.timing`.
2. **Entrada del detalle:** opacity 0→1 y translateY 30→0 en paralelo durante 500 ms.
3. **Cards con feedback:** escala 1→0.95→1 usando `Animated.spring` al presionar cada pizza.
4. **Botones animados:** opacity y escala en paralelo; rebote encadenado con `Animated.sequence`.
5. **Lista en cascada:** pizzas animadas con `Animated.stagger(80, ...)`.
6. **Indicador de precio:** barra cuyo ancho y color se interpolan entre rojo, amarillo y verde.
7. **Icono de Pizza Ruta:** rotación 0→360° mediante `interpolate`.
8. **Altas y eliminaciones:** `LayoutAnimation` con soporte experimental habilitado en Android.

Opacity y transform usan `useNativeDriver: true`. La barra usa `false` únicamente porque React Native no permite animar width y backgroundColor con el driver nativo.

## Funcionalidades acumuladas

- Login JWT, restauración de sesión, refresh 401 y tokens en SecureStore.
- Catálogo Pizza Ruta con Axios y TanStack Query.
- Crear, editar y eliminar pizzas con React Hook Form y Zod.
- Favoritas con Zustand, navegación tipada y perfil.
- Caché offline con AsyncStorage, preferencias MMKV y PIN SecureStore.

## Ejecución

```bash
pnpm install
pnpm tsc
pnpm expo start --dev-client --clear
```

MMKV requiere development build y no funciona en Expo Go.
