"use client"

import { useState, useEffect } from "react"
import { Dice3D } from "@/components/dice-3d"
import { MonsterComponent } from "@/components/monster"
import { ItemSelection } from "@/components/item-selection"
import { PlayerStats } from "@/components/player-stats"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type Item = {
  id: string
  name: string
  type: "damage" | "health" | "effect"
  value: number
  description: string
  effectType?:
    | "sharpness"
    | "burning"
    | "poison"
    | "lifesteal"
    | "critical"
    | "thorns"
    | "dodge"
    | "armor"
    | "regeneration"
    | "fury"
    | "precision"
    | "vampiric_strike"
    | "chain_lightning"
    | "freeze"
    | "bleed"
    | "execute"
    | "shield"
    | "berserk"
    | "lucky"
}

export type Monster = {
  name: string
  ascii: string
  maxHealth: number
  currentHealth: number
}

const MONSTER_SYMBOLS = [
//  "▓",
//  "█",
//  "▒",
//  "░",
//  "▄",
//  "▀",
//  "■",
//  "□",
//  "●",
//  "○",
//  "◆",
//  "◇",
//  "★",
//  "☆",
//  "♦",
//  "♠",
//  "♣",
//  "♥",
//  "▲",
//  "▼",
//  "◀",
//  "▶",
//  "◢",
//  "◣",
//  "◤",
//  "◥",
//  "⬛",
//  "⬜",
//  "◼",
//  "◻",
//  "▪",
//  "▫",
//  "⚫",
//  "⚪",
//  "🞎",
//  "🞐",
//  "⬢",
//  "⬡",
  "'",
  "#",
  ".",
  ",",
  "[",
  "]",
  "'",
  "1",
]

export default function DiceGame() {
  const [round, setRound] = useState(1)
  const [playerHealth, setPlayerHealth] = useState(6)
  const [playerMaxHealth, setPlayerMaxHealth] = useState(6)
  const [monster, setMonster] = useState<Monster | null>(null)
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [showItemSelection, setShowItemSelection] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [damageMultiplier, setDamageMultiplier] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [burningDamage, setBurningDamage] = useState(0)

  useEffect(() => {
    spawnMonster()
  }, [])

  const generateMonsterName = () => {
    const prefixes = ["Тёмный", "Древний", "Проклятый", "Злобный", "Теневой", "Кровавый", "Мрачный"]
    const names = ["Голем", "Демон", "Дракон", "Призрак", "Скелет", "Зверь", "Страж", "Колдун", "Принц"]
    const suffixes = ["Бездны", "Хаоса", "Тьмы", "Пустоты", "Ночи", "Смерти", "Боли", "Ха-ха-ха-ха"]

    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
  }

  const generateMonsterAscii = () => {
    const width = 5 + Math.floor(Math.random() * 3)
    const height = 3 + Math.floor(Math.random() * 2)

    let ascii = ""
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        ascii += MONSTER_SYMBOLS[Math.floor(Math.random() * MONSTER_SYMBOLS.length)]
      }
      if (i < height - 1) ascii += "\n"
    }
    return ascii
  }

  const spawnMonster = () => {
    const baseHealth = 6 + Math.floor(Math.random() * 6) // 6-11
    const scaledHealth = baseHealth + (round - 1) * (2 + Math.floor(Math.random() * 3))

    const newMonster: Monster = {
      name: generateMonsterName(),
      ascii: generateMonsterAscii(),
      maxHealth: scaledHealth,
      currentHealth: scaledHealth,
    }

    setMonster(newMonster)
    setCombatLog([`Раунд ${round}: ${newMonster.name} появился!`])
  }

  const handleDiceRoll = (value: number) => {
    if (isRolling || !monster || gameOver) return

    setDiceValue(value)
    setIsRolling(true)

    setTimeout(() => {
      let totalDamage = Math.floor(value * damageMultiplier)

      const sharpnessItems = items.filter((i) => i.effectType === "sharpness")
      sharpnessItems.forEach((item) => {
        totalDamage += item.value
      })

      const precisionItems = items.filter((i) => i.effectType === "precision")
      precisionItems.forEach((item) => {
        totalDamage += item.value
      })

      const furyItems = items.filter((i) => i.effectType === "fury")
      furyItems.forEach((item) => {
        totalDamage = Math.floor(totalDamage * (1 + item.value / 100))
      })

      const criticalItems = items.filter((i) => i.effectType === "critical")
      let isCritical = false
      criticalItems.forEach((item) => {
        if (Math.random() * 100 < item.value) {
          totalDamage *= 2
          isCritical = true
        }
      })

      const luckyItems = items.filter((i) => i.effectType === "lucky")
      let isLucky = false
      luckyItems.forEach((item) => {
        if (Math.random() * 100 < item.value) {
          totalDamage += Math.floor(Math.random() * 3) + 2
          isLucky = true
        }
      })

      const executeItems = items.filter((i) => i.effectType === "execute")
      let isExecute = false
      executeItems.forEach((item) => {
        if (monster.currentHealth <= monster.maxHealth * 0.3) {
          totalDamage = Math.floor(totalDamage * (1 + item.value / 100))
          isExecute = true
        }
      })

      const newHealth = Math.max(0, monster.currentHealth - totalDamage)
      setMonster({ ...monster, currentHealth: newHealth })

      const newLog = [...combatLog]

      if (isCritical) {
        newLog.push(`💥 КРИТИЧЕСКИЙ УДАР! Вы нанесли ${totalDamage} урона!`)
      } else if (isExecute) {
        newLog.push(`⚔️ КАЗНЬ! Вы нанесли ${totalDamage} урона!`)
      } else if (isLucky) {
        newLog.push(`🍀 УДАЧА! Вы нанесли ${totalDamage} урона!`)
      } else {
        newLog.push(`Вы нанесли ${totalDamage} урона!`)
      }

      const lifestealItems = items.filter((i) => i.effectType === "lifesteal")
      if (lifestealItems.length > 0) {
        let totalLifesteal = 0
        lifestealItems.forEach((item) => {
          totalLifesteal += item.value
        })
        const healAmount = Math.min(totalLifesteal, playerMaxHealth - playerHealth)
        if (healAmount > 0) {
          setPlayerHealth((prev) => Math.min(playerMaxHealth, prev + healAmount))
          newLog.push(`💚 Вампиризм восстановил ${healAmount} HP!`)
        }
      }

      const vampiricStrikeItems = items.filter((i) => i.effectType === "vampiric_strike")
      if (vampiricStrikeItems.length > 0) {
        let totalPercent = 0
        vampiricStrikeItems.forEach((item) => {
          totalPercent += item.value
        })
        const healAmount = Math.min(Math.floor(totalDamage * (totalPercent / 100)), playerMaxHealth - playerHealth)
        if (healAmount > 0) {
          setPlayerHealth((prev) => Math.min(playerMaxHealth, prev + healAmount))
          newLog.push(`💜 Вампирический удар восстановил ${healAmount} HP!`)
        }
      }

      if (burningDamage > 0) {
        const burnDmg = Math.floor(burningDamage)
        const afterBurn = Math.max(0, newHealth - burnDmg)
        setMonster({ ...monster, currentHealth: afterBurn })
        newLog.push(`🔥 Горение нанесло ${burnDmg} урона!`)
      }

      const bleedItems = items.filter((i) => i.effectType === "bleed")
      if (bleedItems.length > 0) {
        let totalBleed = 0
        bleedItems.forEach((item) => {
          totalBleed += item.value
        })
        const bleedDmg = Math.floor(totalBleed)
        const afterBleed = Math.max(0, newHealth - bleedDmg)
        setMonster({ ...monster, currentHealth: afterBleed })
        newLog.push(`🩸 Кровотечение нанесло ${bleedDmg} урона!`)
      }

      const chainItems = items.filter((i) => i.effectType === "chain_lightning")
      if (chainItems.length > 0 && Math.random() < 0.3) {
        let totalChain = 0
        chainItems.forEach((item) => {
          totalChain += item.value
        })
        const chainDmg = Math.floor(totalChain)
        const afterChain = Math.max(0, newHealth - chainDmg)
        setMonster({ ...monster, currentHealth: afterChain })
        newLog.push(`⚡ Цепная молния нанесла ${chainDmg} урона!`)
      }

      // Check if monster is defeated
      if (newHealth <= 0) {
        newLog.push(`${monster.name} повержен!`)
        setCombatLog(newLog)
        setTimeout(() => {
          setShowItemSelection(true)
        }, 1000)
      } else {
        const dodgeItems = items.filter((i) => i.effectType === "dodge")
        let isDodged = false
        dodgeItems.forEach((item) => {
          if (Math.random() * 100 < item.value) {
            isDodged = true
          }
        })

        if (isDodged) {
          newLog.push(`🌀 Вы уклонились от атаки!`)
        } else {
          let monsterDamage = round === 1 ? 1 : 1 + Math.floor(Math.random() * 3)

          const armorItems = items.filter((i) => i.effectType === "armor")
          let totalArmorFlat = 0
          armorItems.forEach((item) => {
            totalArmorFlat += item.value
          })

          const shieldItems = items.filter((i) => i.effectType === "shield")
          let totalArmorPercent = 0
          shieldItems.forEach((item) => {
            totalArmorPercent += item.value
          })

          const armorFails = Math.random() < 0.2

          if (armorFails) {
            newLog.push(`⚠️ Броня не сработала!`)
          } else {
            monsterDamage = Math.max(1, monsterDamage - totalArmorFlat)

            if (totalArmorPercent > 0) {
              monsterDamage = Math.floor(monsterDamage * (1 - totalArmorPercent / 100))
            }

            monsterDamage = Math.max(1, monsterDamage)

            if (totalArmorFlat > 0 || totalArmorPercent > 0) {
              newLog.push(`🛡️ Броня снизила урон!`)
            }
          }

          const thornsItems = items.filter((i) => i.effectType === "thorns")
          if (thornsItems.length > 0) {
            let totalThorns = 0
            thornsItems.forEach((item) => {
              totalThorns += item.value
            })
            const thornsDmg = Math.floor(totalThorns)
            const afterThorns = Math.max(0, monster.currentHealth - thornsDmg)
            setMonster({ ...monster, currentHealth: afterThorns })
            newLog.push(`🌵 Шипы нанесли ${thornsDmg} урона в ответ!`)
          }

          const newPlayerHealth = Math.max(0, playerHealth - monsterDamage)
          setPlayerHealth(newPlayerHealth)
          newLog.push(`${monster.name} нанёс вам ${monsterDamage} урона!`)

          if (newPlayerHealth <= 0) {
            newLog.push("Вы погибли...")
            setGameOver(true)
          }
        }

        setCombatLog(newLog)
      }

      setIsRolling(false)
    }, 1000)
  }

  const generateItems = (): Item[] => {
    const itemPool: Item[] = []

    const isEarlyGame = round < 5

    const getBalancedFlat = () => {
      if (isEarlyGame) {
        return 1 + Math.floor(Math.random() * 5) 
      }
      return 1 + Math.floor(round * 0.5) + Math.floor(Math.random() * 5)
    }

    const getBalancedPercent = () => {
      if (isEarlyGame) {
        return 3 + Math.floor(Math.random() * 8) 
      }
      return 5 + Math.floor(round * 2) + Math.floor(Math.random() * 10)
    }

    const damageValue = getBalancedPercent()
    itemPool.push({
      id: Math.random().toString(),
      name: "Зачарованный клинок",
      type: "damage",
      value: damageValue / 100,
      description: `+${damageValue}% урона`,
    })

    const healthValue = getBalancedFlat()
    itemPool.push({
      id: Math.random().toString(),
      name: "Зелье исцеления",
      type: "health",
      value: healthValue,
      description: `+${healthValue} здоровья`,
    })

    const effectDefinitions = [
      {
        type: "sharpness" as const,
        name: "Острота",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `+${v} фиксированного урона`,
      },
      {
        type: "burning" as const,
        name: "Горение",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `${v} урона каждый ход`,
      },
      {
        type: "poison" as const,
        name: "Яд",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `${v} урона со временем`,
      },
      {
        type: "lifesteal" as const,
        name: "Вампиризм",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `Восстанавливает ${v} HP при атаке`,
      },
      {
        type: "critical" as const,
        name: "Критический удар",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `${v}% шанс удвоить урон`,
      },
      {
        type: "thorns" as const,
        name: "Шипы",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `Наносит ${v} урона атакующему`,
      },
      {
        type: "dodge" as const,
        name: "Уклонение",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `${v}% шанс уклониться`,
      },
      {
        type: "armor" as const,
        name: "Броня",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `Снижает урон на ${v}`,
      },
      {
        type: "regeneration" as const,
        name: "Регенерация",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `Восстанавливает ${v} HP каждый ход`,
      },
      {
        type: "fury" as const,
        name: "Ярость",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `+${v}% к урону`,
      },
      {
        type: "precision" as const,
        name: "Точность",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `+${v} к урону`,
      },
      {
        type: "vampiric_strike" as const,
        name: "Вампирический удар",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `Восстанавливает ${v}% от урона`,
      },
      {
        type: "chain_lightning" as const,
        name: "Цепная молния",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `30% шанс нанести ${v} доп. урона`,
      },
      {
        type: "freeze" as const,
        name: "Заморозка",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `${v}% шанс заморозить врага`,
      },
      {
        type: "bleed" as const,
        name: "Кровотечение",
        getValue: getBalancedFlat,
        getDescription: (v: number) => `${v} урона кровотечением`,
      },
      {
        type: "execute" as const,
        name: "Казнь",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `+${v}% урона по врагам с HP < 30%`,
      },
      {
        type: "shield" as const,
        name: "Щит",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `Снижает урон на ${v}%`,
      },
      {
        type: "berserk" as const,
        name: "Берсерк",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `+${v}% урона при HP < 50%`,
      },
      {
        type: "lucky" as const,
        name: "Удача",
        getValue: getBalancedPercent,
        getDescription: (v: number) => `${v}% шанс доп. урона`,
      },
    ]

    const shuffledEffects = effectDefinitions.sort(() => Math.random() - 0.5)

    for (let i = 0; i < Math.min(10, shuffledEffects.length); i++) {
      const effect = shuffledEffects[i]
      const value = effect.getValue()

      itemPool.push({
        id: Math.random().toString(),
        name: effect.name,
        type: "effect",
        value,
        effectType: effect.type,
        description: effect.getDescription(value),
      })
    }

    return itemPool.sort(() => Math.random() - 0.5).slice(0, 3)
  }

  const handleItemSelect = (item: Item) => {
    if (item.type === "damage") {
      setDamageMultiplier((prev) => prev + item.value)
    } else if (item.type === "health") {
      setPlayerHealth((prev) => Math.min(playerMaxHealth + item.value, prev + item.value))
      setPlayerMaxHealth((prev) => prev + item.value)
    } else if (item.type === "effect") {
      if (item.effectType === "burning") {
        setBurningDamage((prev) => prev + item.value)
      }
      setItems((prev) => [...prev, item])
    }

    setShowItemSelection(false)
    setRound((prev) => prev + 1)
    setTimeout(() => {
      spawnMonster()
    }, 500)
  }

  const resetGame = () => {
    setRound(1)
    setPlayerHealth(6)
    setPlayerMaxHealth(6)
    setDamageMultiplier(1)
    setItems([])
    setBurningDamage(0)
    setGameOver(false)
    setCombatLog([])
    spawnMonster()
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-4xl font-bold text-destructive mb-4">Игра окончена</h1>
          <p className="text-xl mb-2">Вы дошли до раунда {round}</p>
          <p className="text-muted-foreground mb-6">Побеждено монстров: {round - 1}</p>
          <Button onClick={resetGame} size="lg" className="w-full">
            Начать заново
          </Button>
        </Card>
      </div>
    )
  }

  if (showItemSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ItemSelection items={generateItems()} onSelect={handleItemSelect} round={round} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-3 md:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:gap-6">
          {}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">Кубик Судьбы</h1>
            <div className="text-right">
              <p className="text-xs md:text-sm text-muted-foreground">Раунд</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{round}</p>
            </div>
          </div>

          {}
          <PlayerStats
            health={playerHealth}
            maxHealth={playerMaxHealth}
            damageMultiplier={damageMultiplier}
            items={items}
          />

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {}
            <div className="flex items-center justify-center order-1">
              {monster && <MonsterComponent monster={monster} />}
            </div>

            {}
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6 order-2">
              <Dice3D onRoll={handleDiceRoll} disabled={isRolling || gameOver} />
              {diceValue && (
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">Последний бросок</p>
                  <p className="text-3xl md:text-4xl font-bold text-primary">{diceValue}</p>
                </div>
              )}
            </div>
          </div>

          {}
          <Card className="p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-2">Журнал боя</h3>
            <div className="space-y-1 max-h-24 md:max-h-32 overflow-y-auto">
              {combatLog.slice(-5).map((log, i) => (
                <p key={i} className="text-xs md:text-sm text-foreground">
                  {log}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
