// 서비스명과 설명 문구를 표시하는 상단 헤더.
export function Header() {
  return (
    <header>
      <h1 className="header__title">주식 평단 계산기</h1>
      <p className="header__desc">추가매수 후 내 평단과 예상 수익을 계산해보세요.</p>
    </header>
  );
}
