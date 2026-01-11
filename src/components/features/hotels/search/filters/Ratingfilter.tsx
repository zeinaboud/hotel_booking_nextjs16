"use client"
import { useRouter, useSearchParams } from "next/navigation";
const Ratingfilter = () => {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("ratingGte") || "";
  const options = [
    { label: "8+ Excellent", value: "8" },
    { label: "7+ Very Good", value: "7" },
    { label: "6+ Good", value: "6" },
    { label: "5+ Normal", value: "5" },
  ];

  const handleChange = (value: string) =>
  {
    const newParams = new URLSearchParams(params.toString());
    if (value) newParams.set("ratingGte", value);
    else newParams.delete("ratingGte");
     router.push(`/search?${newParams.toString()}`);
  }
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
  )
}

export default Ratingfilter
