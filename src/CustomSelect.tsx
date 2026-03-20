import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type CustomSelectOption = {
  value: string;
  label: string;
  caption?: string;
  badge?: string;
};

type CustomSelectProps = {
  id?: string;
  label: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  showBadge?: boolean;
  showLabel?: boolean;
};

const CustomSelect = ({
  id,
  label,
  value,
  options,
  onChange,
  showBadge = true,
  showLabel = true,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  return (
    <div className={`ui-language-select ${open ? "open" : ""}`} ref={rootRef}>
      {showLabel ? <label htmlFor={id}>{label}</label> : null}
      <button
        id={id}
        className="ui-language-trigger"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="ui-language-trigger-copy">
          <span className="ui-language-trigger-title">{selected?.label}</span>
          {selected?.caption ? (
            <span className="ui-language-trigger-caption">{selected.caption}</span>
          ) : null}
        </span>
        <span className="ui-language-trigger-meta">
          {showBadge ? (
            <span className="ui-language-code">{selected?.badge ?? selected?.value}</span>
          ) : null}
          <ChevronDown aria-hidden="true" />
        </span>
      </button>
      {open ? (
        <div className="ui-language-popover">
          <div className="ui-language-list" role="listbox" aria-label={label}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`ui-language-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="ui-language-option-copy">
                    <span className="ui-language-option-title">{option.label}</span>
                    {option.caption ? (
                      <span className="ui-language-option-caption">{option.caption}</span>
                    ) : null}
                  </span>
                  <span className="ui-language-option-meta">
                    {showBadge ? (
                      <span className="ui-language-code">{option.badge ?? option.value}</span>
                    ) : null}
                    {isSelected ? <Check aria-hidden="true" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
