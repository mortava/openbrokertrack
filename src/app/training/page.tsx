'use client';

import {
  BookOpen,
  GitBranch,
  Sparkles,
  Settings,
  Play,
  Home,
  HandCoins,
  ChevronRight,
} from 'lucide-react';

interface Course {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  audience: string;
}

const COURSES: Course[] = [
  {
    id: '101',
    number: '101',
    title: 'Getting Started with OpenBrokerTrack',
    description:
      'A complete onboarding course for loan officers. Learn how to create your first loan, navigate the pipeline, manage contacts, and set up your team preferences.',
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    audience: 'Loan Officers',
  },
  {
    id: '201',
    number: '201',
    title: 'Pipeline Management',
    description:
      'Deep-dive training for processing teams. Covers loan staging, task management, document tracking, milestone milestones, and inter-team communication workflows.',
    icon: GitBranch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    audience: 'Processing Team',
  },
  {
    id: '301',
    number: '301',
    title: "What's New",
    description:
      'Stay current with the latest OpenBrokerTrack updates, UI improvements, and new integrations. Covers recent releases and upcoming features on the roadmap.',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    audience: 'All Users',
  },
  {
    id: '401',
    number: '401',
    title: 'System Administration',
    description:
      'Admin configuration training covering user management, branch setup, business rules, custom fields, integration setup, and security permissions.',
    icon: Settings,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    audience: 'Administrators',
  },
  {
    id: '501',
    number: '501',
    title: 'Onboarding / Initial Setup',
    description:
      'First-time setup walkthrough for new organizations. Configure your company profile, import contacts, connect integrations, and establish your pipeline workflow.',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    audience: 'New Organizations',
  },
  {
    id: '601',
    number: '601',
    title: 'Closing & Funding',
    description:
      'Closer training for managing the final stages of the loan process. Covers CTC conditions, funding package preparation, disbursement tracking, and post-close tasks.',
    icon: HandCoins,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    audience: 'Closing Team',
  },
];

export default function TrainingPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-5 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Support</span>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium">Training</span>
        </div>

        {/* Page header */}
        <div>
          <h1 className="text-lg font-bold text-slate-900">Training</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured courses for every role on your team
          </p>
        </div>

        {/* Course cards */}
        <div className="space-y-3">
          {COURSES.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 ${course.bgColor} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon size={20} className={course.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {course.number}
                      </span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${course.bgColor} ${course.color}`}
                      >
                        {course.audience}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {course.number}. {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-2xl">
                      {course.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      <Play size={11} />
                      Sign Up
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      Training Video
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
