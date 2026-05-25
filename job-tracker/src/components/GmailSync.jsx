import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { supabase } from '../lib/supabaseClient'
import Anthropic from '@anthropic-ai/sdk'
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY

export default function GmailSync({ userId, onSyncComplete }) {
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_KEY,
    dangerouslyAllowBrowser: true, // Required for frontend-only Anthropic calls
  })

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSyncing(true)
      setStatus({ type: 'info', message: 'Fetching emails...' })
      try {
        await handleSync(tokenResponse.access_token)
      } catch (error) {
        console.error('Sync error:', error)
        setStatus({ type: 'error', message: 'Sync failed: ' + error.message })
      } finally {
        setSyncing(false)
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error)
      setStatus({ type: 'error', message: 'Google login failed' })
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  })

  const handleSync = async (accessToken) => {
    // 1. Fetch recent emails from Gmail
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=subject:(application OR interview OR offer OR "online test")',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    const data = await response.json()

    if (!data.messages) {
      setStatus({ type: 'success', message: 'No new job-related emails found.' })
      return
    }

    let syncedCount = 0

    for (const msg of data.messages) {
      const msgRes = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      const email = await msgRes.json()
      
      // Simple extraction of snippet/body for parsing
      const content = email.snippet + (email.payload.parts ? email.payload.parts[0].body.data : '')

      // 2. Parse with Anthropic
      const parsed = await parseEmailWithAI(content)
      
      if (parsed && parsed.company && parsed.role) {
        // 3. Check for existing company and upsert
        const { data: existing } = await supabase
          .from('applications')
          .select('id')
          .ilike('company', parsed.company)
          .eq('user_id', userId)
          .single()

        const payload = {
          ...parsed,
          user_id: userId,
          status: parsed.status || 'Applied',
        }

        if (existing) {
          await supabase
            .from('applications')
            .update(payload)
            .eq('id', existing.id)
        } else {
          await supabase
            .from('applications')
            .insert([payload])
        }
        syncedCount++
      }
    }

    setStatus({ type: 'success', message: `Successfully synced ${syncedCount} applications!` })
    if (onSyncComplete) onSyncComplete()
  }

  const parseEmailWithAI = async (content) => {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620", // Using a stable model name
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Analyze this job application email and extract the company name, job role, and status (one of: Applied, OA, Interview, Offered, Rejected). Return ONLY a JSON object.
          
          Email: ${content}
          
          Format: {"company": "...", "role": "...", "status": "...", "notes": "..."}`
        }],
      })

      const text = response.content[0].text
      return JSON.parse(text)
    } catch (error) {
      console.error('AI Parsing error:', error)
      return null
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => login()}
        disabled={syncing}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md",
          "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
          syncing && "opacity-50 cursor-not-allowed"
        )}
      >
        {syncing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4 text-primary-600" />
        )}
        <span>{syncing ? 'Syncing Gmail...' : 'Sync with Gmail'}</span>
      </button>

      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-2 text-xs font-medium p-2 rounded-lg",
              status.type === 'error' ? "bg-red-50 text-red-600" : 
              status.type === 'success' ? "bg-green-50 text-green-600" : 
              "bg-primary-50 text-primary-600"
            )}
          >
            {status.type === 'error' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            <span>{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
