# DailyVault — Habit Tracker

App móvil personal para seguimiento de hábitos diarios. Construida con **React Native + Expo**, almacenamiento local con **Zustand persist** y diseño oscuro en negro y naranja.

> **Este proyecto fue desarrollado 100% con inteligencia artificial** usando [Claude Code](https://claude.ai/code) de Anthropic. Desde la arquitectura, la lógica de negocio y los componentes de UI hasta la corrección de bugs — todo fue generado y refinado en conversación con el modelo.

---

## Pantallas

| Pantalla | Descripción |
|---|---|
| **Hoy** | Lista de hábitos del día con progreso, navegación a días anteriores y registro en 1-2 taps |
| **Historial** | Mapa de calor estilo GitHub por hábito con racha, total y % del mes |
| **Hábitos** | CRUD completo: tipo, meta, frecuencia, ícono y color por hábito |
| **Categorías** | Agrupadores con ícono y color, predefinidos + personalizables |
| **Ajustes** | Notificación diaria configurable, export e import de datos en JSON |

---

## Stack técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Expo | 54.x |
| Runtime | React Native | 0.81.x |
| Lenguaje | JavaScript (JSX) | — |
| Navegación | React Navigation | 7.x |
| Estado y persistencia | Zustand + AsyncStorage | 5.x |
| Estilos | NativeWind (Tailwind CSS) | 4.x |
| Iconos | Lucide React Native | 1.x |
| Animaciones | React Native Reanimated | 4.x |
| Notificaciones | Expo Notifications | — |
| Plataforma objetivo | Android | — |

---

## Tipos de hábitos

| Tipo | Descripción | Ejemplo |
|---|---|---|
| **Booleano** | Sí / No — se hizo o no | Meditar, leer |
| **Cantidad** | Valor numérico con unidad y meta | 2 litros de agua |
| **Duración** | Tiempo en minutos con meta | 30 min de ejercicio |

## Frecuencias disponibles

- **Diaria** — aparece todos los días
- **Cada X días** — cada N días a partir de una referencia fija
- **Semanal** — días específicos de la semana (L M X J V S D)

---

## Estructura del proyecto

```
src/
├── feature/
│   ├── hoy/
│   │   ├── screens/HoyScreen.js
│   │   ├── components/ModalRegistrar.js
│   │   └── utils/habitoDelDia.js
│   ├── habitos/
│   │   ├── screens/HabitosScreen.js
│   │   ├── screens/FormHabitoScreen.js
│   │   ├── store/useHabitoStore.js
│   │   └── constants/picker.js
│   ├── categorias/
│   │   ├── screens/CategoriasScreen.js
│   │   └── components/ModalCategoria.js
│   ├── historial/
│   │   ├── screens/HistorialScreen.js
│   │   ├── components/Heatmap.js
│   │   └── utils/estadisticas.js
│   └── ajustes/
│       ├── screens/AjustesScreen.js
│       └── utils/notificaciones.js
│
├── navigation/
│   ├── RootStack.js
│   └── TabNavigator.js
│
├── theme/
│   ├── theme.js          # Paleta negro + naranja (light / dark)
│   ├── ThemeContext.js
│   └── useTheme.js
│
├── utils/
│   └── fecha.js          # Utilidades de fecha sin problemas de timezone
│
└── components/
    ├── ui/               # Containers, Header, etc.
    └── IconLucide.js     # Wrapper de lucide-react-native
```

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd DailyVault

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npx expo start
```

### Plataformas

```bash
npx expo start --android
npx expo start --ios
```

---

## Builds con EAS

```bash
# Build de desarrollo
eas build --profile development --platform android

# Build de preview
eas build --profile preview --platform android

# Build de producción
eas build --profile production --platform android
```

---

## Paleta de colores

| Token | Valor |
|---|---|
| Fondo principal | `#0A0A0A` |
| Fondo secundario | `#141414` |
| Acento principal | `#FF6B00` |
| Texto principal | `#FFFFFF` |
| Texto secundario | `#888888` |

---

## Hecho con IA

Este proyecto es un experimento real de desarrollo asistido por IA. El flujo de trabajo fue:

1. Entrevista de descubrimiento de producto → documento de requisitos en `CLAUDE.md`
2. Desarrollo iterativo por pantallas en conversación con **Claude Code**
3. Corrección de bugs en vivo (reactivity de Zustand, safe area en Android, etc.)
4. Ninguna línea de código fue escrita manualmente

**Modelo:** Claude Sonnet 4.6 via Claude Code CLI  
**Autor:** matiudev
