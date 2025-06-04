import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";


export default function Header() {
  return (
    <nav className="flex justify-between px-10 py-4">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold font-mono">
          RIGHT-SPONSE
        </Link>
      </div>
      <div className="flex gap-4">
        <Link href="https://github.com/rightsponse/rightsponse">
          <Image
            src="/github.svg"
            alt="github"
            width={24}
            height={24}
            className="dark:invert"
          />
        </Link>
        <ModeToggle/>
      </div>
    </nav>
  );
}
