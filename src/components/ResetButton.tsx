// 모든 입력값과 결과를 초기화하는 버튼.
type ResetButtonProps = {
  onReset: () => void;
};

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button type="button" className="btn btn--reset" onClick={onReset}>
      초기화
    </button>
  );
}
