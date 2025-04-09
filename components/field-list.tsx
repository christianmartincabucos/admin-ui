"use client"

import { useMemo } from "react"
import type { Field } from "@/lib/types"
import FieldItem from "./field-item"

interface FieldListProps {
  fields: Field[]
  onFieldSelect: (field: Field) => void
  onFieldMove: (dragIndex: number, hoverIndex: number) => void
  onFieldDelete: (id: string) => void
  selectedFieldId: string | undefined
}

export default function FieldList({
  fields,
  onFieldSelect,
  onFieldMove,
  onFieldDelete,
  selectedFieldId,
}: FieldListProps) {
  // Sort fields by order
  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => a.order - b.order)
  }, [fields])

  return (
    <div className="space-y-2">
      {sortedFields.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No fields added yet. Add a field using the buttons above.</p>
      ) : (
        sortedFields.map((field, index) => (
          <FieldItem
            key={field.id}
            field={field}
            index={index}
            isSelected={field.id === selectedFieldId}
            onClick={() => onFieldSelect(field)}
            onMove={onFieldMove}
            onDelete={() => onFieldDelete(field.id)}
          />
        ))
      )}
    </div>
  )
}
