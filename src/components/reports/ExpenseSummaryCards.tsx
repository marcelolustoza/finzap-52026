import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Repeat, Receipt } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface ExpenseSummaryCardsProps {
  despesasFixas: number
  despesasVariaveis: number
  despesasTotal: number
}

export function ExpenseSummaryCards({ 
  despesasFixas, 
  despesasVariaveis, 
  despesasTotal 
}: ExpenseSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
          <Repeat className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(despesasFixas)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Variáveis</CardTitle>
          <CreditCard className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(despesasVariaveis)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
          <Receipt className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(despesasTotal)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
