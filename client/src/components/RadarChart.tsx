import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { motion } from "framer-motion";

interface RadarChartProps {
  scores: Record<Dimension, number>;
  hideScores?: boolean;
}

export default function RadarChartComponent({ scores, hideScores = false }: RadarChartProps) {
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];

  const data = dims.map((dim) => ({
    dimension: hideScores ? dimensionLabels[dim] : `${dimensionLabels[dim]} ${scores[dim]}`,
    score: scores[dim],
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full aspect-square max-w-[280px] mx-auto gpu-accelerate"
      data-testid="radar-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid
            stroke="rgba(255,255,255,0.06)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            tickLine={false}
          />
          <Radar
            name="score"
            dataKey="score"
            stroke="var(--accent)"
            fill="rgba(var(--accent-rgb), 0.2)"
            fillOpacity={0.6}
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </motion.div>
  );
}
