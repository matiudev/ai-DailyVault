import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Share,
  Alert,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";
import {
  pedirPermisos,
  programarNotificacionDiaria,
  cancelarNotificaciones,
} from "../utils/notificaciones";

function SectionLabel({ title }) {
  const { colors } = useTheme();
  return (
    <Text style={{
      color: colors.textSecondary, fontSize: 12, fontWeight: "700",
      letterSpacing: 1, marginBottom: 8, marginTop: 28, paddingHorizontal: 4,
    }}>
      {title}
    </Text>
  );
}

function SettingRow({ icon, label, desc, right, onPress, color }) {
  const { colors } = useTheme();
  const iconColor = color ?? colors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: "row", alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: 14, padding: 16, marginBottom: 8,
        borderWidth: 1, borderColor: colors.border,
      }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: iconColor + "20",
        alignItems: "center", justifyContent: "center", marginRight: 14,
      }}>
        <IconLucide name={icon} color={iconColor} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>{label}</Text>
        {desc && <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>{desc}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function AjustesScreen() {
  const { colors } = useTheme();

  const notificaciones = useHabitoStore((s) => s.notificaciones);
  const setNotificaciones = useHabitoStore((s) => s.setNotificaciones);
  const exportarJSON = useHabitoStore((s) => s.exportarJSON);
  const importarJSON = useHabitoStore((s) => s.importarJSON);
  const habitos = useHabitoStore((s) => s.habitos);
  const registros = useHabitoStore((s) => s.registros);
  const categorias = useHabitoStore((s) => s.categorias);

  const insets = useSafeAreaInsets();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [jsonTexto, setJsonTexto] = useState("");

  const horaStr = `${pad(notificaciones.horas)}:${pad(notificaciones.minutos)}`;

  const toggleNotificacion = async (value) => {
    if (value) {
      const ok = await pedirPermisos();
      if (!ok) {
        Alert.alert("Permisos requeridos", "Habilitá las notificaciones en los ajustes del sistema.");
        return;
      }
      await programarNotificacionDiaria(notificaciones.horas, notificaciones.minutos);
    } else {
      await cancelarNotificaciones();
    }
    setNotificaciones({ activo: value });
  };

  const onCambiarHora = async (_, date) => {
    setShowTimePicker(false);
    if (!date) return;
    const horas = date.getHours();
    const minutos = date.getMinutes();
    setNotificaciones({ horas, minutos });
    if (notificaciones.activo) {
      await programarNotificacionDiaria(horas, minutos);
    }
  };

  const exportar = async () => {
    const json = exportarJSON();
    await Share.share({
      message: json,
      title: "DailyVault — Export",
    });
  };

  const importar = () => {
    const texto = jsonTexto.trim();
    if (!texto) return;
    try {
      importarJSON(texto);
      setModalImport(false);
      setJsonTexto("");
      Alert.alert("Importación exitosa", "Los datos fueron restaurados correctamente.");
    } catch {
      Alert.alert("Error", "El JSON no es válido. Verificá el contenido e intentá de nuevo.");
    }
  };

  const timeDate = new Date();
  timeDate.setHours(notificaciones.horas, notificaciones.minutos, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700", paddingTop: 8 }}>
          Ajustes
        </Text>

        {/* Notificaciones */}
        <SectionLabel title="NOTIFICACIONES" />
        <SettingRow
          icon="Bell"
          label="Recordatorio diario"
          desc="Recibí un aviso para completar tus hábitos"
          onPress={null}
          right={
            <Switch
              value={notificaciones.activo}
              onValueChange={toggleNotificacion}
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={notificaciones.activo ? colors.primary : colors.iconSecondary}
            />
          }
        />
        {notificaciones.activo && (
          <SettingRow
            icon="Clock"
            label="Hora del recordatorio"
            desc={horaStr}
            onPress={() => setShowTimePicker(true)}
            right={<IconLucide name="ChevronRight" color={colors.iconSecondary} size={18} />}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={timeDate}
            mode="time"
            is24Hour
            display="default"
            onChange={onCambiarHora}
          />
        )}

        {/* Datos */}
        <SectionLabel title="DATOS" />
        <SettingRow
          icon="Upload"
          label="Exportar datos"
          desc="Compartir un archivo JSON con todos tus hábitos y registros"
          onPress={exportar}
          color={colors.info}
          right={<IconLucide name="ChevronRight" color={colors.iconSecondary} size={18} />}
        />
        <SettingRow
          icon="Download"
          label="Importar datos"
          desc="Restaurar desde un JSON exportado previamente"
          onPress={() => setModalImport(true)}
          color={colors.success}
          right={<IconLucide name="ChevronRight" color={colors.iconSecondary} size={18} />}
        />

        {/* Resumen */}
        <SectionLabel title="RESUMEN" />
        <View style={{
          backgroundColor: colors.card, borderRadius: 14,
          borderWidth: 1, borderColor: colors.border,
          overflow: "hidden",
        }}>
          {[
            { label: "Hábitos activos", value: habitos.filter(h => h.activo).length, icon: "ListChecks" },
            { label: "Categorías", value: categorias.length, icon: "Tag" },
            { label: "Registros totales", value: registros.length, icon: "CalendarCheck" },
          ].map((item, i, arr) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row", alignItems: "center",
                padding: 14,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <IconLucide name={item.icon} color={colors.primary} size={16} />
              <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1, marginLeft: 10 }}>
                {item.label}
              </Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15 }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <SectionLabel title="ACERCA DE" />
        <View style={{
          backgroundColor: colors.card, borderRadius: 14,
          borderWidth: 1, borderColor: colors.border, padding: 16,
          alignItems: "center",
        }}>
          <View style={{
            width: 52, height: 52, borderRadius: 14,
            backgroundColor: colors.primary + "20",
            alignItems: "center", justifyContent: "center", marginBottom: 10,
          }}>
            <IconLucide name="CalendarCheck" color={colors.primary} size={28} />
          </View>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 17 }}>DailyVault</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>Versión 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal importar */}
      <Modal visible={modalImport} transparent animationType="slide" onRequestClose={() => setModalImport(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" }}
          onPress={() => setModalImport(false)}
        >
          <Pressable onPress={() => {}}>
            <View style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              paddingHorizontal: 20, paddingBottom: 36 + insets.bottom,
            }}>
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
              </View>

              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 6 }}>
                Importar datos
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 16 }}>
                Pegá el contenido del JSON exportado previamente.
              </Text>

              <TextInput
                value={jsonTexto}
                onChangeText={setJsonTexto}
                placeholder='{ "categorias": [...], "habitos": [...], ... }'
                placeholderTextColor={colors.textPlaceHolder}
                multiline
                numberOfLines={6}
                style={{
                  backgroundColor: colors.cardSecondary,
                  borderRadius: 12, padding: 14,
                  color: colors.text, fontSize: 13,
                  borderWidth: 1, borderColor: colors.border,
                  height: 130, textAlignVertical: "top",
                  marginBottom: 16,
                  fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
                }}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => { setModalImport(false); setJsonTexto(""); }}
                  style={{ flex: 1, padding: 15, borderRadius: 14, alignItems: "center", backgroundColor: colors.cardSecondary, borderWidth: 1, borderColor: colors.border }}
                >
                  <Text style={{ color: colors.textSecondary, fontWeight: "600", fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={importar}
                  style={{ flex: 2, padding: 15, borderRadius: 14, alignItems: "center", backgroundColor: jsonTexto.trim() ? colors.success : colors.border }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Importar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
