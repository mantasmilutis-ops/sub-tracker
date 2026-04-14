const features = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    ),
    color: 'bg-indigo-50 text-indigo-600',
    title: 'See your real monthly spend',
    description:
      'All subscriptions in one place, total cost at a glance.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    ),
    color: 'bg-sky-50 text-sky-600',
    title: 'Know what\'s coming next',
    description:
      'Upcoming renewals clearly listed — no surprises.',
  },
  {
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </>
    ),
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Smart auto-fill',
    description:
      'Add subscriptions in seconds — no manual typing.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    ),
    color: 'bg-amber-50 text-amber-600',
    title: 'Get email reminders',
    description:
      'Before renewals, not after.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    ),
    color: 'bg-violet-50 text-violet-600',
    title: 'Clean dashboard',
    description:
      'Simple, fast, and always up to date.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    ),
    color: 'bg-rose-50 text-rose-600',
    title: 'Weekly summary',
    description:
      'Get a snapshot of what\'s renewing in the next 7 days.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to stay in control
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            A focused set of tools to understand and control your recurring spend.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-7 flex gap-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {f.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Email alerts callout */}
        <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 px-4 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Never miss a renewal</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Get a heads-up the day before, a reminder on the day, and a weekly summary of everything coming up.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
