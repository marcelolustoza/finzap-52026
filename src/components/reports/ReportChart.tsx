
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'

interface ChartData {
  name: string
  value: number
  color: string
}

interface CategoryData {
  [key: string]: {
    receitas: number
    despesas: number
    total: number
  }
}

interface ReportChartProps {
  chartData: ChartData[]
  categoryData: CategoryData
}

const chartConfig = {
  receitas: {
    label: "Receitas",
    color: "#22c55e",
  },
  despesas: {
    label: "Despesas", 
    color: "#ef4444",
  },
}

export function ReportChart({ chartData, categoryData }: ReportChartProps) {
  // Prepare category chart data with fixed and variable expenses
  const categoryChartData = Object.entries(categoryData).map(([name, data]) => ({
    category: name,
    receitas: data.receitas,
    despesas: data.despesas,
  }))

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Distribuição por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center w-full max-w-full">
          <ChartContainer config={chartConfig} className="h-[350px] md:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Receitas vs Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-full overflow-x-auto">
          <ChartContainer config={chartConfig} className="h-[400px] md:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 20, right: 10, left: 0, bottom: 100 }}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
