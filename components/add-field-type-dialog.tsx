"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FieldType } from "@/lib/types"

interface AddFieldTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (fieldType: FieldType) => void
  existingTypes: FieldType[]
}

export default function AddFieldTypeDialog({ isOpen, onClose, onAdd, existingTypes }: AddFieldTypeDialogProps) {
  const [newFieldType, setNewFieldType] = useState<FieldType>({
    id: "",
    label: "",
    icon: "text",
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof FieldType, value: string) => {
    setNewFieldType((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
  }

  const handleSubmit = () => {
    // Validate fields
    if (!newFieldType.id.trim()) {
      setError("Field Type ID is required")
      return
    }

    if (!newFieldType.label.trim()) {
      setError("Field Type Label is required")
      return
    }

    // Check for duplicate IDs
    if (existingTypes.some((type) => type.id === newFieldType.id)) {
      setError("A field type with this ID already exists")
      return
    }

    // Add the new field type
    onAdd(newFieldType)

    // Reset form
    setNewFieldType({
      id: "",
      label: "",
      icon: "text",
    })
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Field Type</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Field Type ID</Label>
            <Input
              id="id"
              value={newFieldType.id}
              onChange={(e) => handleChange("id", e.target.value)}
              placeholder="e.g., email, number, textarea"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="label">Display Label</Label>
            <Input
              id="label"
              value={newFieldType.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="e.g., Email Field, Number Input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={newFieldType.icon} onValueChange={(value) => handleChange("icon", value)}>
              <SelectTrigger id="icon">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="toggle">Toggle</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Field Type</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
