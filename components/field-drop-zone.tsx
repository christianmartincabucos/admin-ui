"use client"

import { useState, useEffect } from "react"
import { useDrop } from "react-dnd"
import { Upload } from "lucide-react"
import type { Field, FieldType } from "@/lib/types"
import FieldItem from "./field-item"

interface FieldDropZoneProps {
  fields: Field[]
  fieldTypes: FieldType[]
  onFieldDrop: (field: Field) => void
  onFieldsChange: (fields: Field[]) => void
}

export default function FieldDropZone({ fields, fieldTypes, onFieldDrop, onFieldsChange }: FieldDropZoneProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  // Reset selected field when fields change (e.g., when switching forms)
  useEffect(() => {
    setSelectedFieldId(null)
  }, [fields])

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "FIELD_TYPE",
      drop: (item: Partial<Field>) => {
        if (item.type) {
          onFieldDrop({
            id: Date.now().toString(),
            type: item.type,
            label: item.label || `New ${item.type} Field`,
            required: item.required || false,
            order: fields.length,
          })
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [fields.length, onFieldDrop],
  ) // Add dependencies to ensure the drop handler updates

  const handleFieldMove = (dragIndex: number, hoverIndex: number) => {
    const updatedFields = [...fields]
    const draggedField = updatedFields[dragIndex]

    // Remove the dragged item
    updatedFields.splice(dragIndex, 1)
    // Insert it at the new position
    updatedFields.splice(hoverIndex, 0, draggedField)

    // Update order property for all fields
    const reorderedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index,
    }))

    onFieldsChange(reorderedFields)
  }

  const handleFieldDelete = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id)
    onFieldsChange(updatedFields)
    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  const handleFieldUpdate = (updatedField: Field) => {
    const updatedFields = fields.map((field) => (field.id === updatedField.id ? updatedField : field))
    onFieldsChange(updatedFields)
  }

  return (
    <div
      ref={drop}
      className={`min-h-[400px] border-2 border-dashed rounded-lg p-4 ${
        isOver ? "border-gray-400 bg-gray-50" : "border-gray-200"
      }`}
    >
      {fields.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
          <Upload className="w-16 h-16 mb-4" />
          <p className="text-lg">Drag fields here to build your form</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <FieldItem
                key={field.id}
                field={field}
                fieldType={fieldTypes.find((type) => type.id === field.type)}
                index={index}
                isSelected={field.id === selectedFieldId}
                onClick={() => setSelectedFieldId(field.id === selectedFieldId ? null : field.id)}
                onMove={handleFieldMove}
                onDelete={() => handleFieldDelete(field.id)}
                onUpdate={handleFieldUpdate}
              />
            ))}
        </div>
      )}
    </div>
  )
}
