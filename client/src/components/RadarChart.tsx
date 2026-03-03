import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { motion } from "framer-motion";

interface RadarChartProps {
  scores: Record<Dimension, number>;
}

export default function RadarChartComponent({ scores }: RadarChartProps) {
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];

  const data = dims.map((dim) => ({
    dimension: `${dimensionLabels[dim]} ${scores[dim]}`,
    score: scores[dim],
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full aspect-square max-w-[300px] mx-auto gpu-accelerate"
      data-testid="radar-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid
            stroke="rgba(255,255,255,0.05)"
            className="dark:opacity-100 opacity-30"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            tickLine={false}
          />
          <Radar
            name="score"
            dataKey="score"
            stroke="var(--accent-blue)"
            fill="rgba(var(--accent-blue-rgb), 0.25)"
            fillOpacity={0.6}
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent-blue)', strokeWidth: 0 }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </motion.div>
  );
}
