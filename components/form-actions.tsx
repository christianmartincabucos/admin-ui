"use client"

import { Eye, Plus, ExternalLink } from "lucide-react"

interface FormActionsProps {
  isPreviewMode: boolean
  onTogglePreview: () => void
  onAddForm: () => void
}

export default function FormActions({ isPreviewMode, onTogglePreview, onAddForm }: FormActionsProps) {
  const openInNewWindow = () => {
    const url = window.location.href
    window.open(url, "_blank")
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={onTogglePreview}
        className={`flex items-center px-4 py-2 border rounded-md ${
          isPreviewMode ? "bg-gray-100" : "bg-white hover:bg-gray-50"
        }`}
      >
        <Eye className="w-4 h-4 mr-2" />
        {isPreviewMode ? "Exit Preview" : "Preview"}
      </button>

      <button onClick={onAddForm} className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
        <Plus className="w-4 h-4 mr-2" />
        Add Form
      </button>

      <button
        onClick={openInNewWindow}
        className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Open in New Window
      </button>
    </div>
  )
}
