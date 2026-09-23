# Pizza Ruta — Semana 05

## Descripción

Pizza Ruta es una aplicación móvil de catálogo de pizzas. Permite consultar pizzas desde una API REST, buscar elementos, abrir el detalle de cada pizza y crear una pizza de prueba mediante un formulario.

## Tecnologías

- React Native con Expo
- TypeScript
- Axios
- TanStack Query v5
- React Navigation

## API usada

La aplicación utiliza JSONPlaceholder como API REST de práctica:

- Base URL: `https://jsonplaceholder.typicode.com`
- Lista: `GET /posts?_limit=10`
- Creación: `POST /posts`

Los posts recibidos se adaptan al dominio Pizza Ruta mediante una función de mapeo que combina la respuesta remota con atributos locales como imagen, sabor, tipo de masa y precio.

## Funcionalidades

- Lista de 10 pizzas obtenida desde una API usando `useQuery`.
- Estados de carga, error y lista vacía.
- Botón de reintento cuando falla la conexión.
- Búsqueda de pizzas por nombre.
- Pull-to-refresh usando `refetch`.
- Pantalla de detalle con datos de la pizza seleccionada.
- Formulario modal para crear pizzas.
- Creación mediante `useMutation`.
- Actualización inmediata del caché con `setQueryData`.
- Invalidación del caché con `invalidateQueries`.

## Decisión técnica

JSONPlaceholder simula correctamente las solicitudes `POST`, pero no persiste recursos creados en su servidor. Por ello, al crear una pizza, la app la agrega temporalmente al caché local de TanStack Query usando `queryClient.setQueryData`. También se ejecuta `invalidateQueries` para conservar el flujo estándar de sincronización exigido por el proyecto.

Las pizzas originales provienen de la API. Las pizzas creadas durante la sesión permanecen visibles en la lista hasta que se hace una recarga que consulta nuevamente los datos remotos.

## Evidencias

Agregar capturas de:

1. Lista principal con las pizzas cargadas desde la API.
2. Detalle de una pizza.
3. Formulario para crear una pizza.
4. Pizza creada visible en la lista.
5. Estado de error de red y botón Reintentar.