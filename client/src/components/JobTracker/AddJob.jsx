const AddJob = ({
  formValues,
  onChange,
  onSubmit,
  onCancel,
  isSaving,
  isEditing,
  statusOptions,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-semibold text-slate-900">
            {isEditing ? 'Update application' : 'Add application'}
          </h2>
          <p className="text-sm text-slate-500">
            Track the role, hiring stage, links, and follow-up notes.
          </p>
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-left text-sm font-medium text-slate-700">
          Job title
          <input
            name="jobTitle"
            value={formValues.jobTitle}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700">
          Company
          <input
            name="companyName"
            value={formValues.companyName}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700">
          Status
          <select
            name="status"
            value={formValues.status}
            onChange={onChange}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-left text-sm font-medium text-slate-700">
          Date applied
          <input
            type="date"
            name="dateApplied"
            value={formValues.dateApplied}
            onChange={onChange}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700">
          Location
          <input
            name="location"
            value={formValues.location}
            onChange={onChange}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700">
          Salary
          <input
            type="number"
            min="0"
            name="salary"
            value={formValues.salary}
            onChange={onChange}
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700 md:col-span-2">
          Job posting URL
          <input
            type="url"
            name="jobUrl"
            value={formValues.jobUrl}
            onChange={onChange}
            placeholder="https://company.com/jobs/123"
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700 md:col-span-2">
          Next step
          <input
            name="nextStep"
            value={formValues.nextStep}
            onChange={onChange}
            placeholder="Send thank-you note on Friday"
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="text-left text-sm font-medium text-slate-700 md:col-span-2">
          Notes
          <textarea
            name="notes"
            value={formValues.notes}
            onChange={onChange}
            rows="4"
            className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Add application'}
      </button>
    </form>
  );
};

export default AddJob;
