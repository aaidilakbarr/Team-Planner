import React, { useState } from 'react';
import { Users, Mail, GitCommit, ShieldAlert, Award, Plus, FolderGit } from 'lucide-react';

export default function TeamView({ contents }) {
  const [showAddMember, setShowAddMember] = useState(false);

  const teamMembers = [
    { 
      name: 'Alexandra Deff', 
      role: 'Github Repository Architect', 
      email: 'adeff@donezo.io',
      status: 'Active', 
      tasks: '2 Active Tasks', 
      completed: 12,
      taskName: 'Reviewing Github Project Repository PRs',
      color: '#4ADE80',
      avatarSeed: 1
    },
    { 
      name: 'Edwin Adenike', 
      role: 'Security & Auth Engineer', 
      email: 'eadenike@donezo.io',
      status: 'In Progress', 
      tasks: '1 Active Task', 
      completed: 8,
      taskName: 'Integrating User Authentication System',
      color: '#F59E0B',
      avatarSeed: 2
    },
    { 
      name: 'Isaac Oluwatemilorun', 
      role: 'Search & Analytics Lead', 
      email: 'isaaco@donezo.io',
      status: 'Pending', 
      tasks: '3 Active Tasks', 
      completed: 6,
      taskName: 'Developing Search & Advanced Filter Engine',
      color: '#EF4444',
      avatarSeed: 3
    },
    { 
      name: 'David Oshodi', 
      role: 'Senior UI/UX Designer', 
      email: 'doshodi@donezo.io',
      status: 'In Progress', 
      tasks: '2 Active Tasks', 
      completed: 15,
      taskName: 'Responsive Dashboard Mockup Implementation',
      color: '#F59E0B',
      avatarSeed: 4
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
            Team Collaboration
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Kelola kolaborator dan pantau distribusi tugas tim Anda secara real-time.
          </p>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-[#0A5C36] hover:bg-[#084d2d] text-white rounded-full font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats KPI Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-[#0A5C36] dark:text-[#4ADE80] flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Members</div>
            <div className="text-xl font-heading font-extrabold text-slate-800 dark:text-white mt-0.5">4 People</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center flex-shrink-0">
            <FolderGit className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Projects</div>
            <div className="text-xl font-heading font-extrabold text-slate-800 dark:text-white mt-0.5">8 Tasks</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Milestones</div>
            <div className="text-xl font-heading font-extrabold text-slate-800 dark:text-white mt-0.5">41 Tasks</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0A5C36] text-white shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Repository Velocity</div>
            <div className="text-xl font-heading font-extrabold text-white mt-0.5">94% Stable</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Members Card List */}
        <div className="lg:col-span-8 space-y-5">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:border-[#0A5C36]/30 dark:hover:border-[#4ADE80]/30 hover:shadow-md group"
            >
              {/* Member Profile */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0 bg-slate-50">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <rect width="32" height="32" fill={member.avatarSeed % 2 === 0 ? '#FFE0B2' : '#C8E6C9'} />
                    <circle cx="16" cy="12" r="6" fill="#3E2723" />
                    <circle cx="12" cy="15" r="1.5" fill="#FFE0B2" />
                    <circle cx="20" cy="15" r="1.5" fill="#FFE0B2" />
                    <path d="M8 26c0-4 4-6 8-6s8 2 8 6H8z" fill="#5D4037" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 group-hover:text-[#0A5C36] dark:group-hover:text-[#4ADE80] transition-colors leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">{member.role}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 leading-none">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Status and Tasks details */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
                <div className="text-left sm:text-right min-w-[150px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Project Task</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px] mt-1" title={member.taskName}>
                    {member.taskName}
                  </div>
                </div>

                <div className="flex items-center gap-4.5 justify-between">
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Done</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{member.completed}</div>
                  </div>
                  
                  <span 
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg border" 
                    style={{ 
                      borderColor: member.status === 'Active' ? '#A7F3D0' : member.status === 'Pending' ? '#FCA5A5' : '#FDE68A',
                      color: member.color,
                      backgroundColor: member.status === 'Active' ? 'rgba(167,243,208,0.1)' : member.status === 'Pending' ? 'rgba(252,165,165,0.1)' : 'rgba(253,230,138,0.1)'
                    }}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Team Activity Log */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-fit">
          <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-white mb-5">
            Team Activity Log
          </h3>

          <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-6">
            {[
              { author: 'Alexandra Deff', text: 'Merged pull request #32 branch main', time: '10 mins ago' },
              { author: 'David Oshodi', text: 'Updated dashboard grid layouts and icons', time: '45 mins ago' },
              { author: 'Edwin Adenike', text: 'Committed security fixes to auth controller', time: '2 hours ago' },
              { author: 'Isaac Oluwatemilorun', text: 'Closed issues #14 regarding search filters', time: 'Yesterday' }
            ].map((activity, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0A5C36] dark:bg-[#4ADE80] ring-4 ring-white dark:ring-slate-900" />
                <div className="text-xs">
                  <span className="font-bold text-slate-850 dark:text-slate-100">{activity.author}</span>
                  <p className="text-slate-450 dark:text-slate-400 mt-1">{activity.text}</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Mock Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() => setShowAddMember(false)}
          />
          <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/40 rounded-3xl shadow-2xl relative z-10 p-6 backdrop-blur-xl animate-modal-in">
            <h3 className="font-heading font-extrabold text-base text-slate-850 dark:text-white mb-4">
              Invite Team Member
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mb-4">
              Kirim undangan kolaborasi ke developer atau desainer baru untuk bergabung di Donezo Workspace.
            </p>
            <input 
              type="email" 
              placeholder="e.g. developer@donezo.io"
              className="w-full px-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] focus:ring-4 focus:ring-[#0A5C36]/5 transition-all shadow-sm"
            />
            <div className="flex justify-end gap-2.5 mt-5">
              <button 
                onClick={() => setShowAddMember(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-white/20 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Undangan kolaborasi terkirim!");
                  setShowAddMember(false);
                }}
                className="px-4.5 py-2 text-xs font-bold text-white bg-[#0A5C36] hover:bg-[#084d2d] rounded-xl shadow cursor-pointer transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
