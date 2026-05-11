# Habit Tracker — Documento de Proyecto

> App móvil personal para seguimiento de hábitos diarios. Construida con React Native + Expo, almacenamiento local con Zustand persist, diseño negro y naranja.

---

## 1. Contexto y problema

### ¿Para quién es?
Uso personal y exclusivo. No hay multi-usuario, ni onboarding, ni sistema de permisos.

### ¿Qué problema resuelve?
- **Falta de visibilidad real:** No saber honestamente si estoy cumpliendo lo que me propongo día a día.
- **Paywalls en apps existentes:** Las funciones útiles están bloqueadas detrás de suscripciones.
- **Falta de personalización:** Las apps genéricas no se adaptan a la forma de pensar del usuario.

### ¿Cuál es el objetivo?
Usar la app todos los días sin fricción. Registrar hábitos en menos de 60 segundos. Sentir satisfacción real al completar un hábito — no solo funcionalidad, sino una experiencia que se siente bien.

---

## 2. Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | React Native + Expo |
| Estado y persistencia | Zustand con middleware `persist` |
| Storage local | AsyncStorage |
| Notificaciones | expo-notifications (local, sin servidor) |
| Plataforma objetivo | Android |

---

## 3. Entidades del dominio

### 3.1 Categorías

Agrupan hábitos relacionados semánticamente (ej. Salud, Educación, Finanzas).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | UUID generado automáticamente |
| `nombre` | string | Nombre de la categoría |
| `icono` | string | Ícono representativo |
| `color` | string (hex) | Color identificador |

**Comportamiento:**
- Existen categorías predefinidas al iniciar la app.
- El usuario puede crear categorías nuevas.
- El usuario puede editar nombre, ícono y color.

---

### 3.2 Hábitos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | UUID generado automáticamente |
| `nombre` | string | Nombre del hábito |
| `categoriaId` | string | Referencia a la categoría |
| `icono` | string | Ícono representativo |
| `color` | string (hex) | Color identificador |
| `tipo` | enum | `booleano` \| `cantidad` \| `duracion` |
| `meta` | number \| null | Valor objetivo diario (aplica a cantidad y duración) |
| `unidad` | string \| null | Unidad de la meta (ej. "litros", "minutos") |
| `frecuencia` | object | Ver detalle abajo |
| `activo` | boolean | Si el hábito aparece en la vista de hoy |

**Tipos de registro:**

| Tipo | Descripción | Ejemplo |
|---|---|---|
| `booleano` | Sí / No — se hizo o no se hizo | Meditar, leer |
| `cantidad` | Valor numérico con unidad y meta | 2 litros de agua, 10.000 pasos |
| `duracion` | Tiempo en minutos con meta | 30 minutos de ejercicio |

**Frecuencia (configurable por hábito):**

```json
{ "tipo": "diaria" }
{ "tipo": "cada_x_dias", "intervalo": 3 }
{ "tipo": "semanal", "diasSemana": [1, 3, 5] }
```

---

### 3.3 Registros

Cada vez que el usuario completa (o registra) un hábito para un día.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | UUID generado automáticamente |
| `habitoId` | string | Referencia al hábito |
| `fecha` | string (ISO) | Fecha del registro (permite días pasados) |
| `valor` | boolean \| number | Valor registrado según el tipo del hábito |
| `completado` | boolean | Si se alcanzó la meta del día |

---

## 4. Pantallas

### 4.1 Hoy (pantalla principal)
- Lista todos los hábitos programados para el día actual.
- Permite completar cada hábito con un tap (o ingresar valor para cantidad/duración).
- Micro-interacción y animación al marcar un hábito como completado.
- Indicador visual de progreso del día (ej. 3 de 5 hábitos completados).
- Permite navegar a días anteriores para registrar hábitos pasados.

### 4.2 Historial / Mapa de calor
- Vista por hábito individual.
- Grilla tipo GitHub: cada día es un cuadrado coloreado según si se cumplió la meta.
- Permite ver patrones reales a lo largo del tiempo (semanas, meses).

### 4.3 Hábitos
- Lista de todos los hábitos creados, agrupados por categoría.
- Acciones: crear, editar, archivar.

### 4.4 Categorías
- Lista de categorías con su ícono y color.
- Acciones: crear, editar (categorías predefinidas y personalizadas).

### 4.5 Ajustes
- **Notificaciones:** Configurar recordatorio diario con hora personalizable.
- **Exportar datos:** Genera un archivo JSON con todos los hábitos, categorías y registros.
- **Importar datos:** Carga un archivo JSON previamente exportado.

---

## 5. Features v1 (obligatorios)

- [ ] Pantalla "Hoy" con todos los hábitos del día
- [ ] Registro de hábitos tipo booleano, cantidad y duración
- [ ] Registro retroactivo de días pasados
- [ ] Frecuencia configurable por hábito (diaria, cada X días, semanal)
- [ ] Mapa de calor por hábito (vista tipo GitHub)
- [ ] Categorías con ícono y color (predefinidas + personalizables)
- [ ] Hábitos con nombre, ícono, color, tipo, meta y unidad
- [ ] Notificaciones locales (expo-notifications)
- [ ] Export / Import de datos en JSON
- [ ] Modo oscuro — paleta negro y naranja
- [ ] Micro-interacciones y animaciones al completar hábitos

---

## 6. Features v2 (pueden esperar)

- Estadísticas agregadas por categoría (ej. "80% de cumplimiento en Salud esta semana")
- Sistema de rachas y logros
- Widget en pantalla de inicio de Android
- Backup en la nube
- Hábitos con frecuencia más compleja (ej. X veces por semana sin importar qué días)
- Calificación subjetiva como tipo de registro (ej. calidad del sueño del 1 al 5)

---

## 7. Diseño y experiencia

### Paleta de colores
| Token | Valor |
|---|---|
| Fondo principal | `#0A0A0A` |
| Fondo secundario | `#141414` |
| Acento principal | `#FF6B00` (naranja) |
| Acento suave | `#FF6B0020` (naranja transparente) |
| Texto principal | `#FFFFFF` |
| Texto secundario | `#888888` |

### Principios de UX
- **Velocidad sobre completitud:** Registrar un hábito no puede requerir más de 2 taps.
- **Honestidad visual:** El mapa de calor muestra la realidad sin suavizarla.
- **Satisfacción táctil:** Completar un hábito debe sentirse bien — animación, haptic feedback, cambio de color.
- **Sin fricción:** La app arranca directo en la vista de hoy, sin onboarding ni pasos intermedios.

---

## 8. Definición de éxito

La app es exitosa cuando:

1. Se usa todos los días de forma natural, sin tener que recordar hacerlo.
2. Registrar todos los hábitos del día toma menos de 60 segundos.
3. De un vistazo a la pantalla de hoy se sabe exactamente qué falta completar.
4. El mapa de calor refleja honestamente el progreso real a lo largo del tiempo.
5. Completar un hábito produce una sensación de satisfacción genuina.

---

## 9. Estructura de datos (Zustand store)

> El proyecto usa **JavaScript puro (.js)**, no TypeScript.

```javascript
// store/habitoStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useHabitoStore = create(
  persist(
    (set, get) => ({
      categorias: [],
      habitos: [],
      registros: [],

      // Acciones — categorías
      agregarCategoria: (categoria) => set((state) => ({
        categorias: [...state.categorias, { id: crypto.randomUUID(), ...categoria }]
      })),
      editarCategoria: (id, datos) => set((state) => ({
        categorias: state.categorias.map((c) => c.id === id ? { ...c, ...datos } : c)
      })),

      // Acciones — hábitos
      agregarHabito: (habito) => set((state) => ({
        habitos: [...state.habitos, { id: crypto.randomUUID(), activo: true, ...habito }]
      })),
      editarHabito: (id, datos) => set((state) => ({
        habitos: state.habitos.map((h) => h.id === id ? { ...h, ...datos } : h)
      })),
      archivarHabito: (id) => set((state) => ({
        habitos: state.habitos.map((h) => h.id === id ? { ...h, activo: false } : h)
      })),

      // Acciones — registros
      registrarHabito: (habitoId, fecha, valor) => set((state) => ({
        registros: [...state.registros, { id: crypto.randomUUID(), habitoId, fecha, valor, completado: !!valor }]
      })),
      editarRegistro: (id, valor) => set((state) => ({
        registros: state.registros.map((r) => r.id === id ? { ...r, valor, completado: !!valor } : r)
      })),

      // Acciones — datos
      exportarJSON: () => JSON.stringify(get()),
      importarJSON: (json) => set(JSON.parse(json)),
    }),
    {
      name: 'habito-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHabitoStore;
```

---

*Documento generado como resultado de entrevista de descubrimiento de producto.*
*Última actualización: Mayo 2026*