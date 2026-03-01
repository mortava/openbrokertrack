'use client';

import {
  BookOpen,
  Mail,
  Headphones,
  Lightbulb,
  UserCog,
  Wrench,
} from 'lucide-react';

interface SupportCard {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const SUPPORT_CARDS: SupportCard[] = [
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Browse articles, guides, and step-by-step walkthroughs for every feature.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Mail,
    title: 'Create New Ticket',
    description: 'Submit a support request and track your issue through to resolution.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Headphones,
    title: 'Live Support',
    description: 'Chat with our team Monday–Friday, 12PM–5PM EST for immediate help.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Lightbulb,
    title: 'New Feature Suggestions',
    description: 'Suggest product improvements and vote on features from the community.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: UserCog,
    title: 'System Administrator Support',
    description: 'Admin-level assistance for configuration, permissions, and integrations.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: Wrench,
    title: 'Custom Support',
    description: 'Custom configuration help for unique workflow and business requirements.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      <div className="p-5 space-y-5">
        {/* Page header */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">Support</h1>
          <p className="text-xs text-gray-500 mt-0.5">How can we help you today?</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-gray-300 transition-colors group cursor-pointer"
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                >
                  <Icon size={22} className="text-gray-500" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
          <Headphones size={16} className="text-gray-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Live Support Hours</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Monday through Friday, 12:00 PM to 5:00 PM Eastern Time.
              Outside of business hours, please submit a ticket or browse the Knowledge Base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
