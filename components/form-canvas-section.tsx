"use client"

import { Download, LayoutGrid, Upload } from "lucide-react"
import FieldDropZone from "./field-drop-zone"
import type { Form, Field, FieldType } from "@/lib/types"

interface FormCanvasSectionProps {
  form: Form
  fieldTypes: FieldType[]
  onFieldDrop: (field: Field) => void
  onFieldsChange: (fields: Field[]) => void
}

export default function FormCanvasSection({ form, fieldTypes, onFieldDrop, onFieldsChange }: FormCanvasSectionProps) {
  const handleExport = () => {
    if (!form) return

    const dataStr = JSON.stringify(form.fields, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${form.name.replace(/\s+/g, "_")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (!target.files?.length) return

      const file = target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const importedFields = JSON.parse(event.target?.result as string) as Field[]
          onFieldsChange(importedFields)
        } catch (error) {
          console.error("Error parsing imported file:", error)
          alert("Invalid file format")
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <LayoutGrid className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Form Canvas</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <button
            onClick={handleImport}
            className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
        </div>
      </div>

      <FieldDropZone
        fields={form?.fields || []}
        fieldTypes={fieldTypes}
        onFieldDrop={onFieldDrop}
        onFieldsChange={onFieldsChange}
      />
    </div>
  )
}
