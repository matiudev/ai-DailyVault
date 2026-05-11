import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";
import { ICONOS_UNICOS as ICONOS, COLORES } from "@/feature/habitos/constants/picker";

const DIAS = [
  { id: 1, label: "L" },
  { id: 2, label: "M" },
  { id: 3, label: "X" },
  { id: 4, label: "J" },
  { id: 5, label: "V" },
  { id: 6, label: "S" },
  { id: 7, label: "D" },
];

function SectionLabel({ title }) {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600", letterSpacing: 0.5, marginBottom: 10, marginTop: 24 }}>
      {title}
    </Text>
  );
}

export default function FormHabitoScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const habito = route.params?.habito ?? null;
  const esEdicion = !!habito;

  const categorias = useHabitoStore((s) => s.categorias);
  const agregarHabito = useHabitoStore((s) => s.agregarHabito);
  const editarHabito = useHabitoStore((s) => s.editarHabito);
  const archivarHabito = useHabitoStore((s) => s.archivarHabito);
  const restaurarHabito = useHabitoStore((s) => s.restaurarHabito);

  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState(null);
  const [color, setColor] = useState("#FF6B00");
  const [icono, setIcono] = useState("Star");
  const [tipo, setTipo] = useState("booleano");
  const [meta, setMeta] = useState("");
  const [unidad, setUnidad] = useState("");
  const [frecuenciaTipo, setFrecuenciaTipo] = useState("diaria");
  const [intervalo, setIntervalo] = useState("2");
  const [diasSemana, setDiasSemana] = useState([1, 2, 3, 4, 5]);
  const [modalCatVisible, setModalCatVisible] = useState(false);

  useEffect(() => {
    if (habito) {
      setNombre(habito.nombre);
      setCategoriaId(habito.categoriaId);
      setColor(habito.color);
      setIcono(habito.icono);
      setTipo(habito.tipo);
      setMeta(habito.meta != null ? String(habito.meta) : "");
      setUnidad(habito.unidad ?? "");
      setFrecuenciaTipo(habito.frecuencia.tipo);
      setIntervalo(String(habito.frecuencia.intervalo ?? 2));
      setDiasSemana(habito.frecuencia.diasSemana ?? [1, 2, 3, 4, 5]);
    }
  }, []);

  const categoriaSeleccionada = categorias.find((c) => c.id === categoriaId);

  const toggleDia = (id) => {
    setDiasSemana((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const puedeGuardar = nombre.trim().length > 0 && categoriaId != null;

  const guardar = () => {
    if (!puedeGuardar) return;

    const frecuencia =
      frecuenciaTipo === "diaria"
        ? { tipo: "diaria" }
        : frecuenciaTipo === "cada_x_dias"
        ? { tipo: "cada_x_dias", intervalo: parseInt(intervalo) || 2 }
        : { tipo: "semanal", diasSemana };

    const datos = {
      nombre: nombre.trim(),
      categoriaId,
      color,
      icono,
      tipo,
      meta: tipo !== "booleano" && meta ? parseFloat(meta) : null,
      unidad: tipo === "cantidad" ? unidad.trim() || null : null,
      frecuencia,
    };

    if (esEdicion) {
      editarHabito(habito.id, datos);
    } else {
      agregarHabito(datos);
    }
    navigation.goBack();
  };

  const input = (value, onChangeText, placeholder, options = {}) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textPlaceHolder}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
      {...options}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <IconLucide name="ArrowLeft" color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700", flex: 1 }}>
          {esEdicion ? "Editar hábito" : "Nuevo hábito"}
        </Text>
        <TouchableOpacity
          onPress={guardar}
          style={{
            backgroundColor: puedeGuardar ? colors.primary : colors.border,
            paddingHorizontal: 18,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Nombre */}
        <SectionLabel title="NOMBRE" />
        {input(nombre, setNombre, "Ej: Tomar agua")}

        {/* Categoría */}
        <SectionLabel title="CATEGORÍA" />
        <TouchableOpacity
          onPress={() => setModalCatVisible(true)}
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: categoriaSeleccionada ? categoriaSeleccionada.color + "60" : colors.border,
          }}
        >
          {categoriaSeleccionada ? (
            <>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: categoriaSeleccionada.color + "25", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <IconLucide name={categoriaSeleccionada.icono} color={categoriaSeleccionada.color} size={16} />
              </View>
              <Text style={{ color: colors.text, fontSize: 16, flex: 1 }}>{categoriaSeleccionada.nombre}</Text>
            </>
          ) : (
            <Text style={{ color: colors.textPlaceHolder, fontSize: 16, flex: 1 }}>Seleccionar categoría</Text>
          )}
          <IconLucide name="ChevronDown" color={colors.iconSecondary} size={18} />
        </TouchableOpacity>

        {/* Color */}
        <SectionLabel title="COLOR" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {COLORES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: c,
                borderWidth: color === c ? 3 : 0,
                borderColor: "#FFF",
                alignItems: "center", justifyContent: "center",
              }}
            >
              {color === c && <IconLucide name="Check" color={c === "#94A3B8" ? "#000" : "#FFF"} size={16} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ícono */}
        <SectionLabel title="ÍCONO" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {ICONOS.map((ic) => (
            <TouchableOpacity
              key={ic}
              onPress={() => setIcono(ic)}
              style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: icono === ic ? color + "25" : colors.card,
                borderWidth: 1,
                borderColor: icono === ic ? color : colors.border,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <IconLucide name={ic} color={icono === ic ? color : colors.iconSecondary} size={22} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Tipo */}
        <SectionLabel title="TIPO DE REGISTRO" />
        <View style={{ gap: 8 }}>
          {[
            { value: "booleano", label: "Sí / No", desc: "Se hizo o no se hizo", icon: "CheckSquare" },
            { value: "cantidad", label: "Cantidad", desc: "Valor numérico con unidad", icon: "Hash" },
            { value: "duracion", label: "Duración", desc: "Tiempo en minutos", icon: "Timer" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setTipo(opt.value)}
              style={{
                backgroundColor: tipo === opt.value ? color + "15" : colors.card,
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: tipo === opt.value ? color : colors.border,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: tipo === opt.value ? color + "25" : colors.cardSecondary, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <IconLucide name={opt.icon} color={tipo === opt.value ? color : colors.iconSecondary} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>{opt.label}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>{opt.desc}</Text>
              </View>
              {tipo === opt.value && <IconLucide name="Check" color={color} size={18} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Meta */}
        {tipo !== "booleano" && (
          <>
            <SectionLabel title={tipo === "duracion" ? "META (minutos)" : "META"} />
            <View style={{ flexDirection: "row", gap: 12 }}>
              {input(meta, setMeta, tipo === "duracion" ? "Ej: 30" : "Ej: 2", {
                keyboardType: "numeric",
                style: {
                  flex: tipo === "cantidad" ? 1 : undefined,
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 14,
                  color: colors.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              })}
              {tipo === "cantidad" && (
                <TextInput
                  value={unidad}
                  onChangeText={setUnidad}
                  placeholder="Unidad (ej: litros)"
                  placeholderTextColor={colors.textPlaceHolder}
                  style={{
                    flex: 1,
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 14,
                    color: colors.text,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              )}
            </View>
          </>
        )}

        {/* Frecuencia */}
        <SectionLabel title="FRECUENCIA" />
        <View style={{ gap: 8 }}>
          {[
            { value: "diaria", label: "Diaria", icon: "CalendarDays" },
            { value: "cada_x_dias", label: "Cada X días", icon: "Repeat" },
            { value: "semanal", label: "Días de la semana", icon: "CalendarRange" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setFrecuenciaTipo(opt.value)}
              style={{
                backgroundColor: frecuenciaTipo === opt.value ? color + "15" : colors.card,
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: frecuenciaTipo === opt.value ? color : colors.border,
              }}
            >
              <IconLucide name={opt.icon} color={frecuenciaTipo === opt.value ? color : colors.iconSecondary} size={20} />
              <Text style={{ color: colors.text, fontWeight: "500", fontSize: 15, marginLeft: 12, flex: 1 }}>{opt.label}</Text>
              {frecuenciaTipo === opt.value && <IconLucide name="Check" color={color} size={18} />}
            </TouchableOpacity>
          ))}
        </View>

        {frecuenciaTipo === "cada_x_dias" && (
          <>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12, marginBottom: 8 }}>Cada cuántos días</Text>
            {input(intervalo, setIntervalo, "2", { keyboardType: "numeric" })}
          </>
        )}

        {frecuenciaTipo === "semanal" && (
          <>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12, marginBottom: 10 }}>Días activos</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {DIAS.map((dia) => {
                const activo = diasSemana.includes(dia.id);
                return (
                  <TouchableOpacity
                    key={dia.id}
                    onPress={() => toggleDia(dia.id)}
                    style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: activo ? color : colors.card,
                      alignItems: "center", justifyContent: "center",
                      borderWidth: 1,
                      borderColor: activo ? color : colors.border,
                    }}
                  >
                    <Text style={{ color: activo ? "#FFF" : colors.textSecondary, fontWeight: "700", fontSize: 13 }}>
                      {dia.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Archivar / Restaurar */}
        {esEdicion && (
          <>
            <SectionLabel title="ESTADO" />
            <TouchableOpacity
              onPress={() => {
                if (habito.activo) archivarHabito(habito.id);
                else restaurarHabito(habito.id);
                navigation.goBack();
              }}
              style={{
                backgroundColor: habito.activo ? colors.warning + "15" : colors.success + "15",
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: habito.activo ? colors.warning + "40" : colors.success + "40",
              }}
            >
              <IconLucide name={habito.activo ? "Archive" : "ArchiveRestore"} color={habito.activo ? colors.warning : colors.success} size={20} />
              <Text style={{ color: habito.activo ? colors.warning : colors.success, fontWeight: "600", fontSize: 15, marginLeft: 12 }}>
                {habito.activo ? "Archivar hábito" : "Restaurar hábito"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Modal selector de categoría */}
      <Modal visible={modalCatVisible} transparent animationType="slide" onRequestClose={() => setModalCatVisible(false)}>
        <View style={{ flex: 1 }}>
          <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.75)" }]} onPress={() => setModalCatVisible(false)} />
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: insets.bottom + 20, maxHeight: height * 0.6 }}>
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
              </View>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Seleccionar categoría</Text>
              <FlatList
                data={categorias}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingBottom: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setCategoriaId(item.id); setModalCatVisible(false); }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: categoriaId === item.id ? item.color + "15" : colors.cardSecondary,
                      borderRadius: 12,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: categoriaId === item.id ? item.color : "transparent",
                    }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: item.color + "25", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <IconLucide name={item.icono} color={item.color} size={18} />
                    </View>
                    <Text style={{ color: colors.text, fontSize: 16, flex: 1 }}>{item.nombre}</Text>
                    {categoriaId === item.id && <IconLucide name="Check" color={item.color} size={18} />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
