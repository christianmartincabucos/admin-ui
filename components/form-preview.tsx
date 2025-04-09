"use client"

import type React from "react"

import { useState } from "react"
import type { Field, FieldType } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormPreviewProps {
  fields: Field[]
  fieldTypes: FieldType[]
}

export default function FormPreview({ fields, fieldTypes }: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    // Clear error when field is filled
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required) {
        const value = formValues[field.id]
        if (!value && value !== false) {
          newErrors[field.id] = "This field is required"
        }
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // In a real app, you would submit the form data here
      setSubmitted(true)
      // alert("Form submitted successfully!\n\n" + JSON.stringify(formValues, null, 2))
    }
  }

  // Sort fields by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order)

  if (sortedFields.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No fields have been added to this form yet.</p>
        <p className="mt-2">Exit preview mode and add some fields to get started.</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your submission.</p>
          <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Form Values:</h3>
            <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-60">
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </div>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="mr-2">
            Reset Form
          </Button>
        </div>
      </div>
    )
  }

  const renderField = (field: Field) => {
    const fieldType = fieldTypes.find((type) => type.id === field.type) || {
      id: field.type,
      label: field.type,
      icon: "text",
    }

    const hasError = !!errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <Input
            id={field.id}
            type={
              field.type === "number"
                ? "number"
                : field.type === "email"
                  ? "email"
                  : field.type === "phone"
                    ? "tel"
                    : "text"
            }
            placeholder={field.placeholder || ""}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
          />
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked === true)}
            />
            {errors[field.id] && <p className="text-red-500 text-sm ml-2">{errors[field.id]}</p>}
          </div>
        )
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
          />
        )
      case "textarea":
      case "list":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder || ""}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
          />
        )
      case "toggle":
        return (
          <Switch
            id={field.id}
            checked={formValues[field.id] || false}
            onCheckedChange={(checked) => handleInputChange(field.id, checked)}
          />
        )
      case "file":
        return (
          <Input
            id={field.id}
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
          />
        )
      case "select":
        return (
          <Select value={formValues[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder || ""}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
          />
        )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100"
    >
      {sortedFields.map((field) => (
        <div key={field.id} className="space-y-2">
          {field.type !== "checkbox" && (
            <Label htmlFor={field.id} className="font-medium text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}

          {renderField(field)}

          {field.type === "checkbox" && (
            <Label htmlFor={field.id} className="font-medium text-gray-800 ml-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}

          {errors[field.id] && field.type !== "checkbox" && <p className="text-red-500 text-sm">{errors[field.id]}</p>}

          {field.description && <p className="text-sm text-gray-500">{field.description}</p>}
        </div>
      ))}

      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
          Submit Form
        </Button>
      </div>
    </form>
  )
}
