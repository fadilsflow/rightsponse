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
import { VoiceInput } from "@/components/ui/voice-input";

// Tipe tab yang tersedia
type TabType = "message" | "email" | "comment" | "prompt";

// Deskripsi untuk masing-masing tab
const tabDescriptions = {
  message: "Improve your message with AI assistance",
  email: "Create professional emails with proper formatting",
  comment: "Generate appropriate responses to comments",
  prompt: "Improve your AI prompts for better results",
};

// Placeholder untuk masing-masing input tergantung tab
const placeholders = {
  message: "Write your message here...",
  email:
    "Write your email content here. The AI will format it with a subject line, greeting, and closing.",
  comment: "Write your reply here...",
  prompt: "Write your AI prompt here, and we'll help make it more effective...",
};

// Tipe untuk menyimpan input dan output per tab
interface TabContent {
  input: string;
  output: string;
  comment?: string;
}

// Komponen utama halaman
export default function Home() {
  const [isCopied, setIsCopied] = useState(false);
  const [tabContents, setTabContents] = useState<Record<TabType, TabContent>>({
    message: { input: "", output: "" },
    email: { input: "", output: "" },
    comment: { input: "", output: "", comment: "" },
    prompt: { input: "", output: "" },
  });
  const [language, setLanguage] = useState("id");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("message");

  // Fungsi untuk mengupdate input text berdasarkan tab aktif
  const updateInput = (value: string) => {
    setTabContents((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], input: value },
    }));
  };

  // Fungsi untuk mengupdate comment pada tab comment
  const updateComment = (value: string) => {
    setTabContents((prev) => ({
      ...prev,
      comment: { ...prev.comment, comment: value },
    }));
  };

  // Fungsi validasi agar input tidak kosong
  const validateInput = (type: TabType): boolean => {
    const content = tabContents[type];

    if (!content.input.trim()) {
      toast.error("Please enter your message");
      return false;
    }

    if (type === "comment" && !content.comment?.trim()) {
      toast.error("Please enter the comment you're replying to");
      return false;
    }

    return true;
  };

  // Fungsi untuk mengirim permintaan ke endpoint AI
  const handleSubmit = async (type: TabType) => {
    if (!validateInput(type)) return;

    const content = tabContents[type];
    setIsLoading(true);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content.input,
          comment: type === "comment" ? content.comment : undefined,
          tone,
          language,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      if (data.result) {
        setTabContents((prev) => ({
          ...prev,
          [type]: { ...prev[type], output: data.result },
        }));
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
    const currentOutput = tabContents[activeTab].output;
    try {
      await navigator.clipboard.writeText(currentOutput);
      toast.success("Text copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  // Get current tab content
  const currentContent = tabContents[activeTab];

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
            <TabsList className="grid w-full grid-cols-4 mb-8">
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
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Prompt
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
                          value={tabContents.comment.comment}
                          onChange={(e) => updateComment(e.target.value)}
                          className="h-24 resize-none"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {activeTab === "message" && "Your Message"}
                        {activeTab === "email" && "Email Content"}
                        {activeTab === "comment" && "Your Reply"}
                        {activeTab === "prompt" && "Your Prompt"}
                      </p>
                      <div className="relative">
                        <Textarea
                          placeholder={placeholders[activeTab]}
                          className="min-h-[200px] pr-12 resize-none"
                          value={currentContent.input}
                          onChange={(e) => updateInput(e.target.value)}
                        />
                        <div className="absolute bottom-2 left-2">
                          <VoiceInput onTextReceived={updateInput} />
                        </div>
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            className={cn(
                              "transition-opacity",
                              !currentContent.input && "opacity-0"
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
                    {currentContent.output && (
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
                        {currentContent.output || (
                          <span className="text-muted-foreground">
                            Your improved text will appear here...
                          </span>
                        )}
                      </div>
                    </div>
                    {currentContent.output && (
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
