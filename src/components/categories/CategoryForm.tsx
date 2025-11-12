
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategories, Category } from '@/hooks/useCategories';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [nome, setNome] = useState('');
  const [tags, setTags] = useState('');
  const [tipoDespesa, setTipoDespesa] = useState('');
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategories();

  useEffect(() => {
    if (category) {
      setNome(category.nome);
      setTags(category.tags || '');
      setTipoDespesa(category.tipo_despesa || '');
    } else {
      setNome('');
      setTags('');
      setTipoDespesa('');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    try {
      if (category) {
        updateCategory({
          id: category.id,
          updates: { 
            nome: nome.trim(), 
            tags: tags.trim(),
            tipo_despesa: tipoDespesa || null
          },
        });
      } else {
        createCategory({
          nome: nome.trim(),
          tags: tags.trim(),
          tipo_despesa: tipoDespesa || null
        });
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Categoria *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Alimentação"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipo_despesa">Tipo de Despesa Padrão (opcional)</Label>
            <Select value={tipoDespesa} onValueChange={setTipoDespesa}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixa">Fixa</SelectItem>
                <SelectItem value="variavel">Variável</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Define o tipo padrão para transações desta categoria
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (opcional)</Label>
            <Textarea
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Restaurantes, Supermercados, Cafés"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Separe as tags com vírgulas para melhor organização
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!nome.trim() || isCreating || isUpdating}
            >
              {category ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
