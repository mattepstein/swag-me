"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import searchIcon from "../../public/icons/search.svg";
import Image from "next/image";

export function SearchSkeleton() {
  return <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />;
}

//the search bar based on example from learn nextjs
export function SearchbarComponent({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = "/products";
  const { replace } = useRouter();

  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(urlSearch);

  useEffect(() => {
    setValue(urlSearch);
  }, [urlSearch]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    //remove category from params
    params.delete("category");

    //remove tags from params
    params.delete("tag");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 shrink-0 w-full bg-white display-block show rounded-md pr-1">
      <label htmlFor="search" className="sr-only ">
        Search
      </label>
      <input
        className="peer text-black block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        value={value}
      />
      <Image
        src={searchIcon}
        alt="Search"
        width={24}
        height={24}
        className="absolute text-black left-3 top-1/2  -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
      />
    </div>
  );
}
