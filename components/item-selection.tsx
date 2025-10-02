"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Item } from "@/app/page"

type ItemSelectionProps = {
  items: Item[]
  onSelect: (item: Item) => void
  round: number
}

export function ItemSelection({ items, onSelect, round }: ItemSelectionProps) {
  const getItemIcon = (type: string) => {
    switch (type) {
      case "damage":
        return "⚔️"
      case "health":
        return "❤️"
      case "effect":
        return "✨"
      default:
        return "🎁"
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Выберите награду</h2>
        <p className="text-muted-foreground">Раунд {round} завершён</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-6 hover:border-primary transition-all cursor-pointer group"
            onClick={() => onSelect(item)}
          >
            <div className="text-center space-y-4">
              <div className="text-5xl">{getItemIcon(item.type)}</div>
              <div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                Выбрать
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
