// 숫자 입력 전용 컴포넌트. 콤마 포맷/단위 표시/에러 상태를 다룬다.
type NumberInputProps = {
  id: string;
  label: string;
  placeholder: string;
  unit: string;
  value: string;
  error?: string;
  onChange: (raw: string) => void;
  onBlur?: () => void;
};

export function NumberInput({
  id,
  label,
  placeholder,
  unit,
  value,
  error,
  onChange,
  onBlur,
}: NumberInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={`input-wrap${error ? ' input-wrap--error' : ''}`}>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span className="input-wrap__unit" aria-hidden="true">
          {unit}
        </span>
      </div>
      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
