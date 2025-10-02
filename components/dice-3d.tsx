"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Dice3DProps = {
  onRoll: (value: number) => void
  disabled?: boolean
}

export function Dice3D({ onRoll, disabled }: Dice3DProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [currentFace, setCurrentFace] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const rollDice = () => {
    if (disabled || isRolling) return

    setIsRolling(true)

    const finalValue = Math.floor(Math.random() * 6) + 1

    const faceRotations = {
      1: { x: 0, y: 0 }, 
      2: { x: 0, y: 180 }, 
      3: { x: 0, y: 90 }, 
      4: { x: 0, y: -90 }, 
      5: { x: 90, y: 0 }, 
      6: { x: -90, y: 0 }, 
    }

    const targetRotation = faceRotations[finalValue as keyof typeof faceRotations]

    const extraSpins = 3 + Math.floor(Math.random() * 2)
    const finalX = targetRotation.x + 360 * extraSpins
    const finalY = targetRotation.y + 360 * extraSpins

    setRotation({ x: finalX, y: finalY })
    setCurrentFace(finalValue)

    setTimeout(() => {
      setIsRolling(false)
      onRoll(finalValue)
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div className="relative" style={{ perspective: "1000px" }}>
        <div
          id="dice-cube"
          className="relative w-24 h-24 md:w-32 md:h-32"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          {}
          {[1, 2, 3, 4, 5, 6].map((face) => (
            <div
              key={face}
              className="absolute w-24 h-24 md:w-32 md:h-32 bg-card border-2 border-primary/50 rounded-lg flex items-center justify-center glow-pulse"
              style={{
                transform: getDiceFaceTransform(face),
                backfaceVisibility: "hidden",
              }}
            >
              <div className="grid grid-cols-3 gap-1 md:gap-2 p-3 md:p-4 w-full h-full">{renderDots(face)}</div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={rollDice}
        disabled={disabled || isRolling}
        size="lg"
        className="min-w-[160px] md:min-w-[200px] text-base md:text-lg font-semibold"
      >
        {isRolling ? "Бросок..." : "Бросить кубик"}
      </Button>
    </div>
  )
}

function getDiceFaceTransform(face: number): string {
  const transforms = {
    1: "rotateY(0deg) translateZ(48px)", 
    2: "rotateY(180deg) translateZ(48px)", 
    3: "rotateY(90deg) translateZ(48px)", 
    4: "rotateY(-90deg) translateZ(48px)", 
    5: "rotateX(-90deg) translateZ(48px)", 
    6: "rotateX(90deg) translateZ(48px)", 
  }
  return transforms[face as keyof typeof transforms]
}

function renderDots(face: number) {
  const dotPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  }

  const positions = dotPositions[face as keyof typeof dotPositions]

  return Array.from({ length: 9 }).map((_, i) => (
    <div key={i} className="flex items-center justify-center">
      {positions.includes(i) && (
        <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
      )}
    </div>
  ))
}
