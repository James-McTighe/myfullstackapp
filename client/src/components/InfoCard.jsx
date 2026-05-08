const InfoCard = ({ title, description, category }) => {
  return (
    <div
      className="group 
      relative flex flex-col rounded-xl border border-slate-200
      bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-2">
        {category}
      </span>
      <h3 className="mb-2 text-xl font-bold text-slate-800">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
};

export default InfoCard;
