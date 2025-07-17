import { useState, useRef, useEffect } from "react";

type Trainer = { id: string; name: string; surname: string };

type Props = {
  label: string;
  trainers: Trainer[];
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
  excludeIds?: string[];
};

export default function TrainerSearchBox({
  label,
  trainers,
  selected,
  onChange,
  multi,
  excludeIds = [],
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTrainer =
    !multi && typeof selected === "string"
      ? trainers.find((t) => t.id === selected)
      : null;

  const selectedCoTrainers =
    multi && Array.isArray(selected)
      ? trainers.filter((t) => selected.includes(t.id))
      : [];

  useEffect(() => {
    if (!multi && typeof selected === "string" && !open) {
      setQuery(selectedTrainer ? `${selectedTrainer.name} ${selectedTrainer.surname}` : "");
    }
    if (multi && Array.isArray(selected) && !open) {
      setQuery(
        selectedCoTrainers.length > 0
          ? selectedCoTrainers.map(t => `${t.name} ${t.surname}`).join(", ")
          : ""
      );
    }
    // eslint-disable-next-line
  }, [selected, open]);

  const handleFocus = () => {
    setOpen(true);
    setQuery("");
  };

  const filtered = trainers.filter(
    (t) =>
      !excludeIds.includes(t.id) &&
      (`${t.name} ${t.surname}`.toLowerCase().includes(query.toLowerCase()) ||
        (!query &&
          (
            (!multi && typeof selected === "string" && t.id === selected) ||
            (multi && Array.isArray(selected) && selected.includes(t.id))
          )
        )
      )
  );

  // Für das Dropdown: Ausgewählte Co-Trainer oben, Rest darunter
  let dropdownList: Trainer[] = [];
  if (multi && Array.isArray(selected)) {
    const selectedIds = new Set(selected);
    const selectedItems = filtered.filter(t => selectedIds.has(t.id));
    const unselectedItems = filtered.filter(t => !selectedIds.has(t.id));
    dropdownList = [...selectedItems, ...unselectedItems];
  } else {
    dropdownList = filtered;
  }

  const handleBlur = () => setTimeout(() => setOpen(false), 120);

  return (
    <div className="space-y-1 relative">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <input
        ref={inputRef}
        type="text"
        placeholder="Suchen..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm mb-1"
        autoComplete="off"
        readOnly={
          (!multi && typeof selected === "string" && !open) ||
          (multi && Array.isArray(selected) && !open)
        }
        style={{
          cursor:
            (!multi && typeof selected === "string" && !open) ||
            (multi && Array.isArray(selected) && !open)
              ? "pointer"
              : "text"
        }}
      />
      {open && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow max-h-40 overflow-auto z-100">
          {dropdownList.map((trainer) => {
            const isSelected =
              (!multi && typeof selected === "string" && selected === trainer.id) ||
              (multi && Array.isArray(selected) && selected.includes(trainer.id));
            return (
              <li key={trainer.id}>
                <button
                  type="button"
                  className={`flex w-full text-left items-center px-2 py-1 cursor-pointer hover:bg-blue-100 transition
                    ${isSelected && !multi ? "bg-blue-50 font-semibold text-blue-700" : ""}
                    ${isSelected && multi ? "bg-blue-50 font-semibold text-blue-700" : ""}
                  `}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    if (multi) {
                      if (Array.isArray(selected) && selected.includes(trainer.id)) {
                        onChange((selected as string[]).filter(id => id !== trainer.id));
                      } else {
                        onChange([...(selected as string[]), trainer.id]);
                      }
                    } else {
                      onChange(trainer.id);
                      setOpen(false);
                    }
                  }}
                >
                  {multi ? (
                    <input
                      type="checkbox"
                      checked={Array.isArray(selected) && selected.includes(trainer.id)}
                      readOnly
                      className="mr-2"
                    />
                  ) : null}
                  {trainer.name} {trainer.surname}
                  {isSelected && !multi && (
                    <span className="ml-auto text-xs text-blue-700 font-bold">✓</span>
                  )}
                </button>
              </li>
            );
          })}
          {dropdownList.length === 0 && (
            <li className="px-2 py-1 text-xs text-gray-400">Kein Treffer</li>
          )}
        </ul>
      )}
    </div>
  );
}