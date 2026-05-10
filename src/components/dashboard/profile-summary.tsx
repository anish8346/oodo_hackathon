type ProfileSummaryProps = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  additionalInfo?: string | null;
};

const emptyValue = "Not added";

export function ProfileSummary({
  firstName,
  lastName,
  phone,
  city,
  country,
  additionalInfo,
}: ProfileSummaryProps) {
  const fields = [
    ["First name", firstName],
    ["Last name", lastName],
    ["Phone", phone],
    ["City", city],
    ["Country", country],
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Profile</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
            <dd className="mt-1 text-sm text-zinc-900">{value || emptyValue}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 border-t border-zinc-200 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Additional info</p>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{additionalInfo || emptyValue}</p>
      </div>
    </section>
  );
}
