"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import {
  CalendarIcon,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  GripVertical,
  TextIcon,
  Trash2,
  ListIcon,
  ToggleLeft,
  FileText,
  Mail,
  Phone,
  Hash,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Field, DragItem, FieldType } from "@/lib/types"

interface FieldItemProps {
  field: Field
  fieldType?: FieldType
  index: number
  isSelected: boolean
  onClick: () => void
  onMove: (dragIndex: number, hoverIndex: number) => void
  onDelete: () => void
  onUpdate: (field: Field) => void
}

export default function FieldItem({
  field,
  fieldType,
  index,
  isSelected,
  onClick,
  onMove,
  onDelete,
  onUpdate,
}: FieldItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { index, id: field.id, type: field.type } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Set up drop target
  const [, drop] = useDrop({
    accept: "FIELD",
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  // Initialize drag and drop refs
  drag(drop(ref))

  // Get the appropriate icon for the field type
  const getFieldIcon = () => {
    const iconType = fieldType?.icon || field.type

    switch (iconType) {
      case "text":
        return <TextIcon className="h-4 w-4" />
      case "checkbox":
        return <CheckSquare className="h-4 w-4" />
      case "calendar":
      case "date":
        return <CalendarIcon className="h-4 w-4" />
      case "list":
        return <ListIcon className="h-4 w-4" />
      case "toggle":
        return <ToggleLeft className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      default:
        return <TextIcon className="h-4 w-4" />
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdate({
      ...field,
      [name]: value,
    })
  }

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({
      ...field,
      required: checked,
    })
  }

  return (
    <div
      ref={ref}
      className={`border rounded-md ${
        isSelected ? "border-gray-400" : "border-gray-200"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex items-center p-3 cursor-pointer" onClick={onClick}>
        <div className="mr-2 cursor-move">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <div className="mr-2 text-gray-500">{getFieldIcon()}</div>

        <div className="flex-1">
          <div className="font-medium">{field.label}</div>
          <div className="text-xs text-gray-500 capitalize">{fieldType?.label || field.type}</div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          className="p-1 text-gray-400 hover:text-gray-600 mr-1"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <Label htmlFor={`label-${field.id}`}>Label</Label>
              <Input id={`label-${field.id}`} name="label" value={field.label} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => handleRequiredChange(checked === true)}
              />
              <Label htmlFor={`required-${field.id}`}>Required field</Label>
            </div>

            {(field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "number") && (
              <div>
                <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                <Input
                  id={`placeholder-${field.id}`}
                  name="placeholder"
                  value={field.placeholder || ""}
                  onChange={handleChange}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
