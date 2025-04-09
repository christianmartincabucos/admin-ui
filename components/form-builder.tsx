"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import FormTabs from "./form-tabs"
import FormActions from "./form-actions"
import FieldTypesSection from "./field-types-section"
import FormCanvasSection from "./form-canvas-section"
import FormPreviewSection from "./form-preview-section"
import AddFieldTypeDialog from "./add-field-type-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Form, Field, FieldType } from "@/lib/types"

export default function FormBuilder() {
  // Initialize with default field types
  const [fieldTypes, setFieldTypes] = useLocalStorage<FieldType[]>("fieldTypes", [
    { id: "text", label: "Text Field", icon: "text" },
    { id: "checkbox", label: "Checkbox", icon: "checkbox" },
    { id: "date", label: "Date Picker", icon: "calendar" },
  ])

  // Initialize with default forms
  const [forms, setForms] = useLocalStorage<Form[]>("forms", [
    { id: "1", name: "Form 1", fields: [] },
    { id: "2", name: "Form 2", fields: [] },
  ])

  const [activeFormId, setActiveFormId] = useState<string>("1")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isAddFieldTypeOpen, setIsAddFieldTypeOpen] = useState(false)

  // Get the active form
  const activeForm = forms.find((form) => form.id === activeFormId) || forms[0]

  // Set the active form ID if it doesn't exist
  useEffect(() => {
    if (!activeForm) {
      setActiveFormId(forms[0]?.id || "1")
    }
  }, [activeForm, forms])

  const handleAddForm = () => {
    const newFormId = Date.now().toString()
    const newForm: Form = {
      id: newFormId,
      name: `Form ${forms.length + 1}`,
      fields: [],
    }
    setForms([...forms, newForm])
    setActiveFormId(newFormId)
  }

  const handleFieldDrop = (field: Field) => {
    if (!activeForm) return

    const newField = {
      ...field,
      id: Date.now().toString(),
      order: activeForm.fields.length,
    }

    const updatedFields = [...activeForm.fields, newField]

    const updatedForms = forms.map((form) => (form.id === activeFormId ? { ...form, fields: updatedFields } : form))

    setForms(updatedForms)
  }

  const handleFieldsChange = (updatedFields: Field[]) => {
    if (!activeForm) return

    const updatedForms = forms.map((form) => (form.id === activeFormId ? { ...form, fields: updatedFields } : form))

    setForms(updatedForms)
  }

  const handleAddFieldType = (newFieldType: FieldType) => {
    setFieldTypes([...fieldTypes, newFieldType])
    setIsAddFieldTypeOpen(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <FormTabs forms={forms} activeFormId={activeFormId} onFormSelect={setActiveFormId} />

          <FormActions
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            onAddForm={handleAddForm}
          />
        </div>

        {isPreviewMode ? (
          <FormPreviewSection form={activeForm} fieldTypes={fieldTypes} onExitPreview={() => setIsPreviewMode(false)} />
        ) : (
          <div className="space-y-6">
            <FieldTypesSection fieldTypes={fieldTypes} onAddFieldTypeClick={() => setIsAddFieldTypeOpen(true)} />

            <FormCanvasSection
              form={activeForm}
              fieldTypes={fieldTypes}
              onFieldDrop={handleFieldDrop}
              onFieldsChange={handleFieldsChange}
            />
          </div>
        )}

        <AddFieldTypeDialog
          isOpen={isAddFieldTypeOpen}
          onClose={() => setIsAddFieldTypeOpen(false)}
          onAdd={handleAddFieldType}
          existingTypes={fieldTypes}
        />
      </div>
    </DndProvider>
  )
}
