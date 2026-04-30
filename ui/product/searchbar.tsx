import { Suspense } from "react";
import { SearchbarComponent } from "./searchbar-componenet";

function SearchbarSkeleton() {
  return (
    <div className="relative flex flex-1 shrink-0 w-full bg-white display-block show rounded-md">
      <div className="h-10 w-full animate-pulse bg-gray-200 rounded-md" />
    </div>
  );
}

export default function Searchbar({ placeholder }: { placeholder: string }) {
  return (
    <Suspense fallback={<SearchbarSkeleton />}>
      <SearchbarComponent placeholder={placeholder} />
    </Suspense>
  );
}
