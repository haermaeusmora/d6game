import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type MonsterProps = {
  monster: {
    name: string
    ascii: string
    maxHealth: number
    currentHealth: number
  }
}

export function MonsterComponent({ monster }: MonsterProps) {
  const healthPercent = (monster.currentHealth / monster.maxHealth) * 100

  return (
    <Card className="p-6 w-full max-w-md">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">{monster.name}</h2>
          <div className="font-mono text-3xl text-accent whitespace-pre leading-tight">{monster.ascii}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Здоровье</span>
            <span className="font-semibold text-foreground">
              {monster.currentHealth} / {monster.maxHealth}
            </span>
          </div>
          <Progress value={healthPercent} className="h-3" />
        </div>
      </div>
    </Card>
  )
}
