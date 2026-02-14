'use client'

import { useState } from 'react'
import { BookOpen, ChevronRight, Bot, MessageSquare, Shield, Clock, Link2 } from 'lucide-react'

// Explainer data
const explainers = [
  {
    id: 'sessions',
    title: 'Session Management',
    description: 'How OpenClaw organizes conversations',
    icon: MessageSquare,
    content: `
## What Are Sessions?

Sessions are conversation threads. OpenClaw decides which messages belong to the same conversation based on where they come from (DM vs group, which channel, which person).

## How Sessions Are Keyed

| Source | Session Key | Example |
|--------|-------------|---------|
| **DMs (default)** | \`agent:main:main\` | All your DMs share one conversation |
| **DMs (per-peer)** | \`agent:main:dm:<sender>\` | Each person gets isolated context |
| **Group chats** | \`agent:main:telegram:group:-5012322987\` | Each group is separate |
| **Cron jobs** | \`cron:<jobId>\` | Isolated, fresh each run |

## The Big Security Thing: dmScope

**Default behavior:** All DMs share the same session (\`main\`). Fine for single-user, dangerous for multi-user.

**The problem:**
- Alice DMs about her medical appointment
- Bob DMs "What were we talking about?"
- Bob sees Alice's private info 😬

**The fix:** Set \`dmScope: "per-channel-peer"\` to isolate each person.

## Session Lifecycle

- **Daily reset:** Default 4 AM — old sessions expire, fresh start
- **Idle reset:** Optional — reset after N minutes of inactivity
- **Manual reset:** \`/new\` or \`/reset\` in chat starts fresh
- **Compaction:** When context gets full, \`/compact\` summarizes old stuff

## Use Case Examples

### 1. Single User, Multiple Devices
\`\`\`json
{ "session": { "dmScope": "main" } }
\`\`\`
Message from Telegram on your phone, then from the TUI on your Mac — same conversation, full continuity.

### 2. Shared Family Bot
\`\`\`json
{ "session": { "dmScope": "per-channel-peer" } }
\`\`\`
Multiple family members can all DM the same bot. Each person gets their own isolated conversation — no context bleed.

### 3. Same Person, Multiple Channels
\`\`\`json
{
  "session": {
    "dmScope": "per-peer",
    "identityLinks": {
      "joe": ["telegram:123", "signal:+1234567890", "discord:456"]
    }
  }
}
\`\`\`
DM from Telegram, Signal, or Discord — all collapse to one "joe" session. Continuity follows *you*, not the app.

### 4. Work Bot with Multiple Accounts
\`\`\`json
{ "session": { "dmScope": "per-account-channel-peer" } }
\`\`\`
Multiple accounts (personal + work) through one OpenClaw, each account × channel × sender gets isolated.

### 5. Long-Running Discord Server
\`\`\`json
{
  "session": {
    "resetByChannel": {
      "discord": { "mode": "idle", "idleMinutes": 10080 }
    }
  }
}
\`\`\`
Discord conversations reset after 7 days of inactivity instead of daily.

## Quick Commands

| Command | What it does |
|---------|--------------|
| \`/status\` | Shows context usage, model, session info |
| \`/new\` | Fresh session, optional model switch |
| \`/compact\` | Summarize old context, free up space |
| \`/context list\` | What's in the system prompt |
| \`openclaw sessions --json\` | Dump all sessions from CLI |

## TL;DR

Sessions = conversation boundaries. Default is "everyone shares one DM thread" which is fine for single-user, risky for shared bots. Groups auto-isolate. Use \`identityLinks\` to make the same person's sessions follow them across channels.
    `
  }
]

export default function Explainers() {
  const [selectedExplainer, setSelectedExplainer] = useState<string | null>(null)
  
  const selected = explainers.find(e => e.id === selectedExplainer)

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Explainers</h1>
            <p className="text-gray-500 text-sm">OpenClaw concepts explained simply</p>
          </div>
        </div>
      </header>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <h2 className="font-semibold text-sm text-gray-400">Topics</h2>
            </div>
            <div className="p-2">
              {explainers.map((explainer) => {
                const Icon = explainer.icon
                return (
                  <button
                    key={explainer.id}
                    onClick={() => setSelectedExplainer(explainer.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left ${
                      selectedExplainer === explainer.id
                        ? 'bg-amber-600/20 text-amber-300'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{explainer.title}</div>
                      <div className="text-xs text-gray-500 truncate">{explainer.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                )
              })}
            </div>
          </div>
          
          <a
            href="/"
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to Mission Control
          </a>
        </div>

        {/* Content */}
        <div className="flex-1">
          {selected ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <p className="text-gray-500 mt-1">{selected.description}</p>
              </div>
              <div className="p-6 prose prose-invert prose-sm max-w-none
                prose-headings:text-gray-100 
                prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-strong:text-gray-100
                prose-code:text-amber-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
                prose-table:text-sm
                prose-th:text-gray-300 prose-th:font-medium prose-th:border-gray-700
                prose-td:text-gray-400 prose-td:border-gray-800
                prose-li:text-gray-300
                prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
              ">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(selected.content) }} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Select a topic</h2>
              <p className="text-gray-600">Choose an explainer from the sidebar to learn about OpenClaw concepts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple markdown to HTML converter (handles basics)
function markdownToHtml(md: string): string {
  return md
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      if (cells.every(c => c.trim().match(/^-+$/))) {
        return '' // Skip separator row
      }
      const isHeader = !match.includes('`') && cells.every(c => c.includes('**') || c.trim().length < 30)
      const tag = isHeader ? 'th' : 'td'
      return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`
    })
    // Wrap tables
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table><tbody>$&</tbody></table>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupolt])(.+)$/gm, '<p>$1</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hupolt])/g, '$1')
    .replace(/(<\/[hupolt].*>)<\/p>/g, '$1')
}
