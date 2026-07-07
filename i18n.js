(function () {
  const dictionaries = {
    ko: {
      page_title: "Web Paint - 무료 MS Paint 온라인 대체 도구",
      document_title: "제목 없음 - 웹 그림판",
      file: "파일", edit: "편집", view: "보기",
      about: "서비스 소개", feedback: "기능개선문의", privacy: "개인정보", cookies: "쿠키 정책", terms: "이용약관",
      image: "이미지", tools: "도구", brushes: "브러시", shapes: "도형", colors: "색", layers: "레이어",
      new_file: "새로 만들기", open: "열기...", import: "가져오기...", save_project: "프로젝트 저장", open_project: "프로젝트 열기",
      copy: "복사", paste: "붙여넣기", cut: "잘라내기", select_all: "모두 선택", invert: "색 반전", grayscale: "흑백",
      grid: "격자", transparent_bg: "투명 배경", fullscreen: "전체 화면",
      brush_round: "브러시", brush_calligraphy: "붓글씨 브러시", brush_calligraphy_pen: "붓글씨 펜", brush_air: "에어브러시",
      brush_oil: "유화 브러시", brush_crayon: "크레용", brush_marker: "마커", brush_pencil: "일반 연필", brush_watercolor: "수채화 브러시",
      rect_select: "직사각형", free_select: "자유 형식", invert_selection: "선택 영역 반전", transparent_selection: "선택 영역 투명하게",
      delete: "삭제", resize: "크기 조정", cancel: "취소", apply: "적용", close: "닫기"
    },
    en: {
      page_title: "Web Paint - Free MS Paint Online Alternative",
      document_title: "Untitled - Web Paint",
      file: "File", edit: "Edit", view: "View",
      about: "About", feedback: "Feedback", privacy: "Privacy", cookies: "Cookies", terms: "Terms",
      image: "Image", tools: "Tools", brushes: "Brushes", shapes: "Shapes", colors: "Colors", layers: "Layers",
      new_file: "New", open: "Open...", import: "Import...", save_project: "Save project", open_project: "Open project",
      copy: "Copy", paste: "Paste", cut: "Cut", select_all: "Select all", invert: "Invert colors", grayscale: "Grayscale",
      grid: "Grid", transparent_bg: "Transparent background", fullscreen: "Fullscreen",
      brush_round: "Brush", brush_calligraphy: "Calligraphy brush", brush_calligraphy_pen: "Calligraphy pen", brush_air: "Airbrush",
      brush_oil: "Oil brush", brush_crayon: "Crayon", brush_marker: "Marker", brush_pencil: "Pencil", brush_watercolor: "Watercolor brush",
      rect_select: "Rectangle", free_select: "Free-form", invert_selection: "Invert selection", transparent_selection: "Transparent selection",
      delete: "Delete", resize: "Resize", cancel: "Cancel", apply: "Apply", close: "Close"
    },
    ja: {
      page_title: "Web Paint - 無料の MS Paint オンライン代替ツール",
      document_title: "無題 - Web ペイント",
      file: "ファイル", edit: "編集", view: "表示",
      about: "サービス紹介", feedback: "改善問い合わせ", privacy: "プライバシー", cookies: "Cookie ポリシー", terms: "利用規約",
      image: "画像", tools: "ツール", brushes: "ブラシ", shapes: "図形", colors: "色", layers: "レイヤー",
      new_file: "新規", open: "開く...", import: "読み込み...", save_project: "プロジェクト保存", open_project: "プロジェクトを開く",
      copy: "コピー", paste: "貼り付け", cut: "切り取り", select_all: "すべて選択", invert: "色を反転", grayscale: "グレースケール",
      grid: "グリッド", transparent_bg: "透明背景", fullscreen: "全画面",
      brush_round: "ブラシ", brush_calligraphy: "カリグラフィーブラシ", brush_calligraphy_pen: "カリグラフィーペン", brush_air: "エアブラシ",
      brush_oil: "油彩ブラシ", brush_crayon: "クレヨン", brush_marker: "マーカー", brush_pencil: "鉛筆", brush_watercolor: "水彩ブラシ",
      rect_select: "四角形", free_select: "自由形式", invert_selection: "選択範囲を反転", transparent_selection: "透明選択",
      delete: "削除", resize: "サイズ変更", cancel: "キャンセル", apply: "適用", close: "閉じる"
    },
    zh: {
      page_title: "Web Paint - 免费 MS Paint 在线替代工具",
      document_title: "无标题 - 网页画图",
      file: "文件", edit: "编辑", view: "查看",
      about: "服务介绍", feedback: "功能反馈", privacy: "隐私", cookies: "Cookie 政策", terms: "使用条款",
      image: "图像", tools: "工具", brushes: "画笔", shapes: "形状", colors: "颜色", layers: "图层",
      new_file: "新建", open: "打开...", import: "导入...", save_project: "保存项目", open_project: "打开项目",
      copy: "复制", paste: "粘贴", cut: "剪切", select_all: "全选", invert: "反色", grayscale: "灰度",
      grid: "网格", transparent_bg: "透明背景", fullscreen: "全屏",
      brush_round: "画笔", brush_calligraphy: "书法画笔", brush_calligraphy_pen: "书法笔", brush_air: "喷枪",
      brush_oil: "油画笔", brush_crayon: "蜡笔", brush_marker: "马克笔", brush_pencil: "铅笔", brush_watercolor: "水彩画笔",
      rect_select: "矩形", free_select: "自由形式", invert_selection: "反选", transparent_selection: "透明选择",
      delete: "删除", resize: "调整大小", cancel: "取消", apply: "应用", close: "关闭"
    },
    "zh-TW": {
      page_title: "Web Paint - 免費 MS Paint 線上替代工具",
      document_title: "未命名 - 網頁小畫家",
      file: "檔案", edit: "編輯", view: "檢視",
      about: "服務介紹", feedback: "功能回饋", privacy: "隱私權", cookies: "Cookie 政策", terms: "使用條款",
      image: "影像", tools: "工具", brushes: "筆刷", shapes: "圖形", colors: "色彩", layers: "圖層",
      new_file: "新增", open: "開啟...", import: "匯入...", save_project: "儲存專案", open_project: "開啟專案",
      copy: "複製", paste: "貼上", cut: "剪下", select_all: "全選", invert: "反轉色彩", grayscale: "灰階",
      grid: "格線", transparent_bg: "透明背景", fullscreen: "全螢幕",
      brush_round: "筆刷", brush_calligraphy: "書法筆刷", brush_calligraphy_pen: "書法筆", brush_air: "噴槍",
      brush_oil: "油畫筆", brush_crayon: "蠟筆", brush_marker: "麥克筆", brush_pencil: "鉛筆", brush_watercolor: "水彩筆刷",
      rect_select: "矩形", free_select: "自由形式", invert_selection: "反轉選取範圍", transparent_selection: "透明選取",
      delete: "刪除", resize: "調整大小", cancel: "取消", apply: "套用", close: "關閉"
    }
  };

  function normalizeLanguage(value) {
    const lower = String(value || "").toLowerCase();
    if (lower === "zh-tw" || lower === "zh-hant" || lower === "zh-hk" || lower === "zh-mo") return "zh-TW";
    const base = lower.split("-")[0];
    return dictionaries[base] ? base : "en";
  }

  function browserLanguage() {
    const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "ko"];
    return normalizeLanguage(candidates.find((value) => dictionaries[normalizeLanguage(value)]) || "en");
  }

  function preferredLanguage() {
    const saved = localStorage.getItem("webPaintLanguage");
    if (!saved) return "en";
    return saved === "auto" ? browserLanguage() : normalizeLanguage(saved);
  }

  function applyLanguage(language) {
    const lang = dictionaries[language] ? language : "en";
    const dict = dictionaries[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (!dict[key]) return;
      if (node.tagName === "TITLE") document.title = dict[key];
      else node.textContent = dict[key];
    });
  }

  const select = document.getElementById("languageSelect");
  if (select) {
    if (!select.querySelector('option[value="zh-TW"]')) {
      select.insertAdjacentHTML("beforeend", '<option value="zh-TW">繁體中文</option>');
    }
    select.value = localStorage.getItem("webPaintLanguage") || "en";
    select.addEventListener("change", () => {
      localStorage.setItem("webPaintLanguage", select.value);
      applyLanguage(preferredLanguage());
    });
  }

  applyLanguage(preferredLanguage());
})();
