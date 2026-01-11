"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BranchSuggestion } from "@/types/hotelsType";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsBuildingCheck, BsBuildingFillCheck } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
interface SearchProps {
  initialName?: string,
  initialCheckin?:string
  initialCheckout?:string
}

interface SearchFormData {
  name: string;
  checkIn: string;
  checkOut: string;
}

const SearchMain = (
  {  initialName = "",
    initialCheckin = "",
    initialCheckout = ""
  }: SearchProps) =>
{
  const router = useRouter();



  // Autocomplete suggestions (cities + hotels)
  const [suggestions, setSuggestions] = useState<BranchSuggestion[]>([]);

  // Improves UX by preventing UI blocking during async actions
  const [isLoading, setIsLoading] = useState();

  // Used for debouncing autocomplete requests
  const debounceRef = useRef<number | null>(null);

  // Managing form state using react-hook-form
  const { register, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues:
    {
      name: initialName,
      checkIn: initialCheckin,
      checkOut: initialCheckout
    },
  });

  // Fetch autocomplete results from the server based on user input
  const fetchAutocomplete = async (query: string) => {
    const res = await fetch(`/api/hotels/autocomplete?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to fetch autocomplete");
    return res.json();
  };

  // Debounced input handler to avoid spamming API calls while typing
  const handleInput = useCallback((value: string) => {
    // Clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If input is too short, clear suggestions
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Set new timer for debounced fetch
    debounceRef.current = window.setTimeout(async () => {
      try {
        const data = await fetchAutocomplete(value);

        // Determine suggestion type (city or hotel)
        const formatted = data.map((item: any) => ({
          ...item,
          type: item.name ? "hotel" : "city",
        }));

        setSuggestions(formatted);
      } catch {
        setSuggestions([]);
      }
    }, 250);
  }, []);

  // Triggered when submitting the search form
  const onSubmit: SubmitHandler<SearchFormData> = async (data) => {
        // Convert form data into a query string
        const query = new URLSearchParams(data).toString();
        router.push(`/search?${query}`)
          setSuggestions([]);
  };

  // When clicking a suggestion, populate the input field
  const handleSuggestionClick = (suggestion: BranchSuggestion) => {
    const text = suggestion.type === "city" ? suggestion.city : suggestion.name;
    setValue("name", text || "");
    setSuggestions([]);
  };

  return (
    <>

        <div className="serach_section">
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Search input with autocomplete suggestions */}
            <div className="check-in-out-input gap-4 relative">
              <div className="flex items-center gap-2">
                  <FaLocationDot className="text-chart-4" size={24}/>
                  <Label >Location</Label>
              </div>
              <Input
                id="search-input"
                {...register("name")}
                type="text"
                onChange={(e) => handleInput(e.target.value)}
                autoComplete="off"
                className="shadow-sm shadow-chart-4/45"
              />
              {suggestions.length > 0 && (
                <ul className="border top-16 bg-white dark:bg-input dark:text-white absolute z-20 w-full rounded-md shadow">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-primary cursor-pointer"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      <div className="text-sm font-medium">
                        {s.type === "hotel" ? s.name : s.city}
                      </div>
                      {s.type === "hotel" && (
                        <div className="text-xs text-gray-500">
                          {s.city} — {s.address}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="check-in-out-input gap-4">
              <div className="flex items-center gap-2">
                  <BsBuildingFillCheck className="text-chart-4" size={24}/>
                  <Label>Check_in</Label>
              </div>
              <Input type="date" {...register("checkIn")}
                  className="shadow-sm shadow-chart-4/45"
              />

            </div>

          <div className="check-in-out-input gap-2">
            <div className="flex items-center gap-2">
                  <BsBuildingCheck className="text-chart-4" size={24}/>
                  <Label >Check_out</Label>
              </div>
              <Input type="date" {...register("checkOut")}
                className="shadow-sm shadow-chart-4/45"/>
            </div>

            {/* Search button */}
            <Button type="submit" className="btn-gradient-gold flex items-center rounded mt-6">
              {isLoading ? "Searching..." : <IoSearch size={20} />}
            </Button>
          </form>
        </div>

    </>
  );
};

export default SearchMain;
