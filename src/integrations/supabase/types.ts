export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academy_submissions: {
        Row: {
          ai_feedback: string | null
          ai_verdict: string | null
          brief: string | null
          course_id: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_note: string | null
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submission_file_path: string | null
          submission_text: string | null
          submission_url: string | null
          updated_at: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_verdict?: string | null
          brief?: string | null
          course_id: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submission_file_path?: string | null
          submission_text?: string | null
          submission_url?: string | null
          updated_at?: string
        }
        Update: {
          ai_feedback?: string | null
          ai_verdict?: string | null
          brief?: string | null
          course_id?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submission_file_path?: string | null
          submission_text?: string | null
          submission_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_submissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          portfolio_url: string | null
          role_applied: string
          status: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          portfolio_url?: string | null
          role_applied: string
          status?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          portfolio_url?: string | null
          role_applied?: string
          status?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          approach: string | null
          category: string | null
          challenge: string | null
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          is_published: boolean
          live_url: string | null
          result: string | null
          slug: string
          sort_order: number
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approach?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          live_url?: string | null
          result?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approach?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          live_url?: string | null
          result?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          created_at: string
          id: string
          issue_date: string
          student_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          created_at?: string
          id?: string
          issue_date?: string
          student_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          created_at?: string
          id?: string
          issue_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_pricing: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          currency: string
          id: string
          region: string
          updated_at: string
        }
        Insert: {
          amount?: number
          course_id: string
          created_at?: string
          currency?: string
          id?: string
          region: string
          updated_at?: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          currency?: string
          id?: string
          region?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_pricing_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          checklist: string | null
          common_mistakes: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          id: string
          is_published: boolean
          learning_objectives: string | null
          overview: string | null
          preparation: string | null
          price_amount: number | null
          project_brief: string | null
          project_theme: string | null
          rubric: Json
          school: string | null
          slug: string
          source_video_id: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          checklist?: string | null
          common_mistakes?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_published?: boolean
          learning_objectives?: string | null
          overview?: string | null
          preparation?: string | null
          price_amount?: number | null
          project_brief?: string | null
          project_theme?: string | null
          rubric?: Json
          school?: string | null
          slug: string
          source_video_id?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          checklist?: string | null
          common_mistakes?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_published?: boolean
          learning_objectives?: string | null
          overview?: string | null
          preparation?: string | null
          price_amount?: number | null
          project_brief?: string | null
          project_theme?: string | null
          rubric?: Json
          school?: string | null
          slug?: string
          source_video_id?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          source: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          enrolled_at: string
          id: string
          progress: number
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_status: {
        Row: {
          created_at: string
          currency: string
          held_amount: number
          held_at: string | null
          id: string
          invoice_id: string
          refunded_amount: number
          refunded_at: string | null
          released_amount: number
          released_at: string | null
          state: Database["public"]["Enums"]["escrow_state"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          held_amount?: number
          held_at?: string | null
          id?: string
          invoice_id: string
          refunded_amount?: number
          refunded_at?: string | null
          released_amount?: number
          released_at?: string | null
          state?: Database["public"]["Enums"]["escrow_state"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          held_amount?: number
          held_at?: string | null
          id?: string
          invoice_id?: string
          refunded_amount?: number
          refunded_at?: string | null
          released_amount?: number
          released_at?: string | null
          state?: Database["public"]["Enums"]["escrow_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_status_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          answers: Json
          course_id: string
          id: string
          passed: boolean | null
          questions: Json
          score: number | null
          started_at: string
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          answers?: Json
          course_id: string
          id?: string
          passed?: boolean | null
          questions?: Json
          score?: number | null
          started_at?: string
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          answers?: Json
          course_id?: string
          id?: string
          passed?: boolean | null
          questions?: Json
          score?: number | null
          started_at?: string
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          issued_date: string | null
          paid_at: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount?: number
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issued_date?: string | null
          paid_at?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_date?: string | null
          paid_at?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string
          lesson_id: string
          student_id: string
        }
        Insert: {
          completed_at?: string
          lesson_id: string
          student_id: string
        }
        Update: {
          completed_at?: string
          lesson_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          end_seconds: number | null
          id: string
          is_free_preview: boolean
          is_required: boolean
          knowledge_check: string | null
          notes: string | null
          position: number
          practice_task: string | null
          start_seconds: number | null
          title: string
          updated_at: string
          video_id: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          end_seconds?: number | null
          id?: string
          is_free_preview?: boolean
          is_required?: boolean
          knowledge_check?: string | null
          notes?: string | null
          position?: number
          practice_task?: string | null
          start_seconds?: number | null
          title: string
          updated_at?: string
          video_id?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          end_seconds?: number | null
          id?: string
          is_free_preview?: boolean
          is_required?: boolean
          knowledge_check?: string | null
          notes?: string | null
          position?: number
          practice_task?: string | null
          start_seconds?: number | null
          title?: string
          updated_at?: string
          video_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          currency: string
          id: string
          provider: string
          reference: string
          status: string
          student_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          currency: string
          id?: string
          provider?: string
          reference: string
          status?: string
          student_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          currency?: string
          id?: string
          provider?: string
          reference?: string
          status?: string
          student_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          note: string | null
          processed_at: string | null
          requested_at: string
          status: Database["public"]["Enums"]["payout_status"]
          talent_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          talent_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          talent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pm_invitations: {
        Row: {
          accepted_at: string | null
          accepted_user_id: string | null
          created_at: string
          email: string
          expires_at: string
          full_name: string
          id: string
          invited_by: string | null
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_user_id?: string | null
          created_at?: string
          email: string
          expires_at: string
          full_name: string
          id?: string
          invited_by?: string | null
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_user_id?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string
          id?: string
          invited_by?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
      pm_review_access: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          pm_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          pm_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          pm_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_name: string | null
          body: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          body?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          body?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          project_id: string
          size_bytes: number | null
          uploader_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          project_id: string
          size_bytes?: number | null
          uploader_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          project_id?: string
          size_bytes?: number | null
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          project_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          project_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          brief: string | null
          budget_amount: number | null
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          pm_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          brief?: string | null
          budget_amount?: number | null
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          pm_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          brief?: string | null
          budget_amount?: number | null
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          pm_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stage_courses: {
        Row: {
          checklist: string | null
          common_mistakes: string | null
          learning_objectives: string | null
          overview: string | null
          preparation: string | null
          project_brief: string | null
          rubric: Json | null
          source_video_id: string | null
          title: string
        }
        Insert: {
          checklist?: string | null
          common_mistakes?: string | null
          learning_objectives?: string | null
          overview?: string | null
          preparation?: string | null
          project_brief?: string | null
          rubric?: Json | null
          source_video_id?: string | null
          title: string
        }
        Update: {
          checklist?: string | null
          common_mistakes?: string | null
          learning_objectives?: string | null
          overview?: string | null
          preparation?: string | null
          project_brief?: string | null
          rubric?: Json | null
          source_video_id?: string | null
          title?: string
        }
        Relationships: []
      }
      stage_lessons: {
        Row: {
          content: string | null
          course_title: string
          end_seconds: number | null
          is_free_preview: boolean
          knowledge_check: string | null
          position: number
          practice_task: string | null
          start_seconds: number | null
          title: string
          video_id: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_title: string
          end_seconds?: number | null
          is_free_preview?: boolean
          knowledge_check?: string | null
          position: number
          practice_task?: string | null
          start_seconds?: number | null
          title: string
          video_id?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_title?: string
          end_seconds?: number | null
          is_free_preview?: boolean
          knowledge_check?: string | null
          position?: number
          practice_task?: string | null
          start_seconds?: number | null
          title?: string
          video_id?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      student_projects: {
        Row: {
          ai_feedback: string | null
          ai_verdict: string | null
          brief: string
          course_id: string
          created_at: string
          id: string
          reviewer_note: string | null
          status: string
          student_id: string
          submission_file_path: string | null
          submission_text: string | null
          submission_url: string | null
          updated_at: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_verdict?: string | null
          brief: string
          course_id: string
          created_at?: string
          id?: string
          reviewer_note?: string | null
          status?: string
          student_id: string
          submission_file_path?: string | null
          submission_text?: string | null
          submission_url?: string | null
          updated_at?: string
        }
        Update: {
          ai_feedback?: string | null
          ai_verdict?: string | null
          brief?: string
          course_id?: string
          created_at?: string
          id?: string
          reviewer_note?: string | null
          status?: string
          student_id?: string
          submission_file_path?: string | null
          submission_text?: string | null
          submission_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_projects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      talent_earnings: {
        Row: {
          available_amount: number
          created_at: string
          currency: string
          id: string
          paid_amount: number
          pending_amount: number
          talent_id: string
          updated_at: string
        }
        Insert: {
          available_amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_amount?: number
          pending_amount?: number
          talent_id: string
          updated_at?: string
        }
        Update: {
          available_amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_amount?: number
          pending_amount?: number
          talent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      talent_invitations: {
        Row: {
          accepted_at: string | null
          accepted_user_id: string | null
          created_at: string
          email: string
          expires_at: string
          full_name: string
          id: string
          invited_by: string | null
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_user_id?: string | null
          created_at?: string
          email: string
          expires_at: string
          full_name: string
          id?: string
          invited_by?: string | null
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_user_id?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string
          id?: string
          invited_by?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
      talent_profiles: {
        Row: {
          availability: Database["public"]["Enums"]["talent_availability"]
          bio: string | null
          created_at: string
          currency: string
          headline: string | null
          hourly_rate: number | null
          id: string
          skills: string[]
          updated_at: string
          user_id: string
          vetting_status: Database["public"]["Enums"]["vetting_status"]
        }
        Insert: {
          availability?: Database["public"]["Enums"]["talent_availability"]
          bio?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          skills?: string[]
          updated_at?: string
          user_id: string
          vetting_status?: Database["public"]["Enums"]["vetting_status"]
        }
        Update: {
          availability?: Database["public"]["Enums"]["talent_availability"]
          bio?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          skills?: string[]
          updated_at?: string
          user_id?: string
          vetting_status?: Database["public"]["Enums"]["vetting_status"]
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          avatar_url: string | null
          badge: string | null
          company: string | null
          created_at: string
          id: string
          is_published: boolean
          quote: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          avatar_url?: string | null
          badge?: string | null
          company?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          quote: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          avatar_url?: string | null
          badge?: string | null
          company?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          quote?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_course_after_payment: {
        Args: { _reference: string }
        Returns: boolean
      }
      can_review_submissions: { Args: never; Returns: boolean }
      can_see_project: { Args: { _project_id: string }; Returns: boolean }
      course_outline: {
        Args: { _slug: string }
        Returns: {
          free_preview: boolean
          lesson_position: number
          lesson_title: string
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_enrolled: { Args: { _course_id: string }; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      validate_invite_token: { Args: { _token: string }; Returns: Json }
      verify_certificate: { Args: { _code: string }; Returns: Json }
    }
    Enums: {
      app_role: "client" | "student" | "talent" | "pm" | "admin"
      enrollment_status: "pending" | "active" | "completed" | "cancelled"
      escrow_state: "none" | "held" | "released" | "refunded"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "void"
      payout_status: "pending" | "approved" | "paid" | "rejected"
      project_status:
        | "draft"
        | "active"
        | "in_review"
        | "completed"
        | "cancelled"
      submission_status: "submitted" | "approved" | "rejected"
      talent_availability: "available" | "limited" | "unavailable"
      task_status: "todo" | "in_progress" | "in_review" | "done" | "cancelled"
      vetting_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "student", "talent", "pm", "admin"],
      enrollment_status: ["pending", "active", "completed", "cancelled"],
      escrow_state: ["none", "held", "released", "refunded"],
      invoice_status: ["draft", "sent", "paid", "overdue", "void"],
      payout_status: ["pending", "approved", "paid", "rejected"],
      project_status: [
        "draft",
        "active",
        "in_review",
        "completed",
        "cancelled",
      ],
      submission_status: ["submitted", "approved", "rejected"],
      talent_availability: ["available", "limited", "unavailable"],
      task_status: ["todo", "in_progress", "in_review", "done", "cancelled"],
      vetting_status: ["pending", "approved", "rejected"],
    },
  },
} as const
