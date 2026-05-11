import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import IconLucide from "@/components/IconLucide";

export default function ModalRegistrar({ visible, habito, valorActual, onGuardar, onClose }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [valor, setValor] = useState("");

  useEffect(() => {
    setValor(valorActual != null ? String(valorActual) : "");
  }, [visible, valorActual]);

  if (!habito) return null;

  const placeholder = habito.tipo === "duracion" ? "Minutos" : habito.unidad ?? "Valor";
  const label = habito.tipo === "duracion"
    ? `Meta: ${habito.meta} min`
    : habito.meta != null
    ? `Meta: ${habito.meta}${habito.unidad ? ` ${habito.unidad}` : ""}`
    : null;

  const guardar = () => {
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0) return;
    onGuardar(num);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            paddingHorizontal: 24, paddingBottom: 40 + insets.bottom, paddingTop: 8,
          }}>
            {/* Handle */}
            <View style={{ alignItems: "center", paddingBottom: 16 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>

            {/* Habit info */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: habito.color + "25",
                alignItems: "center", justifyContent: "center", marginRight: 12,
              }}>
                <IconLucide name={habito.icono} color={habito.color} size={22} />
              </View>
              <View>
                <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700" }}>{habito.nombre}</Text>
                {label && <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>{label}</Text>}
              </View>
            </View>

            {/* Input */}
            <TextInput
              value={valor}
              onChangeText={setValor}
              placeholder={placeholder}
              placeholderTextColor={colors.textPlaceHolder}
              keyboardType="decimal-pad"
              autoFocus
              style={{
                backgroundColor: colors.cardSecondary,
                borderRadius: 14,
                padding: 16,
                color: colors.text,
                fontSize: 28,
                fontWeight: "700",
                textAlign: "center",
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 16,
              }}
            />

            {/* Guardar */}
            <TouchableOpacity
              onPress={guardar}
              style={{
                backgroundColor: valor.trim() ? habito.color : colors.border,
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
