
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/currency'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  tipo_despesa: string | null
  category_id: string
  userid: string | null
  categorias?: {
    id: string
    nome: string
  }
}

interface DashboardChartsProps {
  transacoes: Transacao[]
}

const COLORS = ['#22c55e', '#7209b7', '#f72585']

const chartConfig = {
  despesasFixas: {
    label: "Despesas Fixas",
    color: "#7209b7",
  },
  despesasVariaveis: {
    label: "Despesas Variáveis",
    color: "#f72585",
  },
}

export function DashboardCharts({ transacoes }: DashboardChartsProps) {
  const getChartData = () => {
    const categorias: { [key: string]: { despesasFixas: number; despesasVariaveis: number } } = {}
    
    transacoes.forEach(t => {
      if (t.categorias?.nome && t.valor && t.tipo === 'despesa') {
        if (!categorias[t.categorias.nome]) {
          categorias[t.categorias.nome] = { despesasFixas: 0, despesasVariaveis: 0 }
        }
        
        if (t.tipo_despesa === 'fixa') {
          categorias[t.categorias.nome].despesasFixas += Math.abs(t.valor)
        } else if (t.tipo_despesa === 'variavel') {
          categorias[t.categorias.nome].despesasVariaveis += Math.abs(t.valor)
        }
      }
    })

    return Object.entries(categorias).map(([categoria, valores]) => ({
      categoria,
      despesasFixas: valores.despesasFixas,
      despesasVariaveis: valores.despesasVariaveis
    }))
  }

  const getPieData = () => {
    const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + (t.valor || 0), 0)
    const despesasFixas = transacoes.filter(t => t.tipo === 'despesa' && t.tipo_despesa === 'fixa').reduce((sum, t) => sum + (t.valor || 0), 0)
    const despesasVariaveis = transacoes.filter(t => t.tipo === 'despesa' && t.tipo_despesa === 'variavel').reduce((sum, t) => sum + (t.valor || 0), 0)

    return [
      { name: 'Receitas', value: receitas, fill: '#22c55e' },
      { name: 'Despesas Fixas', value: Math.abs(despesasFixas), fill: '#7209b7' },
      { name: 'Despesas Variáveis', value: Math.abs(despesasVariaveis), fill: '#f72585' }
    ]
  }

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + (t.valor || 0), 0)
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + (t.valor || 0), 0)
  const saldo = totalReceitas - totalDespesas

  const stats = {
    totalReceitas,
    totalDespesas,
    saldo,
    transacoesCount: transacoes.length,
    lembretesCount: 0 // This should come from props if needed
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gastos por Categoria (Fixas e Variáveis)</CardTitle>
            <CardDescription>
              Distribuição dos seus gastos no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 20, left: -20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="categoria" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="despesasFixas" fill="#7209b7" name="Despesas Fixas" />
                  <Bar dataKey="despesasVariaveis" fill="#f72585" name="Despesas Variáveis" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>
              Distribuição entre receitas, despesas fixas e variáveis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <div className="w-full max-w-[100%] md:max-w-[450px]">
              <ChartContainer config={chartConfig} className="h-[320px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={getPieData()}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius="75%"
                      dataKey="value"
                    >
                      {getPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ 
                        paddingLeft: '10px',
                        fontSize: '12px',
                        whiteSpace: 'pre-line'
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
          <CardDescription>
            Estatísticas detalhadas do período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Receitas</span>
              <span className="text-green-600 font-semibold">
                {formatCurrency(stats.totalReceitas)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Despesas</span>
              <span className="text-red-600 font-semibold">
                {formatCurrency(stats.totalDespesas)}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Saldo</span>
                <span className={`font-bold ${stats.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.saldo)}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Total de Transações</span>
                <span className="font-semibold">{stats.transacoesCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}