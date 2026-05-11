import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";
import ModalRegistrar from "../components/ModalRegistrar";
import { hoy, addDias, formatFecha } from "@/utils/fecha";
import { getHabitosDelDia } from "../utils/habitoDelDia";

function BarraProgreso({ completados, total, color }) {
  const { colors } = useTheme();
  const pct = total === 0 ? 0 : completados / total;
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          {completados === total && total > 0 ? "¡Todo completado!" : `${completados} de ${total} completados`}
        </Text>
        <Text style={{ color: color, fontWeight: "700", fontSize: 13 }}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={{ height: 5, backgroundColor: colors.border, borderRadius: 3 }}>
        <View style={{
          height: 5, borderRadius: 3,
          backgroundColor: completados === total && total > 0 ? colors.success : color,
          width: `${pct * 100}%`,
        }} />
      </View>
    </View>
  );
}

function HabitoCard({ habito, registro, onToggleBooleano, onAbrirModal }) {
  const { colors } = useTheme();
  const completado = registro?.completado ?? false;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressBooleano = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onToggleBooleano();
  };

  const metaLabel = habito.tipo === "duracion"
    ? `Meta: ${habito.meta} min`
    : habito.tipo === "cantidad" && habito.meta != null
    ? `Meta: ${habito.meta}${habito.unidad ? ` ${habito.unidad}` : ""}`
    : null;

  const valorActual = registro?.valor;
  const valorLabel = valorActual != null
    ? habito.tipo === "duracion"
      ? `${valorActual} / ${habito.meta} min`
      : `${valorActual} / ${habito.meta ?? "—"}${habito.unidad ? ` ${habito.unidad}` : ""}`
    : null;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={{
        backgroundColor: completado ? habito.color + "12" : colors.card,
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: completado ? habito.color + "50" : colors.border,
        marginBottom: 10,
      }}>
        {/* Ícono */}
        <View style={{
          width: 46, height: 46, borderRadius: 23,
          backgroundColor: habito.color + "20",
          alignItems: "center", justifyContent: "center",
          marginRight: 14,
        }}>
          <IconLucide name={habito.icono} color={habito.color} size={22} />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            color: completado ? colors.textSecondary : colors.text,
            fontSize: 16, fontWeight: "600",
          }}>
            {habito.nombre}
          </Text>
          {habito.tipo === "booleano" && metaLabel == null ? null : (
            <Text style={{ color: completado ? habito.color : colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              {valorLabel ?? metaLabel}
            </Text>
          )}
        </View>

        {/* Botón acción */}
        {habito.tipo === "booleano" ? (
          <TouchableOpacity onPress={onPressBooleano} activeOpacity={0.7} style={{ padding: 4 }}>
            <View style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: completado ? habito.color : "transparent",
              borderWidth: 2,
              borderColor: completado ? habito.color : colors.border,
              alignItems: "center", justifyContent: "center",
            }}>
              {completado && <IconLucide name="Check" color="#FFF" size={16} />}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onAbrirModal}
            activeOpacity={0.7}
            style={{
              backgroundColor: completado ? habito.color : colors.primaryLight,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconLucide name={completado ? "Check" : "Plus"} color={completado ? "#FFF" : habito.color} size={14} />
            <Text style={{ color: completado ? "#FFF" : habito.color, fontSize: 13, fontWeight: "700" }}>
              {completado ? "Listo" : "Registrar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

export default function HoyScreen() {
  const { colors } = useTheme();
  const habitos = useHabitoStore((s) => s.habitos);
  const todosRegistros = useHabitoStore((s) => s.registros);
  const registrarHabito = useHabitoStore((s) => s.registrarHabito);
  const editarRegistro = useHabitoStore((s) => s.editarRegistro);
  const eliminarRegistro = useHabitoStore((s) => s.eliminarRegistro);

  const [fecha, setFecha] = useState(hoy());
  const [modalHabito, setModalHabito] = useState(null);
  const esHoy = fecha === hoy();

  const habitosDelDia = getHabitosDelDia(habitos, fecha);
  const registros = habitosDelDia.map((h) =>
    todosRegistros.find((r) => r.habitoId === h.id && r.fecha === fecha) ?? null
  );
  const completados = registros.filter((r) => r?.completado).length;

  const toggleBooleano = (habito, registro) => {
    if (registro) {
      eliminarRegistro(registro.id);
    } else {
      registrarHabito(habito.id, fecha, true);
    }
  };

  const guardarCantidad = (habito, registro, valor) => {
    if (registro) {
      editarRegistro(registro.id, valor);
    } else {
      registrarHabito(habito.id, fecha, valor);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        {/* Navegación de fecha */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setFecha((f) => addDias(f, -1))}
            style={{ padding: 8, marginRight: 4 }}
          >
            <IconLucide name="ChevronLeft" color={colors.text} size={22} />
          </TouchableOpacity>

          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", flex: 1, textAlign: "center" }}>
            {formatFecha(fecha)}
          </Text>

          <TouchableOpacity
            onPress={() => !esHoy && setFecha((f) => addDias(f, 1))}
            style={{ padding: 8, marginLeft: 4, opacity: esHoy ? 0.2 : 1 }}
            disabled={esHoy}
          >
            <IconLucide name="ChevronRight" color={colors.text} size={22} />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <BarraProgreso
          completados={completados}
          total={habitosDelDia.length}
          color={colors.primary}
        />
      </View>

      {/* Lista */}
      {habitosDelDia.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <IconLucide name="CalendarCheck" color={colors.border} size={56} />
          <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "600", marginTop: 16, textAlign: "center" }}>
            No hay hábitos para este día
          </Text>
          <Text style={{ color: colors.textPlaceHolder, fontSize: 14, marginTop: 8, textAlign: "center" }}>
            Creá hábitos en la pestaña Hábitos
          </Text>
        </View>
      ) : (
        <FlatList
          data={habitosDelDia}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item, index }) => {
            const registro = registros[index];
            return (
              <HabitoCard
                habito={item}
                registro={registro}
                onToggleBooleano={() => toggleBooleano(item, registro)}
                onAbrirModal={() => setModalHabito({ habito: item, registro })}
              />
            );
          }}
        />
      )}

      {/* Modal para cantidad/duración */}
      <ModalRegistrar
        visible={!!modalHabito}
        habito={modalHabito?.habito ?? null}
        valorActual={modalHabito?.registro?.valor ?? null}
        onGuardar={(valor) => guardarCantidad(modalHabito.habito, modalHabito.registro, valor)}
        onClose={() => setModalHabito(null)}
      />
    </SafeAreaView>
  );
}
