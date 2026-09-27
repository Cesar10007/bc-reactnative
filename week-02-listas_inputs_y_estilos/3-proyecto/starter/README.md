# Pizza Ruta — Semana 02

## Dominio
App de pedidos de pizza. Cada tarjeta representa una pizza del menú (Item) con nombre, sabor, tipo de masa, precio e imagen.

## Pantallas
- **HomeScreen**: header con el nombre de la app, buscador en tiempo real y lista de pizzas en tarjetas (FlatList).
- Estado vacío personalizado cuando la búsqueda no encuentra coincidencias.

## Decisiones de diseño
- Se usó `useMemo` para evitar recalcular el filtro en cada render.
- `Pressable` con feedback visual (cambio de color de fondo) en cada tarjeta.
- Tema centralizado (`COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`) para mantener estilos consistentes entre componentes.
- Color de acento rojo (#e63946) para reforzar la identidad de marca de pizza.