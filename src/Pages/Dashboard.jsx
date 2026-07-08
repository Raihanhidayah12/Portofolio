import { useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Projects from './dashboard/Projects'
import Certificates from './dashboard/Certificates'
import Photos from './dashboard/Photos'
import Comments from './dashboard/Comments'
import TechStack from './dashboard/TechStack'
import Journey from './dashboard/Journey'
import { FolderGit2, Award, MessageSquare, LogOut, LayoutDashboard, Menu, Boxes, Route as RouteIcon, Camera } from 'lucide-react'
import {
  DASHBOARD_BG,
  DashboardPageIcon,
  dashboardNavActive,
  dashboardNavIdle,
  PageGridBg,
} from '../components/ui/layout'

const NAV_ITEMS = [
  { to: 'projects', label: 'Projects', icon: FolderGit2 },
  { to: 'certificates', label: 'Certificates', icon: Award },
  { to: 'photos', label: 'Photography', icon: Camera },
  { to: 'tech-stack', label: 'Tech Stack', icon: Boxes },
  { to: 'journey', label: 'Journey', icon: RouteIcon },
  { to: 'comments', label: 'Comments', icon: MessageSquare },
]

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5 gap-6">
      <div className="flex items-center gap-3 px-1 shrink-0">
        <DashboardPageIcon>
          <LayoutDashboard className="w-4 h-4" />
        </DashboardPageIcon>
        <div>
          <p className="text-sm font-semibold text-zinc-100">Dashboard</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Admin Panel
          </p>
        </div>
      </div>

      <div className="shrink-0 px-3 py-2 border border-zinc-800 bg-zinc-950/80 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400/90">
          Portfolio Manager
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1 min-h-0">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest px-3 mb-2 shrink-0">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.includes(to)
          return (
            <Link
              key={to}
              to={`/dashboard/${to}`}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium shrink-0 transition-colors ${
                active ? dashboardNavActive : dashboardNavIdle
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-sky-400' : ''}`} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="shrink-0 flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-colors"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign Out
      </button>
    </div>
  )

  return (
    <div className={`flex relative ${DASHBOARD_BG}`} style={{ height: '100dvh' }}>
      <PageGridBg className="fixed inset-0 z-0" />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/90 relative z-10"
        style={{ height: '100dvh', position: 'sticky', top: 0 }}
      >
        <SidebarContent />
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 flex flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950/90 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 border border-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-zinc-100">Dashboard</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="photos" element={<Photos />} />
            <Route path="tech-stack" element={<TechStack />} />
            <Route path="journey" element={<Journey />} />
            <Route path="comments" element={<Comments />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
