const problems = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    ),
    color: 'bg-rose-50 text-rose-500',
    headline: '"Wait, I pay for that?"',
    description:
      'Subscriptions pile up quietly. Free trials turn into charges you forget about.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    ),
    color: 'bg-amber-50 text-amber-500',
    headline: 'Renewals come out of nowhere',
    description:
      'You wake up to a charge you didn\'t expect — and it\'s too late to cancel.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    ),
    color: 'bg-blue-50 text-blue-500',
    headline: 'No idea where your money goes',
    description:
      'Bank statements are messy. Spreadsheets don\'t help.',
  },
]

export default function Problems() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Sound familiar?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Most people lose hundreds of euros a year to forgotten or unused subscriptions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.headline} className="card p-6">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${p.color}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {p.icon}
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{p.headline}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
