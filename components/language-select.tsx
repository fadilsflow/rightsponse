import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";

interface LanguageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const languages = [
  { value: "en", label: "English", group: "Popular" },
  { value: "id", label: "Indonesian", group: "Popular" },
  { value: "ms", label: "Malay", group: "Popular" },
  { value: "zh", label: "Chinese", group: "Popular" },
  { value: "ja", label: "Japanese", group: "Popular" },
  { value: "ko", label: "Korean", group: "Popular" },
  { value: "es", label: "Spanish", group: "Europe" },
  { value: "fr", label: "French", group: "Europe" },
  { value: "de", label: "German", group: "Europe" },
  { value: "it", label: "Italian", group: "Europe" },
  { value: "pt", label: "Portuguese", group: "Europe" },
  { value: "ru", label: "Russian", group: "Europe" },
  { value: "ar", label: "Arabic", group: "Others" },
  { value: "hi", label: "Hindi", group: "Others" },
  { value: "th", label: "Thai", group: "Others" },
  { value: "vi", label: "Vietnamese", group: "Others" },
];

const groupedLanguages = languages.reduce((acc, lang) => {
  if (!acc[lang.group]) {
    acc[lang.group] = [];
  }
  acc[lang.group].push(lang);
  return acc;
}, {} as Record<string, typeof languages>);

export const LanguageSelect = ({
  value,
  onValueChange,
}: LanguageSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedLanguages).map(([group, langs]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {langs.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
