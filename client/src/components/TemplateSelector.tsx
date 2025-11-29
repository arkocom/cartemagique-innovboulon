import { TEMPLATES, Template } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
}

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const categories: Array<Template['category']> = ['classique', 'personnel', 'famille', 'entreprise'];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Choisissez un template</h2>
      <p className="text-muted-foreground">Sélectionnez une mise en page pré-conçue et personnalisez-la</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="space-y-2">
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <div className="text-xs bg-muted px-2 py-1 rounded w-fit">
                {template.category}
              </div>
              <div className="pt-2 space-y-1">
                {template.textBlocks.map((block, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    • {block.text.substring(0, 30)}...
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateSelect(template);
                }}
              >
                Utiliser ce template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
