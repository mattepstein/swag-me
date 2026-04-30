import Hero from "../ui/home/hero";
import FeaturedProducts from "../ui/home/featured-products";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero />
      <FeaturedProducts />
    </div>
  );
}
