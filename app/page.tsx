"use client";

import { LanguageSelect } from "@/components/language-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToneSelect } from "@/components/tone-select";
import {
  CheckIcon,
  CopyIcon,
  Loader2,
  Mail,
  MessageSquare,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Tipe tab yang tersedia
type TabType = "message" | "email" | "comment";

// Deskripsi untuk masing-masing tab
const tabDescriptions = {
  message: "Improve your message with AI assistance",
  email: "Create professional emails with proper formatting",
  comment: "Generate appropriate responses to comments",
};

// Placeholder untuk masing-masing input tergantung tab
const placeholders = {
  message: "Write your message here...",
  email:
    "Write your email content here. The AI will format it with a subject line, greeting, and closing.",
  comment: "Write your reply here...",
};

// Komponen utama halaman
export default function Home() {
  // State untuk menyimpan input/output dan pengaturan
  const [isCopied, setIsCopied] = useState(false);
  const [inputText, setInputText] = useState("");
  const [comment, setComment] = useState("");
  const [outputText, setOutputText] = useState("");
  const [language, setLanguage] = useState("id");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("message");

  // Fungsi validasi agar input tidak kosong
  const validateInput = (type: TabType): boolean => {
    if (!inputText.trim()) {
      toast.error("Please enter your message");
      return false;
    }

    if (type === "comment" && !comment.trim()) {
      toast.error("Please enter the comment you're replying to");
      return false;
    }

    return true;
  };

   // Fungsi untuk mengirim permintaan ke endpoint AI
  const handleSubmit = async (type: TabType) => {
    if (!validateInput(type)) return;

    setIsLoading(true);
    try {
      // Mengirim Request ke API
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          comment: type === "comment" ? comment : undefined,
          tone,
          language,
          type,
        }),
      });

      // Menerima Respons AI
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // Menampilkan Hasil dari AI
      if (data.result) {
        setOutputText(data.result);
        toast.success("Your text has been improved");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process your request"
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success("Text copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Rightsponse
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your communication with AI-powered writing assistance.
              Perfect for emails, messages, and responses.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="comment" className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4" />
                Comment
              </TabsTrigger>
            </TabsList>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className=" h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Input</span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <LanguageSelect
                        value={language}
                        onValueChange={setLanguage}
                      />
                      <ToneSelect value={tone} onValueChange={setTone} />
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {tabDescriptions[activeTab]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTab === "comment" && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Original Comment</p>
                        <Textarea
                          placeholder="Paste the comment you're replying to..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="h-24 resize-none "
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {activeTab === "message" && "Your Message"}
                        {activeTab === "email" && "Email Content"}
                        {activeTab === "comment" && "Your Reply"}
                      </p>
                      <div className="relative">
                        <Textarea
                          placeholder={placeholders[activeTab]}
                          className="min-h-[200px] pr-12 resize-none "
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                        />
                        <Button
                          size="sm"
                          className={cn(
                            "absolute bottom-2 right-2 transition-opacity",
                            !inputText && "opacity-0"
                          )}
                          onClick={() => handleSubmit(activeTab)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="relative">
                  <CardTitle>Improved Version</CardTitle>
                  <CardDescription>
                    AI-enhanced text with your selected style
                  </CardDescription>
                  <div className="absolute top-7.5 right-6 flex justify-end">
                    {outputText && (
                      <Button
                        size="icon"
                        variant={"ghost"}
                        onClick={copyToClipboard}
                        disabled={isCopied}
                        className={cn(
                          "bg-input/30 border-t  border-x text-muted-foreground  border-b-none rounded-b-none",
                          "disabled:opacity-100 disabled:bg-input/30"
                        )}
                      >
                        {isCopied ? (
                          <CheckIcon className="w-4 h-4 " />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="min-h-[200px] w-full rounded-tr-none  rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-2 text-sm whitespace-pre-wrap">
                        {outputText || (
                          <span className="text-muted-foreground">
                            Your improved text will appear here...
                          </span>
                        )}
                      </div>
                    </div>
                    {outputText && (
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {language.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">{tone}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
