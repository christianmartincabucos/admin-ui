"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Field } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface FieldEditorProps {
  field: Field
  onFieldUpdate: (field: Field) => void
}

export default function FieldEditor({ field, onFieldUpdate }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<Field>(field)

  // Update local state when selected field changes
  useEffect(() => {
    setEditedField(field)
  }, [field])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedField((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditedField((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleBlur = () => {
    onFieldUpdate(editedField)
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Field Properties</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" value={editedField.label} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={editedField.required}
            onCheckedChange={(checked) => {
              handleCheckboxChange("required", checked === true)
              handleBlur()
            }}
          />
          <Label htmlFor="required">Required field</Label>
        </div>

        {editedField.type === "text" && (
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              name="placeholder"
              value={editedField.placeholder || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        )}

        {(editedField.type === "checkbox" || editedField.type === "text") && (
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedField.description || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
            />
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-gray-500">Field ID: {editedField.id}</p>
          <p className="text-xs text-gray-500">Field Type: {editedField.type}</p>
        </div>
      </div>
    </div>
  )
}
