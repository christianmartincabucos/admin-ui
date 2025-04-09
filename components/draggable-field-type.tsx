"use client"

import { useDrag } from "react-dnd"
import type { ReactNode } from "react"
import type { Field } from "@/lib/types"

interface DraggableFieldTypeProps {
  type: string
  label: string
  icon: ReactNode
}

export default function DraggableFieldType({ type, label, icon }: DraggableFieldTypeProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD_TYPE",
    item: {
      type,
      label,
      required: false,
    } as Partial<Field>,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 border rounded-md cursor-move transition-all ${
        isDragging ? "opacity-50" : ""
      } hover:border-violet-300 hover:bg-violet-50 group`}
    >
      <div className="mr-2 text-violet-500 bg-violet-50 p-1.5 rounded-md group-hover:bg-violet-100">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  )
}
