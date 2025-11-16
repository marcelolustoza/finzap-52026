
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { ReportTransaction } from '@/hooks/useReports'

interface ReportTableProps {
  transactions: ReportTransaction[]
}

export function ReportTable({ transactions }: ReportTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Detalhes das Transações</CardTitle>
      </CardHeader>
      <CardContent className="w-full max-w-full overflow-x-auto p-0 md:p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground px-4">
            Nenhuma transação encontrada com os filtros aplicados.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm">Data</TableHead>
                  <TableHead className="text-xs md:text-sm">Estabelecimento</TableHead>
                  <TableHead className="text-xs md:text-sm hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="text-xs md:text-sm">Tipo</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-xs md:text-sm whitespace-nowrap">{formatDate(transaction.quando || '')}</TableCell>
                    <TableCell className="text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        {transaction.tipo === 'receita' ? (
                          <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[120px] md:max-w-none">
                          {transaction.estabelecimento || 'Sem estabelecimento'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm hidden md:table-cell">
                      {transaction.categorias?.nome || 'Sem categoria'}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      <div className="flex flex-col gap-1">
                        <Badge variant={transaction.tipo === 'receita' ? 'default' : 'destructive'} className="text-xs">
                          {transaction.tipo}
                        </Badge>
                        {transaction.tipo === 'despesa' && transaction.tipo_despesa && (
                          <Badge 
                            style={{ 
                              backgroundColor: transaction.tipo_despesa === 'fixa' ? '#7209b7' : '#f72585',
                              color: 'white'
                            }}
                            className="text-xs"
                          >
                            {transaction.tipo_despesa === 'fixa' ? 'Fixa' : 'Variável'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium text-xs md:text-sm whitespace-nowrap ${
                      transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.tipo === 'receita' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.valor || 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
