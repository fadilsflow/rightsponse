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
  { value: "en", label: "English", group: "Language" },
  { value: "id", label: "Indonesian", group: "Language" },
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
