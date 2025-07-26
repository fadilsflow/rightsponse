import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <nav className="flex justify-between px-10 py-4">
      <div className="flex items-center gap-2">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/web-app-manifest-512x512.png"}
            alt="logo"
            width={35}
            height={35}
            className="rounded-full opacity-90"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Rightsponse
          </span>
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <a
          href="https://github.com/fadilsflow/rightsponse" // Tautan ke github
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github.svg"
            alt="github"
            width={24}
            height={24}
            className="dark:invert"
          />
        </a>
        <ModeToggle />
      </div>
    </nav>
  );
}
