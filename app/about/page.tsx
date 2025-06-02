"use client";

import Link from "next/link";
import { ArrowLeft, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-12">
        <div className="space-y-16">
          <h1 className="text-5xl  text-center">
            Why I Built
            <br />
            Rightsponse
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-md text-muted-foreground leading-relaxed">
              My journey as a developer has shown me a common challenge we all
              face: crafting the right response in various communication
              contexts. Whether it's responding to business emails, professional
              messages, or social interactions, finding the perfect tone and
              words can be time-consuming and sometimes stressful.
            </p>

            <h2 className="text-2xl  mt-8 mb-4">Our Approach</h2>
            <p className="text-md text-muted-foreground leading-relaxed">
              As a solo developer, I believe in building tools that solve real
              problems while maintaining simplicity and effectiveness.
              Rightsponse is designed to be your communication assistant,
              helping you craft better responses quickly and professionally,
              while respecting different languages and cultural contexts.
            </p>

            <h2 className="text-2xl  mt-8 mb-4">Open Source Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Rightsponse is built in public and open source. I believe in
              transparency and community collaboration. The code is available on
              GitHub, and I welcome contributions from the community to make
              this tool even better.
            </p>

            <h2 className="text-2xl  mt-8 mb-4">Connect With Me</h2>
            <div className="flex items-center gap-4 mt-4">
              <Link href="https://fadils.xyz" target="_blank">
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
              <Link href="https://github.com/fadilsflow" target="_blank">
                <Button variant="outline" size="sm">
                  <Image
                    src={"/github.svg"}
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="h-4 w-4 mr-2 dark:invert"
                  />
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
