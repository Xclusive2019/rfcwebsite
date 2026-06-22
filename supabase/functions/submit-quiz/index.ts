import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getAdminSettings } from '../_shared/admin-settings.ts'
import { sendEmail } from '../_shared/email.ts'
import { wrapEmail } from '../_shared/email-template.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'apikey, X-Client-Info, Content-Type, Authorization',
}

const BOOKING_URL = 'https://rfcsa.co.za/#/book'

interface QuizSubmission {
  answers: Record<string, unknown>
  score: number
  tier: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical'
  email?: string
  company?: string
}

const recommendations: Record<string, string[]> = {
  Excellent: [
    'Maintain your strong controls with periodic independent reviews to stay ahead of regulatory changes.',
    'Benchmark your governance framework against industry leaders and emerging best practices.',
    'Explore advanced advisory services to turn compliance into a competitive advantage.',
  ],
  Good: [
    'Address any remaining gaps identified in the assessment before your next audit cycle.',
    'Strengthen documentation and evidence trails to support your control environment.',
    'Schedule a consultation to prioritise improvements and build a clear action plan.',
  ],
  'Needs Improvement': [
    'Conduct a focused review of your key risk areas and control deficiencies.',
    'Develop a remediation roadmap with defined owners, timelines, and milestones.',
    'Engage our team for hands-on support to close gaps and uplift your compliance posture.',
  ],
  Critical: [
    'Immediate priority review of your governance, risk, and compliance framework is recommended.',
    'Implement urgent corrective actions for high-risk findings identified in the assessment.',
    'Book a consultation as soon as possible so we can help stabilise and rebuild your controls.',
  ],
}

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405)
  }

  try {
    const body = (await req.json()) as QuizSubmission
    const { answers, score, tier, email, company } = body

    if (answers === undefined || score === undefined || !tier) {
      return jsonResponse(
        { success: false, error: 'answers, score, and tier are required' },
        400,
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase environment variables are not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { error: insertError } = await supabase
      .from('quiz_submissions')
      .insert({
        answers,
        score,
        tier,
        email,
        company,
      })

    if (insertError) {
      throw insertError
    }

    const adminSettings = await getAdminSettings()

    if (email) {
      const tierRecommendations = recommendations[tier] || recommendations['Critical']

      const htmlBody = `
        <h2>Your Assessment Results</h2>
        <p><strong>Score:</strong> ${Number(score).toFixed(0)} out of 100</p>
        <p><strong>Tier:</strong> ${escapeHtml(tier)}</p>
        <h3>Recommendations</h3>
        <ol>
          ${tierRecommendations.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
        </ol>
        <p>
          <a href="${BOOKING_URL}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:4px;">
            Book a Consultation
          </a>
        </p>
        <p>Or visit: <a href="${BOOKING_URL}">${BOOKING_URL}</a></p>
      `

      const textBody = [
        'Your Assessment Results',
        '',
        `Score: ${Number(score).toFixed(0)} out of 100`,
        `Tier: ${tier}`,
        '',
        'Recommendations:',
        ...tierRecommendations.map((r, i) => `${i + 1}. ${r}`),
        '',
        `Book a consultation: ${BOOKING_URL}`,
      ].join('\n')

      try {
        await sendEmail({
          to: email,
          subject: 'Your assessment results',
          text: textBody,
          html: wrapEmail(htmlBody, { preheader: `Your audit readiness result: ${tier} (${Number(score).toFixed(0)}/100).` }),
        })
      } catch (emailError) {
        console.error('submit-quiz customer email error:', emailError)
      }
    }

    if (adminSettings.notify_on_quiz) {
      const adminHtml = `<h2>New Quiz Submission</h2>
        <p><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
        <p><strong>Score:</strong> ${Number(score).toFixed(0)} / 100</p>
        <p><strong>Tier:</strong> ${escapeHtml(tier)}</p>`

      const adminText = [
        'New Quiz Submission',
        '',
        `Email: ${email || 'Not provided'}`,
        `Company: ${company || 'Not provided'}`,
        `Score: ${Number(score).toFixed(0)} / 100`,
        `Tier: ${tier}`,
      ].join('\n')

      try {
        await sendEmail({
          to: adminSettings.notification_email,
          reply_to: email || undefined,
          subject: `New quiz submission — ${tier}`,
          text: adminText,
          html: wrapEmail(adminHtml, { preheader: `New quiz submission — ${tier}.` }),
        })
      } catch (emailError) {
        console.error('submit-quiz admin notify error:', emailError)
      }
    }

    return jsonResponse({
      success: true,
      message: 'Quiz submission received',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('submit-quiz error:', error)
    return jsonResponse({ success: false, error: message }, 500)
  }
})
