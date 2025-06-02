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

const groupedTones = tones.reduce((acc, tone) => {
  if (!acc[tone.group]) {
    acc[tone.group] = [];
  }
  acc[tone.group].push(tone);
  return acc;
}, {} as Record<string, typeof tones>);

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
