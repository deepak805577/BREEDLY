"use client";

const CHIPS = [
  { emoji: "🍖", label: "Nutrition", prompt: "What should I feed my dog and how often?" },
  { emoji: "✂️", label: "Grooming", prompt: "How do I groom my dog at home?" },
  { emoji: "🏠", label: "Potty training", prompt: "How do I potty train my puppy?" },
  { emoji: "💉", label: "Vaccines", prompt: "What vaccines does my dog need and when?" },
  { emoji: "🏃", label: "Exercise", prompt: "How much exercise does my dog need daily?" },
  { emoji: "🐾", label: "Behavior", prompt: "My dog is showing signs of aggression. What should I do?" },
  { emoji: "😴", label: "Sleep", prompt: "How much sleep does my dog need?" },
  { emoji: "🦷", label: "Dental care", prompt: "How do I take care of my dog's teeth?" },
];

interface Props {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickChips({ onSelect, disabled }: Props) {
  return (
    <div className="quick-chips" role="group" aria-label="Quick questions">
      {CHIPS.map((chip) => (
        <button
          key={chip.label}
          className="chip"
          onClick={() => onSelect(chip.prompt)}
          disabled={disabled}
          title={chip.prompt}
        >
          <span aria-hidden="true">{chip.emoji}</span> {chip.label}
        </button>
      ))}
    </div>
  );
}
