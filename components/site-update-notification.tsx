"use client"

import { useState, useEffect } from "react"
import {
  X, Sparkles, ArrowRight, Github,
  ExternalLink, FolderCode,
  History,
  HistoryIcon,
  FileClock
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteUpdateNotificationProps {
  onClose?: () => void
}

export function SiteUpdateNotification({ onClose }: SiteUpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [activeTab, setActiveTab] = useState<"updates" | "roadmap">("updates")
  const [updates, setUpdates] = useState<any[]>([])
  const [commits, setCommits] = useState<any[]>([])

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  useEffect(() => {
    fetch("https://api.github.com/users/adityalf/repos?sort=updated")
      .then(res => res.json())
      .then(data => {
        const recent = data.slice(0, 5).map((repo: any) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || "No description",
          date: new Date(repo.updated_at).toLocaleDateString(),
          github: repo.html_url,
          homepage: repo.homepage || null,
          icon: <Github className="w-4 h-4 text-white" />,
        }))
        setUpdates(recent)
      })
  }, [])

  useEffect(() => {
    fetch("https://api.github.com/users/adityalf/repos?sort=updated")
      .then(res => res.json())
      .then(async (repos) => {
        const commitPromises = repos.map((repo: any) =>
          fetch(`https://api.github.com/repos/adityalf/${repo.name}/commits`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
            if (!data || !data[0]) return null
            return {
              sha: data[0].sha,
              message: data[0].commit.message,
              date: new Date(data[0].commit.committer.date),
              url: data[0].html_url,
              repo: `adityalf/${repo.name}`
            }
          })
          .catch(() => null)
      )

      const results = await Promise.all(commitPromises)
      const validCommits = results.filter(Boolean)

      const sortedCommits = validCommits.sort(
        (a, b) => b!.date.getTime() - a!.date.getTime()
      )

      setCommits(
        sortedCommits.slice(0, 5).map(commit => ({
          ...commit,
          date: commit.date.toLocaleDateString()
        }))
      )
    })
}, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 w-full max-w-md animate-in fade-in duration-300 max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Latest Projects</h3>
          </div>
          <Button variant="primary" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("updates")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "updates"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "roadmap"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Commit Activity
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "updates" ? (
            <div className="space-y-4 overflow-y-auto max-h-[350px] sm:max-h-none pr-1">
              {updates.map((update) => (
                <div key={update.id} className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{update.icon}</div>
                    <div className="flex-1">
                      <div className="relative">
                        <h4 className="text-white text-sm font-medium pr-16">{update.title}</h4>
                        <span className="absolute top-0 right-0 text-gray-500 text-xs">{update.date}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{update.description}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <a
                          href={update.github}
                          target="_blank"
                          className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                        >
                          <FolderCode className="w-3 h-3" /> Source Code
                        </a>
                        {update.homepage && (
                          <a
                            href={update.homepage}
                            target="_blank"
                            className="text-green-400 text-xs hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Project Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[350px] sm:max-h-none pr-1">
              {commits.map((commit) => (
                <div key={commit.sha} className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start gap-3">
                    <History className="w-4 h-4 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="relative">
                        <h4 className="text-white text-sm font-medium pr-16">{commit.repo}</h4>
                        <span className="absolute top-0 right-0 text-gray-500 text-xs">{commit.date}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{commit.message}</p>
                      <a
                        href={commit.url}
                        target="_blank"
                        className="text-blue-400 text-xs hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        <FileClock className="w-3 h-3" /> View Commit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleClose}
              className="h-8 w-auto p-0 flex items-center hover:text-white transition-all duration-200"
            >
              <span className="text-gray-400 text-xs hover:text-white">Close</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
