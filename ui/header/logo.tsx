import Image from "next/image";
import logo from "../../public/logo.webp";

export default async function Logo() {
  return (
    <div>
      <Image
        src={logo}
        alt="Logo"
        width={64}
        height={64}
        loading="eager"
        quality={90}
        className="object-cover"
        sizes="64px"
        placeholder="blur"
      />
    </div>
  );
}
