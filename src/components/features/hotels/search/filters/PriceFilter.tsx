"use client";

import { Slider } from "@/components/ui/slider";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PriceFilterProps {
  min?: number;
  max?: number;
}

const DEFAULT_STEP = 10;

const PriceFilter = ({ min = 0, max = 1000 }: PriceFilterProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const initialMin = Number(params.get("minPrice") || min);
  const initialMax = Number(params.get("maxPrice") || max);

  // state للـ slider
  const [priceRange, setPriceRange] = useDebouncedState<[number, number]>(
    [initialMin, initialMax],
    200
  );

  // side effect لتحديث URL بعد debounce
  useEffect(() => {
    // لا تفعل أي شيء إذا لم تتغير القيم
    const currentMin = Number(params.get("minPrice") || min);
    const currentMax = Number(params.get("maxPrice") || max);
    if (priceRange[0] === currentMin && priceRange[1] === currentMax) return;

    const newParams = new URLSearchParams(params.toString());
    newParams.set("minPrice", String(priceRange[0]));
    newParams.set("maxPrice", String(priceRange[1]));
    router.push(`/search?${newParams.toString()}`);
  }, [priceRange, params, router, min, max]);

  return (
    <div className="p-3  rounded-lg space-y-2 ">
      <h3 className="font-semibold text-base">Price per night</h3>

      {/* عرض القيم فوق السلايدر */}
      <div className="flex justify-between mb-2 text-sm">
        <span>{priceRange[0]}$</span>
        <span>{priceRange[1]}$</span>
      </div>
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange([value[0], value[1]])} // التغيير فوراً في UI
        min={min}
        max={max}
        step={DEFAULT_STEP}
      />
    </div>
  );
};

export default PriceFilter;
