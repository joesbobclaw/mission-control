'use client'

import { useState } from 'react'
import { Activity, Calendar, Search, Bot, Clock, CheckCircle, AlertCircle, Loader, FlaskConical } from 'lucide-react'
import Link from 'next/link'
import activitiesData from './data/activities.json'
import scheduledData from './data/scheduled.json'

// Types
interface ActivityItem {
  id: string
  timestamp: string
  type: 'email' | 'search' | 'file' | 'message' | 'cron' | 'system' | 'api'
  action: string
  description: string
  status: 'completed' | 'pending' | 'failed'
}

interface RecurringTask {
  id: string
  name: string
  schedule: string
  type: string
  source: string
}

interface OneTimeTask {
  id: string
  name: string
  scheduledFor: string
  type: string
  description: string
}

// Load data from JSON files (updated via git push)
const sampleActivities: ActivityItem[] = activitiesData as ActivityItem[]
const recurringTasks: RecurringTask[] = scheduledData.recurring as RecurringTask[]
const oneTimeTasks: OneTimeTask[] = scheduledData.oneTime as OneTimeTask[]

// Status icon component
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'pending': return <Loader className="w-4 h-4 text-yellow-500 animate-spin" />
    case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
    default: return <Clock className="w-4 h-4 text-gray-500" />
  }
}

// Type badge colors
function getTypeBadgeColor(type: string) {
  const colors: Record<string, string> = {
    email: 'bg-blue-500/20 text-blue-400',
    search: 'bg-purple-500/20 text-purple-400',
    file: 'bg-green-500/20 text-green-400',
    message: 'bg-cyan-500/20 text-cyan-400',
    cron: 'bg-orange-500/20 text-orange-400',
    system: 'bg-gray-500/20 text-gray-400',
    api: 'bg-pink-500/20 text-pink-400',
  }
  return colors[type] || 'bg-gray-500/20 text-gray-400'
}

// Format timestamp
function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function MissionControl() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'activity' | 'calendar' | 'search'>('activity')

  // Filter activities based on search
  const filteredActivities = sampleActivities.filter(a => 
    a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mission Control</h1>
            <p className="text-gray-500 text-sm">Bob's Activity Dashboard</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'activity' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          Activity Feed
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'calendar' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'search' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <Link
          href="/facts"
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition bg-gray-800 text-gray-400 hover:bg-gray-700"
        >
          <FlaskConical className="w-4 h-4" />
          Fact Checker
        </Link>
      </nav>

      {/* Activity Feed Tab */}
      {activeTab === 'activity' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Activity Feed
            </h2>
            <p className="text-sm text-gray-500 mt-1">Every action Bob has taken</p>
          </div>
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {sampleActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-800/50 transition">
                <div className="flex items-start gap-3">
                  <StatusIcon status={activity.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(activity.type)}`}>
                        {activity.type}
                      </span>
                      <span className="font-medium">{activity.action}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{activity.description}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                    <div>{formatTime(activity.timestamp)}</div>
                    <div>{formatDate(activity.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Scheduled Tasks
            </h2>
            <p className="text-sm text-gray-500 mt-1">Upcoming cron jobs and reminders</p>
          </div>
          <div className="p-4">
            {/* Weekly Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day}</div>
                  <div className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                    i === 6 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {8 + i}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recurring Tasks */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">🔄 Recurring Tasks</h3>
              {recurringTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex-1">
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm text-gray-500">{task.schedule}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.source}
                  </div>
                </div>
              ))}
            </div>

            {/* One-Time Tasks */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 mb-2">📌 Upcoming One-Time Tasks</h3>
              {oneTimeTasks.length > 0 ? (
                oneTimeTasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>{formatDate(task.scheduledFor)}</div>
                      <div>{formatTime(task.scheduledFor)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No upcoming one-time tasks</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Global Search
            </h2>
            <p className="text-sm text-gray-500 mt-1">Search memory, documents, and tasks</p>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            
            {searchQuery && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Results for "{searchQuery}"
                </h3>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        <span className="font-medium">{activity.action}</span>
                      </div>
                      <p className="text-sm text-gray-400">{activity.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No results found</p>
                )}
              </div>
            )}
            
            {!searchQuery && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Type to search across all memory files, documents, and activity history</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>🤖 Bob • Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  )
}
