export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RewriteStyle = 'conservative' | 'balanced' | 'bold'
export type ToneType = 'professional' | 'friendly' | 'creative' | 'technical'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_activity_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string
        }
      }
      cvs: {
        Row: {
          id: string
          user_id: string
          original_text: string
          parsed_sections: Json
          file_meta: Json
          created_at: string
          updated_at: string
          last_accessed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_text: string
          parsed_sections?: Json
          file_meta?: Json
          created_at?: string
          updated_at?: string
          last_accessed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_text?: string
          parsed_sections?: Json
          file_meta?: Json
          created_at?: string
          updated_at?: string
          last_accessed_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          cv_id: string
          job_title: string
          job_description: string
          rewrite_style: RewriteStyle
          tone: ToneType
          output_sections: Json
          diff_meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_id: string
          job_title: string
          job_description: string
          rewrite_style?: RewriteStyle
          tone?: ToneType
          output_sections?: Json
          diff_meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_id?: string
          job_title?: string
          job_description?: string
          rewrite_style?: RewriteStyle
          tone?: ToneType
          output_sections?: Json
          diff_meta?: Json | null
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          user_id: string
          current_month: string
          generation_count: number
          last_reset_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          current_month?: string
          generation_count?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_month?: string
          generation_count?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: SubscriptionStatus
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cover_letters: {
        Row: {
          id: string
          user_id: string
          generation_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          generation_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          generation_id?: string | null
          content?: string
          created_at?: string
        }
      }
    }
  }
}

// CV Section Types
export interface CVSection {
  type: 'name' | 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'publications' | 'hobbies'
  content: string
  order: number
}

export interface ParsedCV {
  sections: CVSection[]
  raw_text: string
}

// File metadata
export interface FileMetadata {
  name: string
  ext: string
  size: number
  upload_date: string
}

// Generation request/response types
export interface GenerationRequest {
  cv_id: string
  job_title: string
  job_description: string
  rewrite_style: RewriteStyle
  tone: ToneType
  custom_sections?: string[]
  output_language?: string
}

export interface GenerationResponse {
  id: string
  output_sections: CVSection[]
  diff_meta: DiffMetadata
}

export interface DiffMetadata {
  changes: Array<{
    section: string
    type: 'added' | 'removed' | 'modified'
    original: string
    new: string
    explanation: string
  }>
  summary?: string
}

// Usage and subscription types
export interface UsageInfo {
  current_count: number
  max_count: number
  reset_date: string
  has_subscription: boolean
}
