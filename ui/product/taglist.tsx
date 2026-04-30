import Link from "next/link";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map((tag) => (
        <div
          key={tag}
          className="text-sm text-gray-500 bg-gray-100 rounded-md px-2 py-1"
        >
          <Link href={`/products?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
        </div>
      ))}
    </div>
  );
}
