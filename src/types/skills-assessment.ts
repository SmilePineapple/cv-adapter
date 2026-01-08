// TypeScript types for Skills Assessment feature

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type AssessmentStatus = 'draft' | 'in_progress' | 'completed' | 'expired'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'code' | 'scenario'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type SkillCategory = 'technical' | 'soft_skills' | 'industry_knowledge'
export type ResourceType = 'course' | 'article' | 'video' | 'book' | 'practice' | 'certification'

export interface SkillAssessment {
  id: string
  user_id: string
  job_role: string
  job_description?: string
  difficulty_level: DifficultyLevel
  total_questions: number
  time_limit_minutes: number
  status: AssessmentStatus
  created_at: string
  started_at?: string
  completed_at?: string
  updated_at: string
}

export interface AssessmentQuestion {
  id: string
  assessment_id: string
  question_number: number
  question_type: QuestionType
  skill_category: SkillCategory
  question_text: string
  options?: string[] // For multiple choice
  correct_answer: string
  explanation?: string
  points: number
  difficulty: QuestionDifficulty
  created_at: string
}

export interface AssessmentAnswer {
  id: string
  assessment_id: string
  question_id: string
  user_answer: string
  is_correct?: boolean
  points_earned: number
  time_spent_seconds?: number
  answered_at: string
}

export interface SkillBreakdown {
  [category: string]: number // e.g., {"technical": 80, "soft_skills": 90}
}

export interface SkillGap {
  skill: string
  current_level: number
  target_level: number
  gap_percentage: number
  priority: 'high' | 'medium' | 'low'
  resources: LearningResource[]
}

export interface AssessmentResult {
  id: string
  assessment_id: string
  user_id: string
  total_score: number
  max_score: number
  percentage_score: number
  time_taken_minutes?: number
  questions_correct: number
  questions_total: number
  skill_breakdown: SkillBreakdown
  strengths: string[]
  weaknesses: string[]
  skill_gaps: SkillGap[]
  recommendations: string[]
  created_at: string
}

export interface LearningResource {
  id: string
  skill_name: string
  resource_type: ResourceType
  title: string
  description?: string
  url?: string
  provider?: string
  difficulty?: DifficultyLevel
  estimated_hours?: number
  is_free: boolean
  rating?: number
  created_at: string
}

// API Request/Response types
export interface GenerateAssessmentRequest {
  job_role: string
  job_description?: string
  difficulty_level?: DifficultyLevel
  total_questions?: number
  time_limit_minutes?: number
}

export interface GenerateAssessmentResponse {
  assessment_id: string
  questions: AssessmentQuestion[]
  time_limit_minutes: number
  total_questions: number
}

export interface SubmitAnswerRequest {
  assessment_id: string
  question_id: string
  user_answer: string
  time_spent_seconds?: number
}

export interface SubmitAnswerResponse {
  answer_id: string
  is_correct: boolean
  points_earned: number
  explanation?: string
}

export interface CompleteAssessmentRequest {
  assessment_id: string
}

export interface CompleteAssessmentResponse {
  result: AssessmentResult
  next_steps: string[]
}

// UI Component Props
export interface QuestionCardProps {
  question: AssessmentQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer?: string
  onAnswerSelect: (answer: string) => void
  showCorrectAnswer?: boolean
  isReview?: boolean
}

export interface AssessmentTimerProps {
  timeLimit: number // in minutes
  onTimeUp: () => void
  isPaused?: boolean
}

export interface SkillGapChartProps {
  skillGaps: SkillGap[]
  onSkillClick?: (skill: string) => void
}

export interface LearningResourceCardProps {
  resource: LearningResource
  onEnroll?: () => void
}

export interface AssessmentProgressProps {
  currentQuestion: number
  totalQuestions: number
  answeredQuestions: number
  timeRemaining: number
}

// OpenAI API types for question generation
export interface AIQuestionGenerationPrompt {
  job_role: string
  job_description?: string
  difficulty_level: DifficultyLevel
  total_questions: number
  skill_categories: SkillCategory[]
}

export interface AIGeneratedQuestion {
  question_type: QuestionType
  skill_category: SkillCategory
  question_text: string
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty: QuestionDifficulty
  points: number
}

export interface AISkillGapAnalysis {
  strengths: string[]
  weaknesses: string[]
  skill_gaps: {
    skill: string
    current_level: number
    target_level: number
    priority: 'high' | 'medium' | 'low'
  }[]
  recommendations: string[]
}
