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
    <div className={`custom-select ${open ? "open" : ""}`} ref={rootRef}>
      {showLabel ? <label htmlFor={id}>{label}</label> : null}
      <button
        id={id}
        className="custom-select-trigger"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="custom-select-copy">
          <span className="custom-select-title">{selected.label}</span>
          {selected.caption ? (
            <span className="custom-select-caption">{selected.caption}</span>
          ) : null}
        </span>
        <span className="custom-select-meta">
          {showBadge ? (
            <span className="custom-select-badge">{selected.badge ?? selected.value}</span>
          ) : null}
          <ChevronDown aria-hidden="true" />
        </span>
      </button>
      {open ? (
        <div className="custom-select-popover">
          <div className="custom-select-list" role="listbox" aria-label={label}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`custom-select-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="custom-select-copy">
                    <span className="custom-select-title">{option.label}</span>
                    {option.caption ? (
                      <span className="custom-select-caption">{option.caption}</span>
                    ) : null}
                  </span>
                  <span className="custom-select-meta">
                    {showBadge ? (
                      <span className="custom-select-badge">{option.badge ?? option.value}</span>
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
