import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface TrendData {
  month: string
  fixa: number
  variavel: number
  outros: number
}

interface ExpenseTrendChartProps {
  trendData: TrendData[]
}

const chartConfig = {
  fixa: {
    label: 'Fixas',
    color: '#f97316'
  },
  variavel: {
    label: 'Variáveis',
    color: '#a855f7'
  },
  outros: {
    label: 'Outros',
    color: '#6b7280'
  }
}

export function ExpenseTrendChart({ trendData }: ExpenseTrendChartProps) {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
  }

  const formattedData = trendData.map(item => ({
    ...item,
    monthLabel: formatMonth(item.month)
  }))

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base">Tendência de Despesas (Últimos 6 Meses)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full max-w-full overflow-x-auto">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="fixa" fill={chartConfig.fixa.color} name={chartConfig.fixa.label} />
              <Bar dataKey="variavel" fill={chartConfig.variavel.color} name={chartConfig.variavel.label} />
              <Bar dataKey="outros" fill={chartConfig.outros.color} name={chartConfig.outros.label} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
