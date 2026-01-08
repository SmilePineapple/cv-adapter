import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { cvId } = await params

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        error: 'Unauthorized',
        auth_error: authError?.message 
      }, { status: 401 })
    }

    // Get the CV and verify ownership
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .select('id, user_id, parsed_sections, file_meta')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single()

    if (cvError || !cvData) {
      console.error('CV fetch error:', cvError)
      return NextResponse.json({ 
        error: 'CV not found',
        cv_error: cvError?.message,
        cv_id: cvId,
        user_id: user.id
      }, { status: 404 })
    }

    // Check if already migrated
    const { data: existingSections } = await supabase
      .from('cv_sections')
      .select('id')
      .eq('cv_id', cvId)
      .limit(1)

    if (existingSections && existingSections.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'CV already migrated' 
      })
    }

    // Migrate parsed_sections to cv_sections
    const parsedSections = cvData.parsed_sections?.sections || []
    console.log('Parsed sections to migrate:', parsedSections.length)
    console.log('Sample section:', parsedSections[0])
    
    // Map section types to valid enum values
    const mapSectionType = (type: string) => {
      const validTypes = [
        'name', 'contact', 'summary', 'experience', 'education', 
        'skills', 'certifications', 'projects', 'publications', 
        'hobbies', 'volunteer', 'awards', 'languages', 'custom'
      ]
      
      if (!type) return 'custom'
      
      // Direct match
      if (validTypes.includes(type)) return type
      
      // Common mappings
      const mappings: { [key: string]: string } = {
        'personal_details': 'contact',
        'work_experience': 'experience',
        'technical_skills': 'skills',
        'professional_experience': 'experience',
        'personal_info': 'contact',
        'contact_info': 'contact',
        'about': 'summary',
        'profile': 'summary',
        'bio': 'summary'
      }
      
      return mappings[type] || 'custom'
    }

    const sectionsToInsert = parsedSections.map((section: {type: string, title: string, content: string}, index: number) => {
      const sectionType = mapSectionType(section.type)
      return {
        cv_id: cvId,
        order_index: index,
        section_type: sectionType,
        title: section.type ? section.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Custom Section',
        content: {
          raw_content: section.content,
          format: 'text'
        },
        metadata: {
          ai_generated: false,
          private: false,
          migrated_from: 'parsed_sections',
          original_type: section.type
        }
      }
    })
    
    console.log('Sections to insert:', sectionsToInsert)

    // Handle empty sections case
    if (sectionsToInsert.length === 0) {
      console.log('No sections to migrate, creating default sections')
      const defaultSections = [
        {
          cv_id: cvId,
          order_index: 0,
          section_type: 'contact',
          title: 'Contact Information',
          content: { raw_content: 'Add your contact details here', format: 'text' },
          metadata: { ai_generated: false, private: false, migrated_from: 'default' }
        },
        {
          cv_id: cvId,
          order_index: 1,
          section_type: 'summary',
          title: 'Professional Summary',
          content: { raw_content: 'Add your professional summary here', format: 'text' },
          metadata: { ai_generated: false, private: false, migrated_from: 'default' }
        }
      ]
      
      const { error: defaultInsertError } = await supabase
        .from('cv_sections')
        .insert(defaultSections)
        
      if (defaultInsertError) {
        console.error('Default sections insert error:', defaultInsertError)
        return NextResponse.json({ 
          error: 'Failed to create default sections',
          details: defaultInsertError.message 
        }, { status: 500 })
      }
      
      sectionsToInsert.push(...defaultSections)
    } else {
      // Insert sections
      const { error: insertError } = await supabase
        .from('cv_sections')
        .insert(sectionsToInsert)

      if (insertError) {
        console.error('Migration insert error:', insertError)
        return NextResponse.json({ 
          error: 'Failed to migrate sections',
          details: insertError.message,
          sections_data: sectionsToInsert
        }, { status: 500 })
      }
    }

    // Create initial version
    const { error: versionError } = await supabase
      .from('cv_versions')
      .insert({
        cv_id: cvId,
        user_id: user.id,
        version_number: 1,
        title: 'Initial Version',
        template_id: 'modern',
        theme_settings: {
          font: 'Inter',
          fontSize: 12,
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            background: '#ffffff'
          }
        },
        sections_snapshot: sectionsToInsert,
        metadata: {
          created_from: 'migration',
          tokens_used: 0,
          model: 'migration'
        }
      })

    if (versionError) {
      console.error('Version creation error:', versionError)
      // Don't fail the migration if version creation fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'CV migrated successfully',
      sections_count: sectionsToInsert.length
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
