import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getAdminSettings } from '../_shared/admin-settings.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'apikey, X-Client-Info, Content-Type, Authorization',
}

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405)
  }

  try {
    const { name, email, company, phone, service, message } = await req.json()

    if (!name || !email || !message) {
      return jsonResponse(
        { success: false, error: 'Name, email, and message are required' },
        400,
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase environment variables are not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { error: insertError } = await supabase.from('contacts').insert({
      name,
      email,
      company,
      phone,
      service,
      message,
    })

    if (insertError) {
      throw insertError
    }

    const adminSettings = await getAdminSettings()

    if (resendApiKey && adminSettings.notify_on_contact) {
      const htmlBody = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
        <p><strong>Service:</strong> ${escapeHtml(service || 'Not provided')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `

      const textBody = [
        'New Contact Form Submission',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || 'Not provided'}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service: ${service || 'Not provided'}`,
        '',
        'Message:',
        message,
      ].join('\n')

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'RFC SA Website <website@rfcsa.co.za>',
          to: adminSettings.notification_email,
          subject: 'New contact form submission',
          text: textBody,
          html: htmlBody,
        }),
      })

      if (!resendResponse.ok) {
        const errorBody = await resendResponse.text()
        console.error('Resend error:', errorBody)
      }
    }

    return jsonResponse({
      success: true,
      message: 'Contact submission received',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('submit-contact error:', error)
    return jsonResponse({ success: false, error: message }, 500)
  }
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
