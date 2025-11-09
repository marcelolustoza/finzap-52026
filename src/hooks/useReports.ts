
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export interface ReportTransaction {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  tipo_despesa: string | null
  category_id: string
  categorias?: {
    id: string
    nome: string
  }
}

export interface ReportFilters {
  startDate: string
  endDate: string
  type: string
  categoryId: string
  period: 'day' | 'month' | 'year' | 'custom'
}

export function useReports() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: '',
    period: 'month'
  })

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['report-transactions', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return []
      
      let query = supabase
        .from('transacoes')
        .select(`
          *,
          categorias!transacoes_category_id_fkey (
            id,
            nome
          )
        `)
        .eq('userid', user.id)

      // Apply date filters
      if (filters.startDate) {
        query = query.gte('quando', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('quando', filters.endDate)
      }

      // Apply type filter
      if (filters.type) {
        query = query.eq('tipo', filters.type)
      }

      // Apply category filter
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }

      const { data, error } = await query.order('quando', { ascending: false })

      if (error) {
        console.error('Erro ao buscar transações para relatório:', error)
        throw error
      }

      return data as ReportTransaction[]
    },
    enabled: !!user?.id,
  })

  // Calculate summary data
  const summaryData = useMemo(() => {
    const receitas = transactions
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const despesas = transactions
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const saldo = receitas - despesas

    // Calculate fixed and variable expenses
    const despesasFixas = transactions
      .filter(t => t.tipo_despesa === 'fixa' && t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const despesasVariaveis = transactions
      .filter(t => t.tipo_despesa === 'variavel' && t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)

    // Group by category
    const byCategory = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.categorias?.nome || 'Sem categoria'
      const valor = transaction.valor || 0
      
      if (!acc[categoryName]) {
        acc[categoryName] = { receitas: 0, despesas: 0, total: 0 }
      }
      
      if (transaction.tipo === 'receita') {
        acc[categoryName].receitas += valor
      } else {
        acc[categoryName].despesas += valor
      }
      
      acc[categoryName].total = acc[categoryName].receitas - acc[categoryName].despesas
      
      return acc
    }, {} as Record<string, { receitas: number; despesas: number; total: number }>)

    // Group by type for chart data
    const chartData = [
      { name: 'Receitas', value: receitas, color: '#22c55e' },
      { name: 'Despesas', value: despesas, color: '#ef4444' }
    ]

    // Group by month and expense type for trend analysis
    const monthlyExpenses = transactions
      .filter(t => t.tipo === 'despesa' && t.quando)
      .reduce((acc, transaction) => {
        const date = new Date(transaction.quando!)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const tipoDespesa = transaction.tipo_despesa || 'outros'
        
        if (!acc[monthKey]) {
          acc[monthKey] = { fixa: 0, variavel: 0, outros: 0 }
        }
        
        if (tipoDespesa === 'fixa') {
          acc[monthKey].fixa += transaction.valor || 0
        } else if (tipoDespesa === 'variavel') {
          acc[monthKey].variavel += transaction.valor || 0
        } else {
          acc[monthKey].outros += transaction.valor || 0
        }
        
        return acc
      }, {} as Record<string, { fixa: number; variavel: number; outros: number }>)

    // Convert to array and sort by date
    const trendData = Object.entries(monthlyExpenses)
      .map(([month, values]) => ({
        month,
        fixa: values.fixa,
        variavel: values.variavel,
        outros: values.outros
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months

    return {
      receitas,
      despesas,
      saldo,
      despesasFixas,
      despesasVariaveis,
      byCategory,
      chartData,
      trendData,
      totalTransactions: transactions.length
    }
  }, [transactions])

  return {
    transactions,
    isLoading,
    filters,
    setFilters,
    summaryData
  }
}
