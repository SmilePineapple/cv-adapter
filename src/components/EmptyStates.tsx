'use client'

import { Upload, FileText, Mail, Sparkles, Plus, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  secondaryActionLabel?: string
  secondaryActionHref?: string
  onSecondaryAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && (actionHref || onAction) && (
          actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {actionLabel}
            </button>
          )
        )}
        {secondaryActionLabel && (secondaryActionHref || onSecondaryAction) && (
          secondaryActionHref ? (
            <Link
              href={secondaryActionHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              {secondaryActionLabel}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          ) : (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              {secondaryActionLabel}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )
        )}
      </div>
    </div>
  )
}

/**
 * No CVs uploaded
 */
export function NoCVsEmptyState() {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8 text-gray-400" />}
      title="No CVs yet"
      description="Upload your first CV to get started with AI-powered tailoring and optimization."
      actionLabel="Upload CV"
      actionHref="/upload"
      secondaryActionLabel="See Example"
      secondaryActionHref="/examples"
    />
  )
}

/**
 * No generations
 */
export function NoGenerationsEmptyState() {
  return (
    <EmptyState
      icon={<Sparkles className="w-8 h-8 text-gray-400" />}
      title="Ready to create your first tailored CV?"
      description="Upload a CV and enter a job title to let AI optimize it for you in seconds."
      actionLabel="Get Started"
      actionHref="/upload"
    />
  )
}

/**
 * No cover letters
 */
export function NoCoverLettersEmptyState() {
  return (
    <EmptyState
      icon={<Mail className="w-8 h-8 text-gray-400" />}
      title="No cover letters yet"
      description="Generate a personalized cover letter to complement your CV and stand out to employers."
      actionLabel="Create Cover Letter"
      actionHref="/cover-letter"
      secondaryActionLabel="Learn More"
      secondaryActionHref="/cover-letter-tips"
    />
  )
}

/**
 * No search results
 */
export function NoSearchResultsEmptyState({ query, onClear }: { query: string, onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search or browse all items.`}
      actionLabel="Clear Search"
      onAction={onClear}
    />
  )
}

/**
 * Upload prompt
 */
export function UploadPromptEmptyState() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <Upload className="w-10 h-10 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Upload Your CV
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Drag and drop your CV here, or click to browse. Supports PDF, DOCX, and TXT files.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <label className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg cursor-pointer">
          <Upload className="w-5 h-5 mr-2" />
          Choose File
          <input type="file" className="hidden" accept=".pdf,.docx,.txt" />
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Maximum file size: 10MB
      </p>
    </div>
  )
}

/**
 * Feature locked (requires upgrade)
 */
export function FeatureLockedEmptyState({ featureName }: { featureName: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Unlock {featureName}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Upgrade to Pro for £2.99/month to access {featureName} and unlimited CV generations.
      </p>
      <Link
        href="/subscription"
        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg text-lg"
      >
        <Sparkles className="w-6 h-6 mr-2" />
        Upgrade to Pro
      </Link>
      <p className="text-sm text-gray-500 mt-4">
        Cancel anytime • No hidden fees
      </p>
    </div>
  )
}
