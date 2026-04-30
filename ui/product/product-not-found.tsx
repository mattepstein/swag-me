import { clsx } from "clsx";
import Image from "next/image";
import notFoundImage from "../../public/not-found.webp";

export default function ProductNotFoundCard() {
  return (
    <div
      className={clsx(
        "card",
        "bg-white",
        "border",
        "border-gray-200",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
        "p-2",
      )}
    >
      <div className="card-body">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="text-lg font-bold">
            Well, that was not expected...
          </div>

          <Image
            src={notFoundImage}
            alt="Not Found"
            width={800}
            height={800}
            loading="eager"
            quality={90}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
