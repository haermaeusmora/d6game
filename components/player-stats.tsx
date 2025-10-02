import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Item } from "@/app/page"

type PlayerStatsProps = {
  health: number
  maxHealth: number
  damageMultiplier: number
  items: Item[]
}

export function PlayerStats({ health, maxHealth, damageMultiplier, items }: PlayerStatsProps) {
  const healthPercent = (health / maxHealth) * 100

  return (
    <Card className="p-4">
      <div className="grid md:grid-cols-3 gap-4">
        {}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Здоровье</span>
            <span className="font-semibold text-foreground">
              {health} / {maxHealth}
            </span>
          </div>
          <Progress value={healthPercent} className="h-2" />
        </div>

        {}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Множитель урона</span>
            <span className="font-semibold text-primary">×{damageMultiplier.toFixed(1)}</span>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Активные эффекты</div>
          <div className="flex flex-wrap gap-2">
            {items.length === 0 ? (
              <span className="text-xs text-muted-foreground">Нет эффектов</span>
            ) : (
              items.map((item) => (
                <span key={item.id} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {item.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
