import type { FieldKey, ValidationErrors } from '../types/calculator';
import { NumberInput } from './NumberInput';
import { ResetButton } from './ResetButton';

type FieldConfig = {
  key: FieldKey;
  label: string;
  placeholder: string;
  unit: string;
};

const FIELDS: FieldConfig[] = [
  { key: 'currentAveragePrice', label: '기존 평균단가', placeholder: '예: 72,000', unit: '원' },
  { key: 'currentQuantity', label: '보유 주식 수', placeholder: '예: 10', unit: '주' },
  { key: 'currentPrice', label: '현재가', placeholder: '예: 65,000', unit: '원' },
  { key: 'additionalQuantity', label: '추가 매수 수량', placeholder: '예: 5', unit: '주' },
];

type InputCardProps = {
  values: Record<FieldKey, string>;
  errors: ValidationErrors;
  isComplete: boolean;
  onChange: (field: FieldKey, raw: string) => void;
  onBlur: (field: FieldKey) => void;
  onCalculate: () => void;
  onReset: () => void;
};

// 4개 입력 필드와 계산/초기화 버튼을 담는 입력 카드.
export function InputCard({
  values,
  errors,
  isComplete,
  onChange,
  onBlur,
  onCalculate,
  onReset,
}: InputCardProps) {
  return (
    <section className="card" aria-label="입력">
      {FIELDS.map((field) => (
        <NumberInput
          key={field.key}
          id={field.key}
          label={field.label}
          placeholder={field.placeholder}
          unit={field.unit}
          value={values[field.key]}
          error={errors[field.key]}
          onChange={(raw) => onChange(field.key, raw)}
          onBlur={() => onBlur(field.key)}
        />
      ))}

      <div className="button-row">
        <ResetButton onReset={onReset} />
        <button
          type="button"
          className="btn btn--primary"
          onClick={onCalculate}
          disabled={!isComplete}
        >
          계산하기
        </button>
      </div>
    </section>
  );
}
