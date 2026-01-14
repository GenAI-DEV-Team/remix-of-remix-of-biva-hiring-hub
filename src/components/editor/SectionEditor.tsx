import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface Section {
  id: string;
  title: string;
  content: string;
  isCollapsible: boolean;
}

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [openSections, setOpenSections] = useState<string[]>(
    sections.map((s) => s.id)
  );

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "Tiêu đề mới",
      content: "<p>Nội dung...</p>",
      isCollapsible: false,
    };
    onChange([...sections, newSection]);
    setOpenSections([...openSections, newSection.id]);
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    onChange(newSections);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
    onChange(newSections);
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Các phần nội dung</h3>
        <Button size="sm" variant="outline" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm section
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Collapsible
            key={section.id}
            open={openSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="flex-1 font-medium text-gray-900 truncate">
                    {section.title || "Chưa có tiêu đề"}
                  </span>

                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeSection(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="p-4 space-y-4 border-t border-gray-200 bg-white">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tiêu đề (H2)</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(index, { title: e.target.value })
                        }
                        placeholder="Tiêu đề section"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ID (cho mục lục)</Label>
                      <Input
                        value={section.id}
                        onChange={(e) =>
                          updateSection(index, {
                            id: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "-"),
                          })
                        }
                        placeholder="section-id"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`collapsible-${section.id}`}
                      checked={section.isCollapsible}
                      onCheckedChange={(checked) =>
                        updateSection(index, { isCollapsible: checked })
                      }
                    />
                    <Label htmlFor={`collapsible-${section.id}`}>
                      Cho phép đóng/mở (Accordion)
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Nội dung</Label>
                    <RichTextEditor
                      content={section.content}
                      onChange={(html) =>
                        updateSection(index, { content: html })
                      }
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-3">
              Chưa có section nào
            </p>
            <Button variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm section đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
