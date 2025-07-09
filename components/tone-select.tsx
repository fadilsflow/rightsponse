import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";

interface ToneSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Daftar semua tone yang tersedia beserta kategorinya
const tones = [
  { value: "professional", label: "Professional", group: "Business" },
  { value: "formal", label: "Formal", group: "Business" },
  { value: "polite", label: "Polite", group: "Business" },
  { value: "confident", label: "Confident", group: "Business" },
  { value: "friendly", label: "Friendly", group: "Casual" },
  { value: "casual", label: "Casual", group: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic", group: "Casual" },
  { value: "empathetic", label: "Empathetic", group: "Emotional" },
  { value: "apologetic", label: "Apologetic", group: "Emotional" },
  { value: "grateful", label: "Grateful", group: "Emotional" },
  { value: "diplomatic", label: "Diplomatic", group: "Special" },
  { value: "persuasive", label: "Persuasive", group: "Special" },
  { value: "urgent", label: "Urgent", group: "Special" },
];

// Mengelompokkan tones berdasarkan properti "group" menjadi format:
// { Business: [...], Casual: [...], Emotional: [...], Special: [...] }
const groupedTones = tones.reduce((acc, tone) => {
  if (!acc[tone.group]) {
    acc[tone.group] = [];
  }
  acc[tone.group].push(tone);
  return acc;
}, {} as Record<string, typeof tones>);

// Komponen utama yang ditampilkan di UI
export const ToneSelect = ({ value, onValueChange }: ToneSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Tone" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedTones).map(([group, tones]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {tones.map((tone) => (
              <SelectItem key={tone.value} value={tone.value}>
                {tone.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
