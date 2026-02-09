'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, HelpCircle, Clock, TrendingUp, AlertTriangle, Search, Bot } from 'lucide-react'

// Types
interface Claim {
  id: string
  claim: string
  source: {
    type: 'ai_response' | 'article' | 'transcript'
    sessionId?: string
    timestamp: string
    context: string
  }
  extraction: {
    checkworthiness: number
    category: 'statistic' | 'date' | 'quote' | 'event' | 'attribution' | 'other'
  }
  verification: {
    status: 'verified' | 'disputed' | 'unverifiable' | 'pending'
    confidence: number
    sources: { url: string; excerpt: string; agrees: boolean }[]
    explanation: string
    verifiedAt: string
  }
}

interface Stats {
  totalClaims: number
  verified: number
  disputed: number
  unverifiable: number
  pending: number
  hallucinationRate: number
  lastUpdated: string | null
}

// Sample data for demo
const sampleStats: Stats = {
  totalClaims: 0,
  verified: 0,
  disputed: 0,
  unverifiable: 0,
  pending: 0,
  hallucinationRate: 0,
  lastUpdated: null
}

const sampleClaims: Claim[] = []

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    verified: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Verified' },
    disputed: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Disputed' },
    unverifiable: { icon: HelpCircle, color: 'text-yellow-400 bg-yellow-500/20', label: 'Unverifiable' },
    pending: { icon: Clock, color: 'text-gray-400 bg-gray-500/20', label: 'Pending' }
  }[status] || { icon: HelpCircle, color: 'text-gray-400 bg-gray-500/20', label: status }

  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

// Category badge
function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    statistic: 'bg-blue-500/20 text-blue-400',
    date: 'bg-purple-500/20 text-purple-400',
    quote: 'bg-cyan-500/20 text-cyan-400',
    event: 'bg-orange-500/20 text-orange-400',
    attribution: 'bg-pink-500/20 text-pink-400',
    other: 'bg-gray-500/20 text-gray-400'
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${colors[category] || colors.other}`}>
      {category}
    </span>
  )
}

export default function FactChecker() {
  const [stats] = useState<Stats>(sampleStats)
  const [claims] = useState<Claim[]>(sampleClaims)
  const [filter, setFilter] = useState<string>('all')

  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(c => c.verification.status === filter)

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Fact Checker</h1>
            <p className="text-gray-500 text-sm">Hallucination tracking & claim verification</p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold">{stats.totalClaims}</div>
          <div className="text-gray-400 text-sm">Total Claims</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/50">
          <div className="text-2xl font-bold text-green-400">{stats.verified}</div>
          <div className="text-gray-400 text-sm">Verified</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-red-700/50">
          <div className="text-2xl font-bold text-red-400">{stats.disputed}</div>
          <div className="text-gray-400 text-sm">Disputed</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-700/50">
          <div className="text-2xl font-bold text-yellow-400">{stats.unverifiable}</div>
          <div className="text-gray-400 text-sm">Unverifiable</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold">
            {stats.totalClaims > 0 
              ? `${((stats.disputed / stats.totalClaims) * 100).toFixed(1)}%` 
              : '—'}
          </div>
          <div className="text-gray-400 text-sm">Hallucination Rate</div>
        </div>
      </div>

      {/* Hypothesis Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-300">Hypothesis Under Test</div>
            <div className="text-gray-300 text-sm mt-1">
              "Hallucinations are far less of a problem these days" — Joe, 2026-02-08
            </div>
            <div className="text-gray-500 text-xs mt-2">
              Tracking Bob's factual claims to measure real-world hallucination rate
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'verified', 'disputed', 'unverifiable', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="bg-gray-800/30 rounded-lg p-8 text-center border border-gray-700/50">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <div className="text-gray-400 mb-2">No claims tracked yet</div>
            <div className="text-gray-500 text-sm">
              Claims will appear here as Bob makes factual statements and they get verified
            </div>
          </div>
        ) : (
          filteredClaims.map(claim => (
            <div key={claim.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="text-white font-medium">{claim.claim}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(claim.source.timestamp).toLocaleString()}
                  </div>
                </div>
                <StatusBadge status={claim.verification.status} />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <CategoryBadge category={claim.extraction.category} />
                <span className="text-gray-500 text-xs">
                  Checkworthiness: {(claim.extraction.checkworthiness * 100).toFixed(0)}%
                </span>
                {claim.verification.confidence > 0 && (
                  <span className="text-gray-500 text-xs">
                    Confidence: {(claim.verification.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {claim.verification.explanation && (
                <div className="text-gray-400 text-sm bg-gray-900/50 rounded p-2">
                  {claim.verification.explanation}
                </div>
              )}

              {claim.verification.sources.length > 0 && (
                <div className="mt-2 space-y-1">
                  {claim.verification.sources.map((source, i) => (
                    <a 
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline block truncate"
                    >
                      {source.agrees ? '✓' : '✗'} {source.url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-xs">
        {stats.lastUpdated 
          ? `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`
          : 'Waiting for first claim...'}
      </div>
    </div>
  )
}
