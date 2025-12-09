import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Users, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface NameInputProps {
  names: string[];
  setNames: (names: string[]) => void;
  disabled: boolean;
}

export const NameInput = ({ names, setNames, disabled }: NameInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addName = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !names.includes(trimmed)) {
      setNames([...names, trimmed]);
      setInputValue('');
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split(/[\n\r,;]+/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const uniqueNames = [...new Set([...names, ...lines])];
      setNames(uniqueNames);
      toast.success(`เพิ่ม ${lines.length} รายชื่อเรียบร้อย!`);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="พิมพ์ชื่อที่นี่..."
          disabled={disabled}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
        />
        <Button 
          onClick={addName} 
          disabled={disabled || !inputValue.trim()}
          className="bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary/10"
          title="Import จากไฟล์"
        >
          <Upload className="w-5 h-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>

      {/* Names list */}
      <div className="bg-muted/50 rounded-lg p-3 max-h-60 overflow-y-auto border border-border">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm">รายชื่อทั้งหมด ({names.length} คน)</span>
        </div>
        
        {names.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-sm">
            ยังไม่มีรายชื่อ - เพิ่มชื่อเพื่อเริ่มเกม ❄️
          </p>
        ) : (
          <div className="space-y-2">
            {names.map((name, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-card px-3 py-2 rounded-md group hover:bg-muted transition-colors"
              >
                <span className="text-foreground font-medium">{index + 1}. {name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeName(index)}
                  disabled={disabled}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
