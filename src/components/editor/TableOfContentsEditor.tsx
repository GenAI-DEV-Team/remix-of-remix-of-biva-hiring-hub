import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsEditorProps {
  items: TocItem[];
  onChange: (items: TocItem[]) => void;
}

export function TableOfContentsEditor({
  items,
  onChange,
}: TableOfContentsEditorProps) {
  const addItem = () => {
    const newItem: TocItem = {
      id: `section-${Date.now()}`,
      title: "Mục mới",
      level: 2,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<TocItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Mục lục</h3>
        <Button size="sm" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mục
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

            <Select
              value={String(item.level)}
              onValueChange={(value) =>
                updateItem(index, { level: Number(value) })
              }
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              className="flex-1 h-8"
            />

            <Input
              value={item.id}
              onChange={(e) =>
                updateItem(index, {
                  id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="ID"
              className="w-32 h-8 text-muted-foreground"
            />

            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => moveItem(index, "down")}
                disabled={index === items.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            Chưa có mục nào. Bấm &quot;Thêm mục&quot; để bắt đầu.
          </p>
        )}
      </div>
    </div>
  );
}
