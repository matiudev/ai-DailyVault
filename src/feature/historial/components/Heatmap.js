import { View, Text, useWindowDimensions } from "react-native";
import { useTheme } from "@/theme/useTheme";
import { generarGrilla } from "../utils/estadisticas";

const MESES_CORTO = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DIAS_LABEL = ["L","M","X","J","V","S","D"];
const SEMANAS = 16;
const GAP = 2;
const LABEL_WIDTH = 16;

export default function Heatmap({ habito, registros }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  // Card has 20px horizontal padding on each side (from parent), plus 16px inner padding each side
  const disponible = width - 40 - 32 - LABEL_WIDTH - GAP;
  const cellSize = Math.floor((disponible - GAP * (SEMANAS - 1)) / SEMANAS);

  const grid = generarGrilla(habito, registros, SEMANAS);

  const cellColor = (cell) => {
    if (cell.futuro) return "transparent";
    if (!cell.programado) return colors.background;
    if (!cell.completado) return colors.border;
    return habito.color;
  };

  // Month labels: show when month changes between columns
  const monthLabels = grid.map((col, i) => {
    const mes = col[0].mes;
    const prev = i === 0 ? -1 : grid[i - 1][0].mes;
    return mes !== prev ? MESES_CORTO[mes] : null;
  });

  return (
    <View>
      {/* Month labels */}
      <View style={{ flexDirection: "row", marginLeft: LABEL_WIDTH + GAP, marginBottom: 4 }}>
        {monthLabels.map((label, i) => (
          <View key={i} style={{ width: cellSize + GAP }}>
            {label && (
              <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: "600" }}>
                {label}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Grid */}
      <View style={{ flexDirection: "row" }}>
        {/* Day labels */}
        <View style={{ width: LABEL_WIDTH, marginRight: GAP, justifyContent: "space-between" }}>
          {DIAS_LABEL.map((d) => (
            <Text key={d} style={{ color: colors.textPlaceHolder, fontSize: 9, fontWeight: "600", height: cellSize + GAP, lineHeight: cellSize }}>
              {d}
            </Text>
          ))}
        </View>

        {/* Weeks */}
        {grid.map((col, wi) => (
          <View
            key={wi}
            style={{ flexDirection: "column", marginRight: wi < SEMANAS - 1 ? GAP : 0 }}
          >
            {col.map((cell, di) => (
              <View
                key={di}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 3,
                  backgroundColor: cellColor(cell),
                  marginBottom: di < 6 ? GAP : 0,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
