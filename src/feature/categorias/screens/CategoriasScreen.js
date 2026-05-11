import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "@/theme/useTheme";
import useHabitoStore from "@/feature/habitos/store/useHabitoStore";
import IconLucide from "@/components/IconLucide";
import ModalCategoria from "../components/ModalCategoria";

export default function CategoriasScreen() {
  const { colors } = useTheme();
  const categorias = useHabitoStore((s) => s.categorias);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const abrirCrear = () => {
    setCategoriaEditando(null);
    setModalVisible(true);
  };

  const abrirEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>
          Categorías
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 2 }}>
          {categorias.length} categorías
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => abrirEditar(item)}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Ícono */}
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: item.color + "20",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <IconLucide name={item.icono} color={item.color} size={22} />
            </View>

            {/* Nombre */}
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600", flex: 1 }}>
              {item.nombre}
            </Text>

            {/* Flecha */}
            <IconLucide name="ChevronRight" color={colors.iconSecondary} size={20} />
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={abrirCrear}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 8,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 10,
        }}
      >
        <IconLucide name="Plus" color="#FFFFFF" size={26} />
      </TouchableOpacity>

      <ModalCategoria
        visible={modalVisible}
        categoria={categoriaEditando}
        onClose={() => {
          setModalVisible(false);
          setCategoriaEditando(null);
        }}
      />
    </SafeAreaView>
  );
}
