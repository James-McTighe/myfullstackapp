import { useDeferredValue, useEffect, useMemo, useState, startTransition } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';

import AddJob from './AddJob.jsx';
import SimpleSnackbar from '../utils/Toast.jsx';

const STATUS_OPTIONS = [
  'Applied',
  'Phone Screen',
  'Interviewing',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const EMPTY_FORM = {
  jobTitle: '',
  companyName: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  location: '',
  salary: '',
  jobUrl: '',
  nextStep: '',
  notes: '',
};

const STATUS_STYLES = {
  Applied: 'bg-sky-100 text-sky-700',
  'Phone Screen': 'bg-amber-100 text-amber-700',
  Interviewing: 'bg-violet-100 text-violet-700',
  Offer: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Withdrawn: 'bg-slate-200 text-slate-700',
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

const loadJobs = async (params) => {
  const response = await axios.get('/api/job-apps', { params });
  return response.data.items || [];
};

const Tracker = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [statusFilter, setStatusFilter] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    let isCurrent = true;

    const fetchJobs = async () => {
      try {
        const items = await loadJobs({
          query: deferredQuery,
          status: statusFilter,
          includeArchived,
        });

        if (!isCurrent) {
          return;
        }

        setJobs(items);
        setError('');
      } catch (fetchError) {
        if (!isCurrent) {
          return;
        }

        console.error('Error fetching job applications:', fetchError);
        setError('Unable to load job applications right now.');
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isCurrent = false;
    };
  }, [deferredQuery, statusFilter, includeArchived]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setSuccessMessage('');
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const counts = useMemo(
    () =>
      jobs.reduce(
        (accumulator, job) => {
          accumulator.total += 1;
          if (job.status === 'Interviewing') {
            accumulator.interviewing += 1;
          }
          if (job.status === 'Offer') {
            accumulator.offers += 1;
          }
          if (job.archived) {
            accumulator.archived += 1;
          }
          return accumulator;
        },
        { total: 0, interviewing: 0, offers: 0, archived: 0 }
      ),
    [jobs]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormValues(EMPTY_FORM);
    setEditingId(null);
    setOpen(false);
  };

  const refreshJobs = async () => {
    setIsLoading(true);

    try {
      const items = await loadJobs({
        query: deferredQuery,
        status: statusFilter,
        includeArchived,
      });
      setJobs(items);
      setError('');
    } catch (fetchError) {
      console.error('Error fetching job applications:', fetchError);
      setError('Unable to load job applications right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        await axios.put(`/api/job-apps/${editingId}`, formValues);
        setSuccessMessage('Application updated.');
      } else {
        await axios.post('/api/job-apps', formValues);
        setSuccessMessage('Application added.');
      }

      resetForm();
      setError('');
      await refreshJobs();
    } catch (submitError) {
      console.error('Error saving job application:', submitError);
      setError(
        submitError.response?.data?.error || 'Unable to save this application.'
      );
    } finally {
      setIsSaving(false);
    }
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

  const handleArchive = async (job) => {
    try {
      await axios.patch(`/api/job-apps/${job.id}/archive`, {
        archived: !job.archived,
      });
      setSuccessMessage(job.archived ? 'Application restored.' : 'Application archived.');
      await refreshJobs();
    } catch (archiveError) {
      console.error('Error archiving job application:', archiveError);
      setError('Unable to update archive status.');
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eefbf5_100%)] px-6 py-10 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[2rem] border border-emerald-100 bg-slate-950 px-8 py-10 text-left text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Job Tracker
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Keep every application, interview stage, and follow-up in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Search applications, update hiring stages, save notes, and archive old roles
                without losing the history.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Visible roles</p>
                <p className="mt-2 text-3xl font-semibold">{counts.total}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Interviewing</p>
                <p className="mt-2 text-3xl font-semibold">{counts.interviewing}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-300">Offers</p>
                <p className="mt-2 text-3xl font-semibold">{counts.offers}</p>
              </div>
            </div>
          </div>
        </header>


          <div className="flex flex-col gap-6">
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
              <label className="text-left text-sm font-medium text-slate-700">
                Search roles or notes
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Frontend Engineer, Acme, referral..."
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <label className="text-left text-sm font-medium text-slate-700">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeArchived}
                  onChange={(event) => setIncludeArchived(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Include archived
              </label>
              <button
                type="submit"
                onClick={handleOpen}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Add Application
              </button>
              <Modal
                open={open}
                onClose={handleClose}
              >
                <AddJob
                  formValues={formValues}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={resetForm}
                  isSaving={isSaving}
                  isEditing={Boolean(editingId)}
                  statusOptions={STATUS_OPTIONS}
                />
              </Modal>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <SimpleSnackbar message={successMessage} />
            ) : null}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-slate-900">Applications</h2>
                  <p className="text-sm text-slate-500">
                    {counts.total} applications shown
                    {includeArchived ? ` • ${counts.archived} archived shown` : ''}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex min-h-60 items-center justify-center text-slate-500">
                  Loading applications...
                </div>
              ) : jobs.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <h3 className="text-xl font-semibold text-slate-800">No applications yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Add your first role on the left to start tracking it.
                  </p>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
    </section>
  );
};

export default Tracker;
