const STATUS_STYLES = {
  Applied: 'bg-sky-100 text-sky-700',
  'Phone Screen': 'bg-amber-100 text-amber-700',
  Interviewing: 'bg-violet-100 text-violet-700',
  Offer: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Withdrawn: 'bg-slate-200 text-slate-700',
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Unknown';
  }

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatSalary = (salary) => {
  if (!salary && salary !== 0) {
    return 'Not listed';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);
};
const handleEdit = (job) => {
  startTransition(() => {
    setEditingId(job.id);
    setFormValues({
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      status: job.status,
      dateApplied: job.dateApplied || new Date().toISOString().slice(0, 10),
      location: job.location || '',
      salary: job.salary ?? '',
      jobUrl: job.jobUrl || '',
      nextStep: job.nextStep || '',
      notes: job.notes || '',
    });
    setOpen(true);
  });
};

const JobGrid = ({ jobs, isLoading, }) => {
  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center text-slate-500">
        Loading applications...
      </div>
    )
  }
  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <h3 className="text-xl font-semibold text-slate-800">No applications yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Add your first role on the left to start tracking it.
        </p>
      </div>
    )
  }
  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-200 hover:bg-white"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-slate-900">
                  {job.jobTitle}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[job.status] || 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {job.status}
                </span>
                {job.archived ? (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                    Archived
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-base text-slate-700">{job.companyName}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>Applied {formatDate(job.dateApplied)}</span>
                <span>{job.location || 'Location not set'}</span>
                <span>{formatSalary(job.salary)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(job)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleArchive(job)}
                className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                {job.archived ? 'Restore' : 'Archive'}
              </button>
              {job.jobUrl ? (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Open posting
                </a>
              ) : null}
            </div>
          </div>

          {(job.nextStep || job.notes) ? (
            <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Next step
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {job.nextStep || 'No next step logged.'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {job.notes || 'No notes logged.'}
                </p>
              </div>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export default JobGrid;
