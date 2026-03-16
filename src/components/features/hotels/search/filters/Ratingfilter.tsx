'use client';
import { useRouter, useSearchParams } from 'next/navigation';
const Ratingfilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get('ratingGte') || '';
  const options = [
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];

  const handleChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) newParams.set('ratingGte', value);
    else newParams.delete('ratingGte');
    router.push(`/search?${newParams.toString()}`);
  };
  return (
    <>
      <div className="p-3  rounded-lg space-y-2">
        <h3 className="py-2 font-semibold text-base">Rating</h3>
        {options.map((op) => (
          <label key={op.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={current === op.value}
              onChange={() => handleChange(op.value)}
            />
            <span>{op.label}</span>
          </label>
        ))}
      </div>
    </>
  );
};

export default Ratingfilter;
