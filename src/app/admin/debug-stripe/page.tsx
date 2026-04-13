'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = ['jakedalerourke@gmail.com']

export default function DebugStripePage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !ADMIN_EMAILS.includes(session.user.email || '')) {
        router.push('/dashboard')
        return
      }
      try {
        const res = await fetch('/api/admin/debug-stripe', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div style={{ padding: 32, fontFamily: 'monospace' }}>Loading Stripe debug data…</div>
  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', background: '#0d0d0d', minHeight: '100vh', color: '#e2e2e2' }}>
      <h1 style={{ color: '#a78bfa', marginBottom: 16 }}>Stripe Debug</h1>

      {data && (
        <>
          <div style={{ marginBottom: 24, lineHeight: 1.8 }}>
            <div>🟣 <b>Stripe active subs:</b> {data.stripe_active_sub_count}</div>
            <div>🗄️ <b>DB subscriptions rows:</b> {data.db_subscriptions_count}</div>
            <div>🔑 <b>DB rows with Stripe IDs:</b> {data.db_subscriptions_with_stripe_ids}</div>
            <div>👤 <b>Auth users:</b> {data.auth_user_count}</div>
            <div>🔴 <b>Admin users excluded:</b> {data.admin_user_count}</div>
          </div>

          <h2 style={{ color: '#34d399', marginBottom: 8 }}>DB Subscriptions Raw</h2>
          <pre style={{ background: '#1a1a1a', padding: 16, borderRadius: 8, overflow: 'auto', marginBottom: 24, fontSize: 12 }}>
            {JSON.stringify(data.db_subscriptions_raw, null, 2)}
          </pre>

          <h2 style={{ color: '#60a5fa', marginBottom: 8 }}>Match Results (per Stripe sub)</h2>
          {(data.match_results || []).map((r: any, i: number) => (
            <div key={i} style={{
              background: r.will_appear_in_upcoming ? '#052e16' : '#2d0f0f',
              border: `1px solid ${r.will_appear_in_upcoming ? '#16a34a' : '#dc2626'}`,
              borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 12
            }}>
              <div><b>Sub:</b> {r.stripe_sub_id}</div>
              <div><b>Customer:</b> {r.stripe_customer_id} / {r.stripe_customer_email}</div>
              <div><b>Status:</b> {r.stripe_status} | <b>Interval:</b> {r.interval} | <b>Amount:</b> {r.amount_pence}p</div>
              <div><b>Renewal:</b> {r.current_period_end} ({r.days_until_renewal} days)</div>
              <div><b>Matched by:</b> <span style={{ color: r.matched_by === 'UNMATCHED' ? '#f87171' : '#4ade80' }}>{r.matched_by}</span></div>
              <div><b>User ID:</b> {r.resolved_user_id || 'NONE'}</div>
              <div><b>Is admin:</b> {String(r.is_admin)} | <b>Will appear:</b> <span style={{ color: r.will_appear_in_upcoming ? '#4ade80' : '#f87171' }}>{String(r.will_appear_in_upcoming)}</span></div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
