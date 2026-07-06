// 푸터 연도 자동 표시
document.getElementById('year').textContent = new Date().getFullYear();

// 헤더 스크롤 상태 토글
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// 모바일 메뉴 토글
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
  iconOpen.classList.toggle('hidden', isHidden);
  iconClose.classList.toggle('hidden', !isHidden);
});

// 모바일 메뉴에서 링크 클릭 시 닫기
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  });
});

// 스크롤 스파이: 현재 섹션에 해당하는 네비게이션 링크 강조
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((section) => spyObserver.observe(section));

// 스크롤 등장 애니메이션 (reveal, skill-item)
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal, .skill-item').forEach((el) => revealObserver.observe(el));

// 맨 위로 이동 버튼
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 히어로 카운트업 숫자 애니메이션
function animateCountUp(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.count-up').forEach((el) => animateCountUp(el));

// 백테스팅 대시보드 월별 수익률 히트맵 (예시 데이터)
const heatmapData = [
  { year: 2022, values: [-3.2, -8.1, 2.4, -5.6, 0.9, -7.3, 6.1, -1.8, -9.4, 3.2, 5.6, -2.1] },
  { year: 2023, values: [4.1, 2.8, -1.5, 6.7, 3.3, -2.9, 7.8, 1.2, -3.6, 4.9, 2.1, 5.4] },
  { year: 2024, values: [1.9, 6.3, 4.7, -2.1, 8.2, 5.5, -4.3, 3.1, 7.6, -1.9, 9.4, 3.8] },
  { year: 2025, values: [5.6, -2.3, 8.9, 4.1, 10.2, 6.7, -3.4, 7.9, 2.6, 11.3, -1.7, 6.4] },
  { year: 2026, values: [7.2, 3.9, 9.1, 5.8, 12.4, 8.1, null, null, null, null, null, null] },
];

function heatmapCellStyle(value) {
  if (value === null || value === undefined) {
    return { bg: 'rgba(255,255,255,0.03)', color: '#475569', text: '-' };
  }
  const intensity = Math.min(Math.abs(value) / 15, 1);
  const bg = value >= 0
    ? `rgba(34,197,94,${(0.1 + intensity * 0.55).toFixed(2)})`
    : `rgba(244,63,94,${(0.1 + intensity * 0.55).toFixed(2)})`;
  const color = intensity > 0.4 ? '#ffffff' : value >= 0 ? '#86efac' : '#fca5a5';
  const text = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  return { bg, color, text };
}

function renderHeatmap() {
  const tbody = document.getElementById('heatmap-body');
  if (!tbody) return;

  heatmapData.forEach(({ year, values }) => {
    const tr = document.createElement('tr');

    const yearTd = document.createElement('td');
    yearTd.textContent = `${year}년`;
    yearTd.className = 'text-left text-slate-300 font-semibold pl-1 pr-3';
    tr.appendChild(yearTd);

    values.forEach((value, monthIndex) => {
      const td = document.createElement('td');
      const { bg, color, text } = heatmapCellStyle(value);
      td.textContent = text;
      td.style.backgroundColor = bg;
      td.style.color = color;
      if (year === 2025 && monthIndex === 4) {
        td.classList.add('ring-2', 'ring-white/50');
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

renderHeatmap();

// 카운터 컴포넌트: 증가/감소 버튼으로 값 변경 (여러 개 있어도 각각 독립 동작)
document.querySelectorAll('.counter-widget').forEach((widget) => {
  const valueEl = widget.querySelector('[data-role="value"]');
  let count = parseInt(widget.dataset.count, 10) || 0;

  function render() {
    valueEl.textContent = count;
  }

  widget.querySelectorAll('.counter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      count += btn.dataset.action === 'increment' ? 1 : -1;
      render();
    });
  });

  render();
});
