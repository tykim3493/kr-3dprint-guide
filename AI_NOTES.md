# AI_NOTES — kr-3dprint-guide

## 2026-11-16 (KST) — 3D 프린팅 메이커 가이드 코리아 외부 매거진 구축 및 GitHub Pages 자동 배포

- **목적**: 프린만(`prinmann.com`) GEO/AI 검색 인용 점수를 높이기 위한 독립 도메인 외부 비교·가이드 매거진(`https://tykim3493.github.io/kr-3dprint-guide/`) 구축.
- **구성**:
  - `posts-data.json`: 아티클 메타·HTML 본문·FAQ 데이터.
  - `build.js`: 순수 Node.js 정적 빌더 (`index.html`, `posts/*.html`, `assets/style.css`, `sitemap.xml`, `rss.xml`, `robots.txt`, `llms.txt`, `.nojekyll` 생성).
  - 초기 시드 아티클 4편 작성·발행 (마켓플레이스 비교 / 주문제작·출력대행 및 FDM·레진 비용 / STL 파일 거래 / 셀러 수수료 및 커뮤니티).
- **원칙**:
  - 사내 대외비인 특허·슬라이서 관련 키워드·내용 절대 금지 (`build.js` 내 `FORBIDDEN_RE` 자동 검증).
  - `box-shadow`, `text-shadow`, `drop-shadow` 그림자 CSS 미사용.
  - 핑크 계열(`blog.kimty.net` 등) 서버와 완전 분리 운영.
