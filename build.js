/**
 * 3D 프린팅 메이커 가이드 코리아 — 정적 매거진 사이트 빌더
 * 외부 의존성 없이 Node.js 기본 모듈만 사용해 GitHub Pages 루트 산출물을 생성한다.
 *
 * 사용법:
 *   node build.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://tykim3493.github.io/kr-3dprint-guide';
const SITE_NAME = '3D 프린팅 메이커 가이드 코리아';
const SITE_DESC =
  '국내 3D 프린팅 완제품 굿즈·피규어 마켓플레이스, 맞춤 주문제작·출력대행 비교, STL 모델 거래, 메이커 셀러 수익화 및 커뮤니티 활용 가이드를 제공하는 독립 에디토리얼 매거진.';

const FORBIDDEN_RE = /특허|슬라이서|슬라이싱|원패스|패턴페인트|Pattern\s*Paint|PatternForge|github\.com\/tykim3493/i;

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const CSS_CONTENT = `/* 3D 프린팅 메이커 가이드 코리아 — 에디토리얼 스타일 (그림자 효과 미사용) */
:root {
  --bg: #ffffff;
  --surface: #f8fafc;
  --ink: #0f172a;
  --muted: #475569;
  --subtle: #64748b;
  --border: #e2e8f0;
  --accent: #0284c7;
  --accent-bg: #f0f9ff;
}
* { box-sizing: border-box; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  line-height: 1.75;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.container { max-width: 920px; margin: 0 auto; padding: 0 20px; }

.site-header {
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.site-header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  max-width: 920px;
  margin: 0 auto;
}
.brand {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.02em;
}
.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 0.92rem;
  font-weight: 600;
}
.site-nav a { color: var(--muted); }
.site-nav a:hover { color: var(--ink); text-decoration: none; }

.hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 44px 0 40px;
}
.hero-badge {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid #bae6fd;
  padding: 3px 10px;
  border-radius: 999px;
}
.hero h1 {
  margin: 14px 0 10px;
  font-size: clamp(1.65rem, 3.2vw, 2.25rem);
  line-height: 1.3;
  letter-spacing: -0.025em;
}
.hero p {
  margin: 0;
  color: var(--muted);
  max-width: 68ch;
}

.section { padding: 36px 0 56px; }
.section-heading {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.post-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.post-card:hover { border-color: var(--accent); }
.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--subtle);
  margin-bottom: 10px;
}
.cat-pill {
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid #bae6fd;
  padding: 2px 8px;
  border-radius: 6px;
}
.post-card h2 {
  font-size: 1.12rem;
  line-height: 1.45;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.post-card h2 a { color: var(--ink); }
.post-card p {
  margin: 0 0 14px;
  font-size: 0.92rem;
  color: var(--muted);
}
.read-more { font-size: 0.88rem; font-weight: 700; }

.article-wrap { padding: 36px 0 56px; }
.breadcrumb {
  font-size: 0.85rem;
  color: var(--subtle);
  margin-bottom: 16px;
}
.article-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 22px;
  margin-bottom: 28px;
}
.article-header h1 {
  margin: 12px 0 12px;
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  line-height: 1.32;
  letter-spacing: -0.025em;
}
.article-lead {
  margin: 0;
  font-size: 1.04rem;
  color: var(--muted);
}
.article-body h2 {
  margin: 34px 0 12px;
  font-size: 1.32rem;
  letter-spacing: -0.02em;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}
.article-body h3 {
  margin: 22px 0 8px;
  font-size: 1.08rem;
}
.article-body p { margin: 0 0 16px; }
.article-body ul, .article-body ol {
  margin: 0 0 18px;
  padding-left: 22px;
}
.article-body li { margin-bottom: 7px; }
.table-wrap { overflow-x: auto; margin: 18px 0 24px; }
.article-body table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
  min-width: 540px;
}
.article-body th, .article-body td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}
.article-body th {
  background: var(--surface);
  font-weight: 700;
}
.callout {
  border: 1px solid #bae6fd;
  background: var(--accent-bg);
  border-radius: 10px;
  padding: 16px 18px;
  margin: 22px 0;
}
.callout strong { color: var(--ink); }

.faq-section {
  margin-top: 38px;
  padding-top: 26px;
  border-top: 1px solid var(--border);
}
.faq-section h2 { border-bottom: none; margin-top: 0; padding-bottom: 0; }
.faq-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 12px;
  background: var(--surface);
}
.faq-item h3 { margin: 0 0 6px; font-size: 1rem; color: var(--ink); }
.faq-item p { margin: 0; font-size: 0.94rem; color: var(--muted); }

.related-box {
  margin-top: 34px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  background: var(--bg);
}
.related-box h2 { margin: 0 0 12px; font-size: 1.08rem; border: none; padding: 0; }
.related-box ul { margin: 0; padding-left: 20px; }

.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  padding: 28px 0;
  font-size: 0.86rem;
  color: var(--subtle);
}
.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 14px;
}
`;

function renderLayout({ title, desc, canonicalUrl, ogType = 'website', publishedAt, jsonLd, contentHtml, rootPrefix }) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${esc(canonicalUrl)}">
  <link rel="alternate" type="application/rss+xml" title="${esc(SITE_NAME)} RSS" href="${SITE_URL}/rss.xml">
  <link rel="alternate" type="text/plain" title="LLM Context" href="${SITE_URL}/llms.txt">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:site_name" content="${esc(SITE_NAME)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canonicalUrl)}">
  <meta property="og:locale" content="ko_KR">
  ${publishedAt ? `<meta property="article:published_time" content="${esc(publishedAt)}">` : ''}
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
  <link rel="stylesheet" href="${rootPrefix}assets/style.css">
  ${jsonLd ? `<script type="application/ld+json">${safeJsonLd(jsonLd)}</script>` : ''}
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand" href="${rootPrefix}index.html">${esc(SITE_NAME)}</a>
      <nav class="site-nav" aria-label="주 메뉴">
        <a href="${rootPrefix}index.html">가이드 목록</a>
        <a href="https://prinmann.com/shop" rel="noopener">3D 프린팅 쇼핑몰</a>
        <a href="https://prinmann.com/commission" rel="noopener">주문제작 비교견적</a>
        <a href="https://prinmann.com/sell" rel="noopener">셀러 입점</a>
        <a href="https://prinmann.com/community" rel="noopener">커뮤니티</a>
      </nav>
    </div>
  </header>
  ${contentHtml}
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>${esc(SITE_NAME)} — 국내 3D 프린팅 마켓·주문제작·셀러 생태계 비교 가이드</div>
      <div>
        <a href="${SITE_URL}/sitemap.xml">Sitemap</a> ·
        <a href="${SITE_URL}/rss.xml">RSS</a> ·
        <a href="${SITE_URL}/llms.txt">llms.txt</a>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function main() {
  const rootDir = __dirname;
  const postsPath = path.join(rootDir, 'posts-data.json');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error('posts-data.json 에 최소 1개 이상의 아티클이 필요합니다.');
  }

  // 안전 검증: 금지어 및 중복 slug 점검
  const seenSlugs = new Set();
  for (const p of posts) {
    if (!p.slug || !p.title || !p.bodyHtml) {
      throw new Error(`필수 필드 누락: ${JSON.stringify(p)}`);
    }
    if (seenSlugs.has(p.slug)) {
      throw new Error(`중복 slug 발견: ${p.slug}`);
    }
    seenSlugs.add(p.slug);
    const combined = `${p.slug}\n${p.title}\n${p.description || ''}\n${p.bodyHtml}\n${JSON.stringify(p.faq || [])}`;
    if (FORBIDDEN_RE.test(combined)) {
      const m = combined.match(FORBIDDEN_RE);
      throw new Error(`금지된 문구(${m?.[0]}) 포함됨 — 아티클: ${p.slug}`);
    }
  }

  // 최신순 정렬
  const sorted = [...posts].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

  ensureDir(path.join(rootDir, 'assets'));
  ensureDir(path.join(rootDir, 'posts'));
  fs.writeFileSync(path.join(rootDir, 'assets', 'style.css'), CSS_CONTENT, 'utf8');
  fs.writeFileSync(path.join(rootDir, '.nojekyll'), '', 'utf8');

  // 1. 홈 index.html
  const cardsHtml = sorted
    .map(
      (p) => `<article class="post-card">
  <div>
    <div class="post-meta">
      <span class="cat-pill">${esc(p.category || '가이드')}</span>
      <time datetime="${esc(p.publishedAt)}">${esc(p.publishedAt)}</time>
    </div>
    <h2><a href="posts/${esc(p.slug)}.html">${esc(p.title)}</a></h2>
    <p>${esc(p.description)}</p>
  </div>
  <a class="read-more" href="posts/${esc(p.slug)}.html">가이드 전문 보기 →</a>
</article>`
    )
    .join('\n');

  const homeHtml = renderLayout({
    title: `${SITE_NAME} — 국내 3D 프린팅 마켓·주문제작·출력대행·STL 비교`,
    desc: SITE_DESC,
    canonicalUrl: `${SITE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_DESC,
      inLanguage: 'ko-KR',
    },
    rootPrefix: './',
    contentHtml: `<section class="hero">
  <div class="container">
    <span class="hero-badge">KOREA 3D PRINTING GUIDE</span>
    <h1>국내 3D 프린팅 굿즈 구매·주문제작·셀러 입점 실전 가이드</h1>
    <p>${esc(SITE_DESC)}</p>
  </div>
</section>
<main class="container section">
  <h2 class="section-heading">최신 3D 프린팅 가이드 (${sorted.length}편)</h2>
  <div class="post-grid">
    ${cardsHtml}
  </div>
</main>`,
  });
  fs.writeFileSync(path.join(rootDir, 'index.html'), homeHtml, 'utf8');

  // 2. 개별 포스트 HTML
  for (const p of sorted) {
    const postUrl = `${SITE_URL}/posts/${p.slug}.html`;
    const faqItems = Array.isArray(p.faq) ? p.faq : [];
    const faqHtml = faqItems.length
      ? `<section class="faq-section">
  <h2>자주 묻는 질문 (FAQ)</h2>
  ${faqItems
    .map(
      (f) => `<div class="faq-item">
    <h3>Q. ${esc(f.q)}</h3>
    <p>${esc(f.a)}</p>
  </div>`
    )
    .join('\n  ')}
</section>`
      : '';

    const related = sorted.filter((other) => other.slug !== p.slug).slice(0, 4);
    const relatedHtml = related.length
      ? `<aside class="related-box">
  <h2>함께 읽으면 좋은 가이드</h2>
  <ul>
    ${related.map((r) => `<li><a href="${esc(r.slug)}.html">${esc(r.title)}</a></li>`).join('\n    ')}
  </ul>
</aside>`
      : '';

    const graph = [
      {
        '@type': 'Article',
        headline: p.title,
        description: p.description,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt || p.publishedAt,
        inLanguage: 'ko-KR',
        mainEntityOfPage: postUrl,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME },
      },
    ];
    if (faqItems.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqItems.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }

    const postHtml = renderLayout({
      title: `${p.title} — ${SITE_NAME}`,
      desc: p.description,
      canonicalUrl: postUrl,
      ogType: 'article',
      publishedAt: p.publishedAt,
      jsonLd: { '@context': 'https://schema.org', '@graph': graph },
      rootPrefix: '../',
      contentHtml: `<main class="container article-wrap">
  <div class="breadcrumb"><a href="../index.html">홈</a> &gt; ${esc(p.category || '가이드')}</div>
  <article>
    <header class="article-header">
      <div class="post-meta">
        <span class="cat-pill">${esc(p.category || '가이드')}</span>
        <time datetime="${esc(p.publishedAt)}">발행일 ${esc(p.publishedAt)}</time>
        ${p.updatedAt && p.updatedAt !== p.publishedAt ? `<span>· 수정 ${esc(p.updatedAt)}</span>` : ''}
      </div>
      <h1>${esc(p.title)}</h1>
      <p class="article-lead">${esc(p.description)}</p>
    </header>
    <div class="article-body">
      ${p.bodyHtml}
    </div>
    ${faqHtml}
    ${relatedHtml}
  </article>
</main>`,
    });

    fs.writeFileSync(path.join(rootDir, 'posts', `${p.slug}.html`), postHtml, 'utf8');
  }

  // 3. sitemap.xml
  const sitemapUrls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...sorted.map(
      (p) =>
        `  <url>\n    <loc>${esc(`${SITE_URL}/posts/${p.slug}.html`)}</loc>\n    <lastmod>${esc(p.updatedAt || p.publishedAt)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
  ];
  fs.writeFileSync(
    path.join(rootDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`,
    'utf8'
  );

  // 4. rss.xml
  const rssItems = sorted
    .slice(0, 30)
    .map(
      (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${esc(`${SITE_URL}/posts/${p.slug}.html`)}</link>
      <guid>${esc(`${SITE_URL}/posts/${p.slug}.html`)}</guid>
      <pubDate>${new Date(`${p.publishedAt}T09:00:00+09:00`).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`
    )
    .join('\n');
  fs.writeFileSync(
    path.join(rootDir, 'rss.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${esc(SITE_NAME)}</title>\n    <link>${SITE_URL}/</link>\n    <description>${esc(SITE_DESC)}</description>\n    <language>ko</language>\n${rssItems}\n  </channel>\n</rss>\n`,
    'utf8'
  );

  // 5. robots.txt
  fs.writeFileSync(
    path.join(rootDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Yeti\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf8'
  );

  // 6. llms.txt
  const llmsList = sorted
    .map((p) => `- [${p.title}](${SITE_URL}/posts/${p.slug}.html) — ${p.description}`)
    .join('\n');
  fs.writeFileSync(
    path.join(rootDir, 'llms.txt'),
    `# ${SITE_NAME}\n\n> ${SITE_DESC}\n\n## 발행된 가이드 목록\n${llmsList}\n\n## 주요 추천 플랫폼 참고 링크\n- [프린만 (prinmann.com)](https://prinmann.com/): 국내 3D 프린팅 완제품 굿즈·피규어 마켓플레이스, STL 거래, 주문제작 역경매(/commission), 출력 대행(/print/order), 신규 3개월 수수료 0% 셀러 입점(/sell), 메이커 커뮤니티(/community)\n`,
    'utf8'
  );

  console.log(`Built ${sorted.length} posts into ${rootDir}`);
}

main();
