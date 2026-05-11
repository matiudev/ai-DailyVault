import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import IconLucide from "@/components/IconLucide";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import { ICONOS_UNICOS as ICONOS, COLORES } from "@/feature/habitos/constants/picker";

const IDS_PREDEFINIDAS = [
  "cat-salud", "cat-deporte", "cat-educacion",
  "cat-finanzas", "cat-bienestar", "cat-productividad",
];

export default function ModalCategoria({ visible, categoria, onClose }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const agregarCategoria = useHabitoStore((s) => s.agregarCategoria);
  const editarCategoria = useHabitoStore((s) => s.editarCategoria);
  const eliminarCategoria = useHabitoStore((s) => s.eliminarCategoria);

  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("Star");
  const [color, setColor] = useState("#FF6B00");

  const esEdicion = !!categoria;
  const esPredefinida = categoria ? IDS_PREDEFINIDAS.includes(categoria.id) : false;

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setIcono(categoria.icono);
      setColor(categoria.color);
    } else {
      setNombre("");
      setIcono("Star");
      setColor("#FF6B00");
    }
  }, [categoria, visible]);

  const guardar = () => {
    const nombreTrimmed = nombre.trim();
    if (!nombreTrimmed) return;
    if (esEdicion) {
      editarCategoria(categoria.id, { nombre: nombreTrimmed, icono, color });
    } else {
      agregarCategoria({ nombre: nombreTrimmed, icono, color });
    }
    onClose();
  };

  const eliminar = () => {
    eliminarCategoria(categoria.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.75)" }]} onPress={onClose} />
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 20,
              maxHeight: height * 0.88,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: "center", paddingVertical: 12 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>

            {/* Header con preview */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: color + "25",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <IconLucide name={icono} color={color} size={26} />
              </View>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700", flex: 1 }}>
                {esEdicion ? "Editar categoría" : "Nueva categoría"}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Nombre */}
              <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 8, letterSpacing: 0.5 }}>
                NOMBRE
              </Text>
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Salud mental"
                placeholderTextColor={colors.textPlaceHolder}
                style={{
                  backgroundColor: colors.cardSecondary,
                  borderRadius: 12,
                  padding: 14,
                  color: colors.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 24,
                }}
              />

              {/* Color */}
              <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, letterSpacing: 0.5 }}>
                COLOR
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                {COLORES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColor(c)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: c,
                      borderWidth: color === c ? 3 : 0,
                      borderColor: "#FFFFFF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {color === c && (
                      <IconLucide name="Check" color={c === "#FFFFFF" || c === "#94A3B8" ? "#000" : "#FFF"} size={16} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Ícono */}
              <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, letterSpacing: 0.5 }}>
                ÍCONO
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                {ICONOS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    onPress={() => setIcono(ic)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: icono === ic ? color + "25" : colors.cardSecondary,
                      borderWidth: 1,
                      borderColor: icono === ic ? color : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconLucide
                      name={ic}
                      color={icono === ic ? color : colors.iconSecondary}
                      size={22}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botones */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                {esEdicion && !esPredefinida && (
                  <TouchableOpacity
                    onPress={eliminar}
                    style={{
                      flex: 1,
                      padding: 15,
                      borderRadius: 14,
                      alignItems: "center",
                      backgroundColor: colors.danger + "15",
                      borderWidth: 1,
                      borderColor: colors.danger + "40",
                    }}
                  >
                    <Text style={{ color: colors.danger, fontWeight: "600", fontSize: 16 }}>
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={guardar}
                  style={{
                    flex: 2,
                    padding: 15,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: nombre.trim() ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
                    Guardar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}
