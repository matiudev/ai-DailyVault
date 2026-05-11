import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CATEGORIAS_PREDEFINIDAS = [
  { id: "cat-salud", nombre: "Salud", icono: "Heart", color: "#EF4444" },
  { id: "cat-deporte", nombre: "Deporte", icono: "Dumbbell", color: "#F59E0B" },
  { id: "cat-educacion", nombre: "Educación", icono: "BookOpen", color: "#3B82F6" },
  { id: "cat-finanzas", nombre: "Finanzas", icono: "DollarSign", color: "#22C55E" },
  { id: "cat-bienestar", nombre: "Bienestar", icono: "Smile", color: "#A855F7" },
  { id: "cat-productividad", nombre: "Productividad", icono: "Zap", color: "#FF6B00" },
];

const useHabitoStore = create(
  persist(
    (set, get) => ({
      categorias: CATEGORIAS_PREDEFINIDAS,
      habitos: [],
      registros: [],
      notificaciones: { activo: false, horas: 8, minutos: 0 },

      setNotificaciones: (config) =>
        set((state) => ({ notificaciones: { ...state.notificaciones, ...config } })),

      // --- Categorías ---

      agregarCategoria: (categoria) =>
        set((state) => ({
          categorias: [
            ...state.categorias,
            { id: `cat-${Date.now()}`, ...categoria },
          ],
        })),

      editarCategoria: (id, datos) =>
        set((state) => ({
          categorias: state.categorias.map((c) =>
            c.id === id ? { ...c, ...datos } : c
          ),
        })),

      eliminarCategoria: (id) =>
        set((state) => ({
          categorias: state.categorias.filter((c) => c.id !== id),
        })),

      // --- Hábitos ---

      agregarHabito: (habito) =>
        set((state) => ({
          habitos: [
            ...state.habitos,
            { id: `hab-${Date.now()}`, activo: true, ...habito },
          ],
        })),

      editarHabito: (id, datos) =>
        set((state) => ({
          habitos: state.habitos.map((h) =>
            h.id === id ? { ...h, ...datos } : h
          ),
        })),

      archivarHabito: (id) =>
        set((state) => ({
          habitos: state.habitos.map((h) =>
            h.id === id ? { ...h, activo: false } : h
          ),
        })),

      restaurarHabito: (id) =>
        set((state) => ({
          habitos: state.habitos.map((h) =>
            h.id === id ? { ...h, activo: true } : h
          ),
        })),

      eliminarHabito: (id) =>
        set((state) => ({
          habitos: state.habitos.filter((h) => h.id !== id),
          registros: state.registros.filter((r) => r.habitoId !== id),
        })),

      // --- Registros ---

      registrarHabito: (habitoId, fecha, valor) => {
        const habito = get().habitos.find((h) => h.id === habitoId);
        if (!habito) return;

        const completado =
          habito.tipo === "booleano"
            ? !!valor
            : habito.meta != null
            ? Number(valor) >= habito.meta
            : !!valor;

        set((state) => ({
          registros: [
            ...state.registros,
            {
              id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              habitoId,
              fecha,
              valor,
              completado,
            },
          ],
        }));
      },

      editarRegistro: (id, valor) => {
        const registro = get().registros.find((r) => r.id === id);
        const habito = registro
          ? get().habitos.find((h) => h.id === registro.habitoId)
          : null;

        const completado =
          habito?.tipo === "booleano"
            ? !!valor
            : habito?.meta != null
            ? Number(valor) >= habito.meta
            : !!valor;

        set((state) => ({
          registros: state.registros.map((r) =>
            r.id === id ? { ...r, valor, completado } : r
          ),
        }));
      },

      eliminarRegistro: (id) =>
        set((state) => ({
          registros: state.registros.filter((r) => r.id !== id),
        })),

      // --- Queries ---

      getRegistroDelDia: (habitoId, fecha) =>
        get().registros.find(
          (r) => r.habitoId === habitoId && r.fecha === fecha
        ) ?? null,

      getRegistrosPorHabito: (habitoId) =>
        get().registros.filter((r) => r.habitoId === habitoId),

      getHabitosPorCategoria: (categoriaId) =>
        get().habitos.filter(
          (h) => h.categoriaId === categoriaId && h.activo
        ),

      // --- Export / Import ---

      exportarJSON: () => {
        const { categorias, habitos, registros } = get();
        return JSON.stringify({ categorias, habitos, registros }, null, 2);
      },

      importarJSON: (json) => {
        const datos = JSON.parse(json);
        set({
          categorias: datos.categorias ?? [],
          habitos: datos.habitos ?? [],
          registros: datos.registros ?? [],
        });
      },
    }),
    {
      name: "habito-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHabitoStore;
