"use client"

import { Plus } from "lucide-react"
import DraggableFieldType from "./draggable-field-type"
import { getIconComponent } from "@/lib/utils"
import type { FieldType } from "@/lib/types"

interface FieldTypesSectionProps {
  fieldTypes: FieldType[]
  onAddFieldTypeClick: () => void
}

export default function FieldTypesSection({ fieldTypes, onAddFieldTypeClick }: FieldTypesSectionProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Field Types</h2>
        </div>
        <button
          onClick={onAddFieldTypeClick}
          className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Field Type
        </button>
      </div>

      <p className="text-gray-500 mb-4">Drag and drop these field types onto your form canvas</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {fieldTypes.map((fieldType) => (
          <DraggableFieldType
            key={fieldType.id}
            type={fieldType.id}
            label={fieldType.label}
            icon={getIconComponent(fieldType.icon)}
          />
        ))}
      </div>
    </div>
  )
}
