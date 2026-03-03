import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { dimensionLabels, type Dimension } from "@/data/questions";

interface RadarChartProps {
  scores: Record<Dimension, number>;
}

export default function RadarChartComponent({ scores }: RadarChartProps) {
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];

  const data = dims.map((dim) => ({
    dimension: dimensionLabels[dim],
    score: scores[dim],
    fullMark: 100,
  }));

  return (
    <div className="w-full aspect-square max-w-[280px] mx-auto" data-testid="radar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid
            stroke="rgba(255,255,255,0.08)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            tickLine={false}
          />
          <Radar
            name="能力值"
            dataKey="score"
            stroke="#3B82F6"
            fill="url(#radarGradient)"
            fillOpacity={0.4}
            strokeWidth={2}
            dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#A855F7" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
