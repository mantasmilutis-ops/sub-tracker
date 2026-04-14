const mockSubs = [
  { name: 'Netflix', category: 'Entertainment', price: '€15.99', badge: 'bg-purple-100 text-purple-700', initial: 'N', color: 'bg-red-500', due: 'Today', dueColor: 'text-red-500' },
  { name: 'Spotify', category: 'Music', price: '€9.99', badge: 'bg-pink-100 text-pink-700', initial: 'S', color: 'bg-green-500', due: 'In 3 days', dueColor: 'text-orange-500' },
  { name: 'GitHub Pro', category: 'Tools', price: '€4.00', badge: 'bg-blue-100 text-blue-700', initial: 'G', color: 'bg-slate-800', due: 'In 14 days', dueColor: 'text-slate-400' },
  { name: 'Adobe CC', category: 'Design', price: '€54.99', badge: 'bg-orange-100 text-orange-700', initial: 'A', color: 'bg-red-600', due: 'In 21 days', dueColor: 'text-slate-400' },
]

export default function ProductPreview() {
  return (
    <section className="py-24 bg-slate-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            A dashboard that actually helps
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            See your subscriptions, upcoming charges, and totals — all in one clean view.
          </p>
        </div>

        {/* Browser frame */}
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800">
          {/* Browser chrome */}
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
              subtracker.to/dashboard
            </div>
          </div>

          {/* App content */}
          <div className="bg-slate-50 p-4 sm:p-6">
            {/* App header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-900">SubTracker</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Hi, Alex</div>
            </div>

            {/* Page title */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dashboard</h3>
                <p className="text-xs text-slate-400">4 subscriptions tracked</p>
              </div>
            </div>

            {/* Alerts banner */}
            <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <span>⚠️ 2 payments due in the next 7 days</span>
              <span className="text-amber-700 font-semibold">View upcoming →</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-indigo-600 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-indigo-200 mb-1">Monthly</p>
                <p className="text-lg sm:text-xl font-bold text-white">€84.97</p>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-400 mb-1">Yearly</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">€1,019.64</p>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-400 mb-1">Active</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">4</p>
              </div>
            </div>

            {/* Subscription list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">All Subscriptions</p>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 text-xs">
                  <span className="bg-white rounded-md px-2.5 py-1 font-medium text-slate-900 shadow-sm">List</span>
                  <span className="px-2.5 py-1 text-slate-500">Calendar</span>
                </div>
              </div>
              {mockSubs.map((sub, i) => (
                <div key={sub.name} className={`flex items-center gap-3 px-4 py-3 ${i < mockSubs.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  {/* Logo */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${sub.color}`}>
                    {sub.initial}
                  </div>
                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{sub.name}</p>
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${sub.badge}`}>
                      {sub.category}
                    </span>
                  </div>
                  {/* Due */}
                  <div className="hidden sm:block text-right">
                    <p className={`text-xs font-medium ${sub.dueColor}`}>{sub.due}</p>
                  </div>
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{sub.price}</p>
                    <p className="text-xs text-slate-400">/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
