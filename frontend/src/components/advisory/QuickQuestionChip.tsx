export default function QuickQuestionChip({
  question,
  onClick,
}: {
  question: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink hover:border-forest-500 hover:text-forest-700 transition-colors whitespace-nowrap"
    >
      {question}
    </button>
  );
}
