import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center  py-10">
      <div className="flex text-center gap-10 text-muted-foreground">
        <Link href={"https://github.com/fadilsflow/rightsponse"}>GitHub</Link>
        <Link href={"/about"}>About</Link>
      </div>
      <h3 className="lg:text-9xl md:text-7xl text-5xl font-bold font-mono opacity-30 pt-10 ">
        RIGHT-SPONSE
      </h3>
    </footer>
  );
}
