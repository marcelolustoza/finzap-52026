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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-full">
      <Card className="border-l-4 w-full max-w-full" style={{ borderLeftColor: '#7209b7' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Despesas Fixas</CardTitle>
          <Repeat className="h-4 w-4" style={{ color: '#7209b7' }} />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#7209b7' }}>
            {formatCurrency(despesasFixas)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 w-full max-w-full" style={{ borderLeftColor: '#f72585' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Despesas Variáveis</CardTitle>
          <CreditCard className="h-4 w-4" style={{ color: '#f72585' }} />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#f72585' }}>
            {formatCurrency(despesasVariaveis)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 w-full max-w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Total Despesas</CardTitle>
          <Receipt className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {formatCurrency(despesasTotal)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
