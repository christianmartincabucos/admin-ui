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
      className={`flex items-center p-3 border rounded-md cursor-move hover:bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="mr-2 text-gray-700">{icon}</div>
      <span>{label}</span>
    </div>
  )
}
