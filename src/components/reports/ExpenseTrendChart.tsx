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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendência de Despesas (Últimos 6 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
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
