"use client";

import { LanguageSelect } from "@/components/language-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToneSelect } from "@/components/tone-select";
import {
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [comment, setComment] = useState("");
  const [outputText, setOutputText] = useState("");
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"message" | "email" | "comment">(
    "message"
  );

  const handleSubmit = async (type: "message" | "email" | "comment") => {
    if (!inputText.trim()) {
      toast("Please enter your message");
      return;
    }

    if (type === "comment" && !comment.trim()) {
      toast("Please enter the comment you're replying to");
      return;
    }

    setIsLoading(true);
    try {
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

      const data = await response.json();
      if (data.result) {
        setOutputText(data.result);
        toast("Your text has been improved");
      }
    } catch (error) {
      toast.error("Failed to process your request");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast("Text copied to clipboard");
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "email":
        return "Write your email content here. The AI will automatically format it with a subject line, greeting, and closing.";
      case "comment":
        return "Write your reply here...";
      default:
        return "Write your message here...";
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
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
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
              <Card className="lg:sticky lg:top-8 h-fit">
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
                    {activeTab === "message" && "Write your message to improve"}
                    {activeTab === "email" && "Write your email content"}
                    {activeTab === "comment" && "Write your reply"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTab === "comment" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Original Comment
                        </label>
                        <Textarea
                          placeholder="Paste the comment you're replying to..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="h-24 resize-none"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {activeTab === "message" && "Your Message"}
                        {activeTab === "email" && "Email Content"}
                        {activeTab === "comment" && "Your Reply"}
                      </label>
                      <div className="relative">
                        <Textarea
                          placeholder={getPlaceholder()}
                          className="min-h-[200px] pr-12 resize-none"
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
                <CardHeader>
                  <CardTitle>Improved Version</CardTitle>
                  <CardDescription>
                    AI-enhanced text with your selected style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute top-2 right-2">
                        {outputText && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyToClipboard}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-pre-wrap">
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
