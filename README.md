Pizza Ruta - Pizzería con Delivery
Autor: César David Rueda Daza
Ficha: 3311987
Bootcamp: bc-reactnative — semanas 1 a 9
Correo: ruedacesardavid@gmail.com
Dominio: Pizzería con delivery
Entidad principal: Item (pizza) — name, image, price, flavor, doughType

App móvil para catálogo y gestión de pedidos de una pizzería, construida desde cero con React Native + Expo + TypeScript, cumpliendo las rúbricas de las semanas 1 a 9 del bootcamp [ergrato-dev/bc-reactnative](https://github.com/ergrato-dev/bc-reactnative), en el repositorio [Cesar10007/bc-reactnative](https://github.com/Cesar10007/bc-reactnative).

## 🌳 Estructura del repositorio (evaluación por semana)

El repositorio sigue el flujo de eval-semanal: una rama por semana con el código y README correspondiente, más una consolidación de todas las semanas dentro de `week-09` para evaluación final.

| Rama | Semana | Contenido de la entrega |
|---|---|---|
| week-01 | 01 | Core Components y Flexbox: interfaz `Item` (name, image, price, flavor, doughType), 4 pizzas mock, `ItemCard` con `Pressable` y feedback visual, `HomeScreen` con header y `ScrollView` |
| week-02 | 02 | Listas, inputs y estilos |
| week-03 | 03 | React Navigation: `AppNavigator`, `AuthNavigator`, `RootNavigator`, tipos de rutas (`navigation/types.ts`) |
| week-04 | 04 | Estado global con Zustand: `savedStore` (favoritos/guardados) |
| week-05 | 05 | Networking: `services/api.ts` y `services/pizzaApi.ts`, hook `useItems` |
| week-06 | 06 | Formularios y validación: `itemSchema` (Zod), `FormField`, `FormSelectField`, `PizzaFormField`, pantallas `CreateScreen` y `EditScreen` |
| week-07 | 07 | Persistencia local con MMKV (`storage/mmkv.ts`), preferencias (`usePreferences`), `SettingsScreen` |
| week-08 | 08 | Autenticación: `authSchema`, `authStore`, `authService`, `tokenService`, `LoginScreen`, `RegisterScreen` |
| week-09 | 09 | Animaciones básicas: `AnimatedButton`, `AnimatedCard`, `ProgressBar` aplicados al catálogo |
| main | — | Base del template del bootcamp (ergrato-dev), no contiene la app integrada de Pizza Ruta |

> Nota: la rama `week-09` es la que contiene la app consolidada y funcional con las 9 semanas integradas (carpetas `week-01-...` a `week-09-...` dentro del repo, tras la reorganización hecha para evaluación).

## 🎯 Objetivo del dominio

**Pizza Ruta** es una pizzería con servicio de delivery. La app gestiona el catálogo de pizzas y el flujo asociado:

- **Catálogo (`CatalogScreen`, `HomeScreen`):** listado de pizzas con nombre, imagen, precio, sabor (`flavor`) y tipo de masa (`doughType`)
- **Detalle (`DetailScreen`):** vista ampliada de una pizza
- **Crear / Editar (`CreateScreen`, `EditScreen`):** alta y edición de pizzas con validación vía `itemSchema` (Zod) y campos reutilizables (`FormField`, `FormSelectField`, `PizzaFormField`)
- **Guardados (`SavedScreen`, `savedStore`):** pizzas favoritas persistidas con Zustand
- **Autenticación (`LoginScreen`, `RegisterScreen`, `authStore`, `authService`, `tokenService`):** inicio de sesión y registro
- **Perfil (`ProfileScreen`):** datos del usuario autenticado
- **Ajustes (`SettingsScreen`, `usePreferences`):** preferencias persistidas en almacenamiento local (MMKV)
- **Animaciones (semana 9):** `AnimatedButton`, `AnimatedCard` y `ProgressBar` para feedback visual en el catálogo

## 🚀 Cómo ejecutar el proyecto

**Requisitos**
- Node.js 18+ (stack usa Expo SDK 57 / React Native 0.86)
- pnpm (via corepack)
- Expo Go instalado en el celular (Android/iOS)
- Celular y computador en la misma red WiFi

**Pasos**
```bash
# 1. Clonar y entrar
git clone https://github.com/Cesar10007/bc-reactnative.git
cd bc-reactnative
git checkout week-09

# 2. Entrar al proyecto de la semana 9 (app consolidada)
cd week-09-animaciones_basicas/3-proyecto/starter

# 3. Instalar dependencias
pnpm install

# 4. Arrancar Metro
pnpm start

# 5. Escanear el QR con Expo Go (Android) o Cámara (iOS)
```

## 📱 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React Native 0.86 + Expo SDK 57 |
| Lenguaje | TypeScript 6 |
| Navegación | @react-navigation (Stack + Tabs), navegación tipada |
| Estado global | Zustand (`authStore`, `savedStore`) |
| Datos remotos | `pizzaApi` / `api` (cliente HTTP propio) |
| Formularios | React Hook Form + Zod 4 (`itemSchema`, `authSchema`) |
| Persistencia | react-native-mmkv |
| Animaciones | Reanimated 4 / Animated API (`AnimatedButton`, `AnimatedCard`, `ProgressBar`) |
| Gestión de paquetes | pnpm |

## 🗂️ Estructura del código (rama week-09, proyecto consolidado)

```
week-09-animaciones_basicas/3-proyecto/starter/src/
├── components/     # AnimatedButton, AnimatedCard, FormField, FormSelectField, PizzaFormField, ProgressBar
├── hooks/          # useItems, usePreferences
├── navigation/     # AppNavigator, AuthNavigator, RootNavigator, types
├── schemas/        # authSchema, itemSchema (Zod)
├── screens/        # HomeScreen, CatalogScreen, DetailScreen, CreateScreen, EditScreen,
│                   # LoginScreen, RegisterScreen, ProfileScreen, SavedScreen, SettingsScreen
├── services/       # api, pizzaApi, authService, tokenService
├── storage/        # mmkv (persistencia local)
├── stores/         # authStore, savedStore (Zustand)
├── theme/          # tema de la app
└── types/          # tipos de dominio (Item, etc.)
```

## ✅ Funcionalidades por semana (resumen)

**Semana 01 — Core Components y Flexbox**
Interfaz `Item` con `name`, `image`, `price`, `flavor` y `doughType`; 4 pizzas de ejemplo; `ItemCard` con `Pressable` y feedback visual (opacidad + borde); `HomeScreen` con header y `ScrollView`.

**Semana 02 — Listas, inputs y estilos**
Listado y estilos aplicados al catálogo de pizzas.

**Semana 03 — Navegación**
`AppNavigator`, `AuthNavigator` y `RootNavigator` con rutas tipadas para moverse entre Home, Catálogo, Detalle y Auth.

**Semana 04 — Estado global**
`savedStore` con Zustand para guardar pizzas favoritas.

**Semana 05 — Networking**
`services/api.ts` y `services/pizzaApi.ts` junto al hook `useItems` para traer el catálogo.

**Semana 06 — Formularios y validación**
`itemSchema` con Zod, formularios reutilizables (`FormField`, `FormSelectField`, `PizzaFormField`) usados en `CreateScreen` y `EditScreen`.

**Semana 07 — Persistencia local**
Almacenamiento con MMKV (`storage/mmkv.ts`) y preferencias (`usePreferences`) reflejadas en `SettingsScreen`.

**Semana 08 — Autenticación**
`authSchema`, `authStore`, `authService` y `tokenService` para login y registro (`LoginScreen`, `RegisterScreen`).

**Semana 09 — Animaciones básicas**
`AnimatedButton`, `AnimatedCard` y `ProgressBar` aplicados al catálogo para feedback visual al interactuar.

## 📝 Commits

Convención usada en este repositorio:
```
feat(week-XX): <resumen de la semana> - Pizza Ruta 3311987
```

La rama `week-09` conserva el trabajo consolidado de las semanas 1 a 9 tras la reorganización de carpetas para evaluación.