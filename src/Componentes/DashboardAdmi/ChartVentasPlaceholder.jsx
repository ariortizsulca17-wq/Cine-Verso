// src/Componentes/DashboardAdmi/ChartVentasPlaceholder.jsx

import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

export default function ChartVentasPlaceholder({ data }) {
  const { theme } = useTheme();

  // 🎨 Colores dinámicos según tema
  const colors = {
    bgPlaceholder: theme === "dark" ? "bg-gray-700/30 border-gray-600" : "bg-gray-100 border-gray-300",
    textPrimary: theme === "dark" ? "#E5E7EB" : "#111827",
    textSecondary: theme === "dark" ? "#9CA3AF" : "#4B5563",
    grid: theme === "dark" ? "#374151" : "#E5E7EB",
    axis: theme === "dark" ? "#9CA3AF" : "#4B5563",
    tooltipBg: theme === "dark" ? "#1F2937" : "#FFFFFF",
    tooltipBorder: theme === "dark" ? "#374151" : "#D1D5DB",
    line: "#f472b6", // fuchsia mantiene identidad Cinverso
  };

  // 🟡 Placeholder si no hay datos
  if (!data || data.length === 0) {
    return (
      <div
        className={`h-64 flex flex-col items-center justify-center border border-dashed rounded-lg p-4 ${colors.bgPlaceholder}`}
      >
        <BarChartIcon className="w-10 h-10 text-cyan-500 mb-3" />
        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          Gráfico de Rendimiento
        </p>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          Esperando datos de ventas para visualizar.
        </p>
      </div>
    );
  }

  // 📈 Gráfico real
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />

          <XAxis
            dataKey="mes"
            stroke={colors.axis}
          />

          <YAxis
            stroke={colors.axis}
            tickFormatter={(value) =>
              `$${value.toLocaleString("es-CL", { minimumFractionDigits: 0 })}`
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "8px",
              color: colors.textPrimary,
            }}
            labelStyle={{
              color: colors.textPrimary,
              fontWeight: "bold",
            }}
            formatter={(value) => [
              `$${value.toLocaleString("es-CL", { minimumFractionDigits: 2 })}`,
              "Ventas",
            ]}
          />

          <Line
            type="monotone"
            dataKey="total"
            stroke={colors.line}
            strokeWidth={2}
            dot={{ fill: colors.line, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
