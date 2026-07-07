(function () {
  const supported = ["ko", "en", "ja", "zh", "zh-TW"];

  const labels = {
    ko: {
      brand: "웹 그림판",
      auto: "자동",
      nav: ["서비스 소개", "기능개선문의", "개인정보", "쿠키 정책", "이용약관"]
    },
    en: {
      brand: "Web Paint",
      auto: "Auto",
      nav: ["About", "Feedback", "Privacy", "Cookies", "Terms"]
    },
    ja: {
      brand: "Web ペイント",
      auto: "自動",
      nav: ["サービス紹介", "改善問い合わせ", "プライバシー", "Cookie ポリシー", "利用規約"]
    },
    zh: {
      brand: "网页画图",
      auto: "自动",
      nav: ["服务介绍", "功能反馈", "隐私", "Cookie 政策", "使用条款"]
    },
    "zh-TW": {
      brand: "網頁小畫家",
      auto: "自動",
      nav: ["服務介紹", "功能回饋", "隱私權", "Cookie 政策", "使用條款"]
    }
  };

  const pages = {
    about: {
      ko: {
        title: "서비스 소개 - 웹 그림판",
        html: `
          <section class="info-hero">
            <p class="info-kicker">Browser Paint Studio</p>
            <h1>익숙한 그림판을 브라우저 안으로 옮겼습니다.</h1>
            <p>웹 그림판은 Mac이나 Chromebook에서도 Windows 그림판처럼 빠르게 그리고, 잘라내고, 저장할 수 있도록 만든 정적 웹앱입니다. 설치 없이 열고, 작업은 사용자의 브라우저 안에서 처리됩니다.</p>
            <div class="info-actions"><a class="info-primary" href="index.html">그림판 열기</a><a class="info-secondary" href="feedback.html">개선 의견 보내기</a></div>
          </section>
          <section class="info-grid">
            <article class="info-panel"><h2>그리기 도구</h2><p>펜, 브러시, 에어브러시, 유화, 크레용, 마커, 수채화 브러시를 제공하며 굵기와 불투명도를 조절할 수 있습니다.</p></article>
            <article class="info-panel"><h2>선택과 편집</h2><p>직사각형 선택, 자유형 선택, 복사/붙여넣기, 자르기, 크기 조절, 회전, 뒤집기 같은 기본 편집 흐름을 지원합니다.</p></article>
            <article class="info-panel"><h2>도형과 텍스트</h2><p>선, 사각형, 원, 화살표, 말풍선 등 자주 쓰는 도형과 폰트, 크기, 굵기, 정렬을 조절하는 텍스트 도구를 제공합니다.</p></article>
            <article class="info-panel"><h2>서버 없는 작업</h2><p>이미지는 기본적으로 서버에 업로드되지 않고 브라우저에서 처리됩니다. 완성된 파일은 PNG, JPEG, WebP로 저장할 수 있습니다.</p></article>
          </section>
          <section class="info-section"><h2>이 사이트가 필요한 이유</h2><p>운영체제를 바꾸면 익숙한 기본 앱 하나가 사라지는 것만으로도 작업 흐름이 끊길 수 있습니다. 웹 그림판은 복잡한 디자인 툴이 아니라, 스크린샷에 표시하고, 간단히 자르고, 설명 이미지를 빠르게 만드는 일상적인 목적에 맞춰져 있습니다.</p><ul class="info-checks"><li>공용 PC에서도 설치 없이 사용 가능</li><li>광고가 추가되더라도 작업 캔버스와 분리된 배치 지향</li><li>개인정보, 쿠키, 문의, 약관 페이지를 별도로 제공</li></ul></section>`
      },
      en: {
        title: "About - Web Paint",
        html: `
          <section class="info-hero">
            <p class="info-kicker">Browser Paint Studio</p>
            <h1>The familiar Paint experience, moved into the browser.</h1>
            <p>Web Paint is a static web app for drawing, cropping, annotating, and saving images quickly on Mac, Chromebook, shared computers, and any modern browser. No installation is required, and drawing work is handled in your browser.</p>
            <div class="info-actions"><a class="info-primary" href="index.html">Open Paint</a><a class="info-secondary" href="feedback.html">Send feedback</a></div>
          </section>
          <section class="info-grid">
            <article class="info-panel"><h2>Drawing Tools</h2><p>Use pencil, brush, airbrush, oil brush, crayon, marker, and watercolor styles with adjustable size and opacity.</p></article>
            <article class="info-panel"><h2>Select and Edit</h2><p>Rectangle selection, free-form selection, copy and paste, crop, resize, rotate, and flip cover the everyday editing flow.</p></article>
            <article class="info-panel"><h2>Shapes and Text</h2><p>Add lines, rectangles, circles, arrows, speech bubbles, and text with font, size, weight, and alignment controls.</p></article>
            <article class="info-panel"><h2>No Server Upload</h2><p>Images are processed locally in the browser by default. Finished work can be saved as PNG, JPEG, or WebP.</p></article>
          </section>
          <section class="info-section"><h2>Why this site exists</h2><p>Changing operating systems can break a small but important workflow when a familiar default app disappears. Web Paint is built for quick screenshots, simple marks, fast crops, and practical explanation images.</p><ul class="info-checks"><li>Works on shared computers without installation</li><li>Designed to keep future ads separate from the canvas</li><li>Includes privacy, cookie, feedback, and terms pages for transparency</li></ul></section>`
      },
      ja: {
        title: "サービス紹介 - Web ペイント",
        html: `
          <section class="info-hero">
            <p class="info-kicker">Browser Paint Studio</p>
            <h1>使い慣れたペイント体験をブラウザーへ。</h1>
            <p>Web ペイントは、Mac や Chromebook でも Windows のペイントのように素早く描き、切り抜き、注釈を入れ、保存できる静的 Web アプリです。インストールは不要で、作業はブラウザー内で処理されます。</p>
            <div class="info-actions"><a class="info-primary" href="index.html">ペイントを開く</a><a class="info-secondary" href="feedback.html">改善意見を送る</a></div>
          </section>
          <section class="info-grid">
            <article class="info-panel"><h2>描画ツール</h2><p>鉛筆、ブラシ、エアブラシ、油彩、クレヨン、マーカー、水彩ブラシを使い、太さと不透明度を調整できます。</p></article>
            <article class="info-panel"><h2>選択と編集</h2><p>四角形選択、自由選択、コピーと貼り付け、切り抜き、サイズ変更、回転、反転をサポートします。</p></article>
            <article class="info-panel"><h2>図形とテキスト</h2><p>線、四角形、円、矢印、吹き出し、フォントやサイズを調整できるテキストツールを提供します。</p></article>
            <article class="info-panel"><h2>サーバーなしの作業</h2><p>画像は基本的にブラウザー内で処理されます。完成したファイルは PNG、JPEG、WebP として保存できます。</p></article>
          </section>
          <section class="info-section"><h2>このサイトの目的</h2><p>OS を変えると、慣れた標準アプリがなくなるだけで作業の流れが途切れることがあります。Web ペイントは、スクリーンショットへの注釈、簡単な切り抜き、説明画像の作成に向けた実用的なツールです。</p><ul class="info-checks"><li>共有 PC でもインストール不要</li><li>将来の広告はキャンバス作業と分離する方針</li><li>プライバシー、Cookie、問い合わせ、利用規約ページを提供</li></ul></section>`
      },
      zh: {
        title: "服务介绍 - 网页画图",
        html: `
          <section class="info-hero">
            <p class="info-kicker">Browser Paint Studio</p>
            <h1>把熟悉的画图体验搬进浏览器。</h1>
            <p>网页画图是一款静态 Web 应用，让你在 Mac、Chromebook 或公用电脑上也能像使用 Windows 画图一样快速绘制、裁剪、标注和保存图片。无需安装，绘图工作在浏览器中完成。</p>
            <div class="info-actions"><a class="info-primary" href="index.html">打开画图</a><a class="info-secondary" href="feedback.html">发送反馈</a></div>
          </section>
          <section class="info-grid">
            <article class="info-panel"><h2>绘图工具</h2><p>提供铅笔、画笔、喷枪、油画笔、蜡笔、马克笔和水彩画笔，并可调整粗细和不透明度。</p></article>
            <article class="info-panel"><h2>选择与编辑</h2><p>支持矩形选择、自由选择、复制粘贴、裁剪、调整大小、旋转和翻转等常用编辑流程。</p></article>
            <article class="info-panel"><h2>形状和文字</h2><p>可添加线条、矩形、圆形、箭头、气泡框和文字，并调整字体、大小、粗细与对齐方式。</p></article>
            <article class="info-panel"><h2>无需服务器上传</h2><p>图片默认在浏览器中处理。完成后可保存为 PNG、JPEG 或 WebP。</p></article>
          </section>
          <section class="info-section"><h2>为什么需要这个网站</h2><p>更换操作系统后，一个熟悉的默认应用消失，也可能打断日常工作流程。网页画图面向快速截图标注、简单裁剪和说明图片制作。</p><ul class="info-checks"><li>公用电脑也可免安装使用</li><li>未来广告会尽量与画布编辑区域分离</li><li>提供隐私、Cookie、反馈和条款页面</li></ul></section>`
      },
      "zh-TW": {
        title: "服務介紹 - 網頁小畫家",
        html: `
          <section class="info-hero">
            <p class="info-kicker">Browser Paint Studio</p>
            <h1>把熟悉的小畫家體驗帶進瀏覽器。</h1>
            <p>網頁小畫家是一款靜態 Web 應用程式，讓你在 Mac、Chromebook 或共用電腦上，也能像使用 Windows 小畫家一樣快速繪圖、裁切、標註與儲存。無需安裝，工作會在瀏覽器中處理。</p>
            <div class="info-actions"><a class="info-primary" href="index.html">開啟小畫家</a><a class="info-secondary" href="feedback.html">提供改善意見</a></div>
          </section>
          <section class="info-grid">
            <article class="info-panel"><h2>繪圖工具</h2><p>提供鉛筆、筆刷、噴槍、油畫筆、蠟筆、麥克筆與水彩筆刷，並可調整粗細與不透明度。</p></article>
            <article class="info-panel"><h2>選取與編輯</h2><p>支援矩形選取、自由選取、複製貼上、裁切、調整大小、旋轉與翻轉等常用流程。</p></article>
            <article class="info-panel"><h2>圖形與文字</h2><p>可加入線條、矩形、圓形、箭頭、對話框與文字，並調整字型、大小、粗細與對齊。</p></article>
            <article class="info-panel"><h2>不需伺服器上傳</h2><p>圖片預設在瀏覽器中處理。完成後可儲存為 PNG、JPEG 或 WebP。</p></article>
          </section>
          <section class="info-section"><h2>為什麼需要這個網站</h2><p>更換作業系統時，少了一個熟悉的預設工具，也可能讓日常工作流程中斷。網頁小畫家適合快速標註截圖、簡單裁切與製作說明圖片。</p><ul class="info-checks"><li>共用電腦也可免安裝使用</li><li>未來廣告會盡量與畫布編輯區分離</li><li>提供隱私權、Cookie、回饋與使用條款頁面</li></ul></section>`
      }
    },
    feedback: {
      ko: {
        title: "기능개선문의 - 웹 그림판",
        html: `<section class="info-hero compact"><p class="info-kicker">Feedback</p><h1>그림판처럼 자연스럽게 쓰이도록 계속 다듬겠습니다.</h1><p>브러시 느낌, 선택 영역, 텍스트 박스, 도형 조작처럼 실제 사용 중 불편한 부분을 알려주세요. 정적 호스팅 환경이라 아래 양식은 사용자의 이메일 앱을 엽니다.</p></section><section class="info-two-col"><article class="info-panel"><h2>좋은 제보 예시</h2><ul class="info-checks"><li>어떤 도구를 사용했는지</li><li>예상한 동작과 실제 동작의 차이</li><li>브라우저 이름과 화면 크기</li><li>가능하다면 재현 순서</li></ul></article><article class="info-panel"><h2>우선 개선 대상</h2><p>Windows 그림판과의 UI 차이, 선택 영역 이동/복사/붙여넣기, 브러시 질감, 텍스트 입력 경험, 모바일 화면 대응을 우선적으로 개선합니다.</p></article></section>${feedbackForm("ko")}`
      },
      en: {
        title: "Feedback - Web Paint",
        html: `<section class="info-hero compact"><p class="info-kicker">Feedback</p><h1>Help make Web Paint feel more natural.</h1><p>Tell us what feels off while using brushes, selections, text boxes, shapes, or saving. Because this is a static hosted site, the form opens your email app.</p></section><section class="info-two-col"><article class="info-panel"><h2>Helpful report details</h2><ul class="info-checks"><li>Which tool you were using</li><li>Expected behavior versus actual behavior</li><li>Browser name and screen size</li><li>Steps to reproduce, if possible</li></ul></article><article class="info-panel"><h2>Improvement priorities</h2><p>We prioritize UI differences from Windows Paint, selection movement and paste behavior, brush texture, text editing, and responsive layout.</p></article></section>${feedbackForm("en")}`
      },
      ja: {
        title: "改善問い合わせ - Web ペイント",
        html: `<section class="info-hero compact"><p class="info-kicker">Feedback</p><h1>より自然に使える Web ペイントへ改善します。</h1><p>ブラシ、選択範囲、テキストボックス、図形操作、保存など、使っていて気になった点を教えてください。静的サイトのため、フォームはメールアプリを開きます。</p></section><section class="info-two-col"><article class="info-panel"><h2>役立つ報告内容</h2><ul class="info-checks"><li>使用していたツール</li><li>期待した動作と実際の動作</li><li>ブラウザー名と画面サイズ</li><li>可能であれば再現手順</li></ul></article><article class="info-panel"><h2>優先改善項目</h2><p>Windows ペイントとの差、選択範囲の移動と貼り付け、ブラシの質感、テキスト編集、レスポンシブ表示を優先して改善します。</p></article></section>${feedbackForm("ja")}`
      },
      zh: {
        title: "功能反馈 - 网页画图",
        html: `<section class="info-hero compact"><p class="info-kicker">Feedback</p><h1>帮助网页画图变得更自然易用。</h1><p>如果画笔、选择区域、文本框、形状操作或保存流程有不顺手的地方，请告诉我们。由于这是静态网站，表单会打开你的邮件应用。</p></section><section class="info-two-col"><article class="info-panel"><h2>有用的反馈信息</h2><ul class="info-checks"><li>正在使用哪个工具</li><li>预期行为和实际行为的差异</li><li>浏览器名称和屏幕尺寸</li><li>如可行，请提供复现步骤</li></ul></article><article class="info-panel"><h2>优先改进方向</h2><p>优先改进与 Windows 画图的界面差异、选择区域移动和粘贴、画笔质感、文本编辑和响应式布局。</p></article></section>${feedbackForm("zh")}`
      },
      "zh-TW": {
        title: "功能回饋 - 網頁小畫家",
        html: `<section class="info-hero compact"><p class="info-kicker">Feedback</p><h1>協助網頁小畫家變得更自然好用。</h1><p>如果筆刷、選取範圍、文字框、圖形操作或儲存流程有不順手的地方，請告訴我們。由於這是靜態網站，表單會開啟你的電子郵件應用程式。</p></section><section class="info-two-col"><article class="info-panel"><h2>有幫助的回報內容</h2><ul class="info-checks"><li>正在使用哪個工具</li><li>預期行為與實際行為差異</li><li>瀏覽器名稱與螢幕尺寸</li><li>如可行，請提供重現步驟</li></ul></article><article class="info-panel"><h2>優先改善方向</h2><p>優先改善與 Windows 小畫家的介面差異、選取範圍移動與貼上、筆刷質感、文字編輯與響應式版面。</p></article></section>${feedbackForm("zh-TW")}`
      }
    },
    privacy: {
      ko: { title: "개인정보처리방침 - 웹 그림판", html: policyPage("ko", "Privacy Policy", "사용자의 그림 파일은 기본적으로 브라우저 안에서 처리됩니다.", "웹 그림판은 서버 없이 동작하는 정적 웹앱입니다. 회원가입과 로그인을 요구하지 않으며, 사용자가 만든 이미지를 별도 서버로 업로드하지 않는 구조를 기본으로 합니다.", ["그림과 프로젝트 데이터", "캔버스에 그린 내용, 불러온 이미지, 프로젝트 데이터는 브라우저 메모리에서 처리됩니다. 저장을 선택하면 사용자의 기기에 파일로 다운로드됩니다.", "환경 설정", "언어 선택 같은 편의 설정은 브라우저의 로컬 저장소에 저장될 수 있습니다.", "문의 정보", "기능개선문의 페이지에서 이메일을 보내는 경우, 사용자가 직접 입력한 이름, 이메일 주소, 문의 내용이 이메일을 통해 전달될 수 있습니다."], "보관과 삭제", "웹 그림판은 자체 계정 시스템이나 서버 저장소를 운영하지 않습니다. 로컬 저장소의 설정은 사용자가 브라우저 설정에서 사이트 데이터를 삭제해 관리할 수 있습니다.", "광고와 쿠키 안내", "광고 서비스와 쿠키에 대한 자세한 내용은 별도 문서인 <a href=\"cookies.html\">쿠키 정책</a>에서 확인할 수 있습니다.") },
      en: { title: "Privacy Policy - Web Paint", html: policyPage("en", "Privacy Policy", "Your drawing files are processed in the browser by default.", "Web Paint is a static web app that runs without its own server-side account system. It does not require sign-up or login, and it is designed not to upload your drawings to our server.", ["Drawing and project data", "Canvas content, imported images, and project data are processed in browser memory. When you save, the file is downloaded to your device.", "Preferences", "Convenience settings such as language choice may be stored in local storage.", "Contact information", "If you send feedback by email, the name, email address, and message you enter may be transmitted through your email app."], "Retention and deletion", "Web Paint does not operate its own account database or server storage. You can manage local settings by deleting site data in your browser.", "Ads and cookies", "Details about advertising services and cookies are available in the separate <a href=\"cookies.html\">Cookie Policy</a>.") },
      ja: { title: "プライバシーポリシー - Web ペイント", html: policyPage("ja", "Privacy Policy", "画像ファイルは基本的にブラウザー内で処理されます。", "Web ペイントはサーバーなしで動作する静的 Web アプリです。会員登録やログインは不要で、作成した画像を当サイトのサーバーへアップロードしない設計です。", ["画像とプロジェクトデータ", "キャンバス内容、読み込んだ画像、プロジェクトデータはブラウザーのメモリで処理されます。保存時は端末にダウンロードされます。", "設定情報", "言語選択などの利便性設定はローカルストレージに保存される場合があります。", "問い合わせ情報", "メールで問い合わせる場合、入力した名前、メールアドレス、本文がメールアプリを通じて送信されます。"], "保存と削除", "Web ペイントは独自のアカウントシステムやサーバー保存領域を運用していません。ブラウザーのサイトデータ削除でローカル設定を管理できます。", "広告と Cookie", "広告サービスと Cookie の詳細は <a href=\"cookies.html\">Cookie ポリシー</a> をご確認ください。") },
      zh: { title: "隐私政策 - 网页画图", html: policyPage("zh", "Privacy Policy", "你的绘图文件默认在浏览器中处理。", "网页画图是无需自有服务器账户系统的静态 Web 应用。无需注册或登录，并默认不会把你的作品上传到我们的服务器。", ["绘图和项目数据", "画布内容、导入图片和项目数据在浏览器内存中处理。保存时，文件会下载到你的设备。", "偏好设置", "语言选择等便利设置可能会存储在本地存储中。", "联系信息", "如果通过邮件发送反馈，输入的姓名、邮箱和内容可能会通过邮件应用发送。"], "保留与删除", "网页画图不运营自有账号数据库或服务器存储。你可以在浏览器中删除站点数据来管理本地设置。", "广告与 Cookie", "广告服务和 Cookie 的详细信息请查看单独的 <a href=\"cookies.html\">Cookie 政策</a>。") },
      "zh-TW": { title: "隱私權政策 - 網頁小畫家", html: policyPage("zh-TW", "Privacy Policy", "你的繪圖檔案預設會在瀏覽器中處理。", "網頁小畫家是沒有自有伺服器帳號系統的靜態 Web 應用程式。不需要註冊或登入，並預設不會把你的作品上傳到我們的伺服器。", ["繪圖與專案資料", "畫布內容、匯入圖片與專案資料會在瀏覽器記憶體中處理。儲存時，檔案會下載到你的裝置。", "偏好設定", "語言選擇等便利設定可能會儲存在本機儲存空間。", "聯絡資訊", "如果透過電子郵件提供回饋，輸入的姓名、電子郵件與內容可能會透過郵件應用程式傳送。"], "保留與刪除", "網頁小畫家不營運自有帳號資料庫或伺服器儲存空間。你可以在瀏覽器中刪除網站資料來管理本機設定。", "廣告與 Cookie", "廣告服務與 Cookie 的詳細資訊請查看單獨的 <a href=\"cookies.html\">Cookie 政策</a>。") }
    },
    cookies: {
      ko: { title: "쿠키 정책 - 웹 그림판", html: cookiePage("ko", "광고와 언어 설정에 사용될 수 있는 쿠키와 저장소를 안내합니다.", "현재 웹 그림판은 언어 설정 같은 편의 기능을 위해 브라우저 저장소를 사용할 수 있으며, 향후 Google AdSense를 적용하면 광고 쿠키가 사용될 수 있습니다.") },
      en: { title: "Cookie Policy - Web Paint", html: cookiePage("en", "Cookies and browser storage may be used for language settings and advertising.", "Web Paint may use browser storage for convenience settings such as language choice. If Google AdSense is added later, advertising cookies may also be used.") },
      ja: { title: "Cookie ポリシー - Web ペイント", html: cookiePage("ja", "言語設定や広告のために Cookie とブラウザー保存領域が使用される場合があります。", "Web ペイントでは、言語選択などの利便性設定にブラウザー保存領域を使用する場合があります。将来的に Google AdSense を追加すると、広告 Cookie が使用される場合があります。") },
      zh: { title: "Cookie 政策 - 网页画图", html: cookiePage("zh", "Cookie 和浏览器存储可能用于语言设置和广告。", "网页画图可能使用浏览器存储来保存语言等便利设置。未来如接入 Google AdSense，也可能使用广告 Cookie。") },
      "zh-TW": { title: "Cookie 政策 - 網頁小畫家", html: cookiePage("zh-TW", "Cookie 與瀏覽器儲存空間可能用於語言設定與廣告。", "網頁小畫家可能使用瀏覽器儲存空間保存語言等便利設定。未來如加入 Google AdSense，也可能使用廣告 Cookie。") }
    },
    terms: {
      ko: { title: "이용약관 - 웹 그림판", html: termsPage("ko", "웹 그림판을 안전하고 책임 있게 사용하기 위한 기준입니다.", "웹 그림판은 브라우저에서 그림을 만들고 편집할 수 있는 무료 도구입니다. 사용자는 합법적인 목적과 타인의 권리를 침해하지 않는 범위에서 서비스를 사용할 수 있습니다.") },
      en: { title: "Terms - Web Paint", html: termsPage("en", "Guidelines for using Web Paint safely and responsibly.", "Web Paint is a free tool for creating and editing drawings in the browser. Use it for lawful purposes and without infringing the rights of others.") },
      ja: { title: "利用規約 - Web ペイント", html: termsPage("ja", "Web ペイントを安全かつ責任を持って使用するための基準です。", "Web ペイントはブラウザーで画像を作成・編集できる無料ツールです。合法的な目的で、他者の権利を侵害しない範囲で利用してください。") },
      zh: { title: "使用条款 - 网页画图", html: termsPage("zh", "安全、负责地使用网页画图的规则。", "网页画图是可在浏览器中创建和编辑图片的免费工具。请在合法且不侵犯他人权利的范围内使用。") },
      "zh-TW": { title: "使用條款 - 網頁小畫家", html: termsPage("zh-TW", "安全且負責任地使用網頁小畫家的規範。", "網頁小畫家是在瀏覽器中建立與編輯圖片的免費工具。請在合法且不侵犯他人權利的範圍內使用。") }
    }
  };

  function feedbackForm(lang) {
    const t = {
      ko: ["문의 보내기", "이름 또는 닉네임", "예: 그림판 사용자", "답변 받을 이메일", "문의 유형", "기능 개선 요청", "오류 제보", "사용성 의견", "기타 문의", "문의 내용", "개선했으면 하는 기능이나 오류 상황을 자세히 적어주세요.", "이메일로 문의 보내기", "배포 전에 `hello@example.com`을 실제 문의용 이메일 주소로 바꾸면 됩니다."],
      en: ["Send Feedback", "Name or nickname", "Example: Paint user", "Reply email", "Feedback type", "Feature request", "Bug report", "Usability feedback", "Other", "Message", "Describe the feature or issue in detail.", "Send by email", "Before publishing, replace `hello@example.com` with your real contact email."],
      ja: ["問い合わせを送る", "名前またはニックネーム", "例: ペイントユーザー", "返信用メール", "問い合わせ種別", "機能改善の要望", "不具合報告", "使いやすさの意見", "その他", "内容", "改善してほしい機能や不具合を詳しく書いてください。", "メールで送信", "公開前に `hello@example.com` を実際の連絡先メールに変更してください。"],
      zh: ["发送反馈", "姓名或昵称", "例如：画图用户", "回复邮箱", "反馈类型", "功能请求", "错误报告", "易用性意见", "其他", "反馈内容", "请详细描述希望改进的功能或问题。", "通过邮件发送", "发布前请将 `hello@example.com` 替换为真实联系邮箱。"],
      "zh-TW": ["提供回饋", "姓名或暱稱", "例如：小畫家使用者", "回覆電子郵件", "回饋類型", "功能改善請求", "錯誤回報", "易用性意見", "其他", "回饋內容", "請詳細描述希望改善的功能或問題。", "透過電子郵件傳送", "發布前請將 `hello@example.com` 替換為實際聯絡信箱。"]
    }[lang];
    return `<section class="info-section"><h2>${t[0]}</h2><form class="feedback-form" action="mailto:hello@example.com" method="post" enctype="text/plain"><label>${t[1]}<input name="name" autocomplete="name" placeholder="${t[2]}"></label><label>${t[3]}<input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label><label>${t[4]}<select name="type"><option>${t[5]}</option><option>${t[6]}</option><option>${t[7]}</option><option>${t[8]}</option></select></label><label>${t[9]}<textarea name="message" required placeholder="${t[10]}"></textarea></label><button type="submit">${t[11]}</button></form><p class="info-note">${t[12]}</p></section>`;
  }

  function policyPage(lang, kicker, h1, intro, items, retentionTitle, retention, adsTitle, ads) {
    return `<section class="info-hero compact"><p class="info-kicker">${kicker}</p><h1>${h1}</h1><p>${intro}</p></section><section class="info-section"><h2>${lang === "ko" ? "처리하는 정보" : lang === "ja" ? "取り扱う情報" : lang === "zh" ? "处理的信息" : lang === "zh-TW" ? "處理的資訊" : "Information we handle"}</h2><div class="policy-list"><article><h3>${items[0]}</h3><p>${items[1]}</p></article><article><h3>${items[2]}</h3><p>${items[3]}</p></article><article><h3>${items[4]}</h3><p>${items[5]}</p></article></div></section><section class="info-section"><h2>${retentionTitle}</h2><p>${retention}</p></section><section class="info-section"><h2>${adsTitle}</h2><p>${ads}</p></section>`;
  }

  function cookiePage(lang, h1, intro) {
    const rows = {
      ko: [["필수 저장소", "서비스 동작과 사용성 유지를 위해 브라우저 로컬 저장소에 언어 선택 같은 설정이 저장될 수 있습니다."], ["광고 쿠키", "Google을 포함한 제3자 광고 사업자는 사용자의 이전 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용할 수 있습니다."], ["개인 맞춤 광고", "사용자는 Google 광고 설정에서 개인 맞춤 광고를 선택 해제할 수 있습니다."], ["동의와 관리", "브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있으며, 일부 설정은 사이트 사용 경험에 영향을 줄 수 있습니다."], ["AdSense 적용 전 안내", "광고 코드를 추가하기 전에는 작업 화면과 광고 영역을 명확히 분리하고, 광고 클릭을 유도하는 문구나 그래픽을 사용하지 않는 방향으로 운영합니다."]],
      en: [["Essential storage", "Language and preference settings may be stored in local storage to keep the site usable."], ["Advertising cookies", "Third-party advertising vendors, including Google, may use cookies to serve ads based on prior visits."], ["Personalized ads", "Users can opt out of personalized advertising through Google Ads Settings."], ["Consent and control", "You can block or delete cookies in your browser settings, although some settings may affect the site experience."], ["Before AdSense is added", "Before adding ad code, we keep the editing workspace clearly separated from advertising areas and avoid language or graphics that encourage ad clicks."]],
      ja: [["必須の保存領域", "サイトの使いやすさを保つため、言語などの設定がローカルストレージに保存される場合があります。"], ["広告 Cookie", "Google を含む第三者広告事業者は、過去の訪問履歴に基づき広告を表示するため Cookie を使用する場合があります。"], ["パーソナライズ広告", "ユーザーは Google 広告設定でパーソナライズ広告を無効にできます。"], ["同意と管理", "ブラウザー設定で Cookie をブロックまたは削除できますが、一部の設定は利用体験に影響する場合があります。"], ["AdSense 導入前の方針", "広告コードを追加する前に、編集画面と広告領域を明確に分け、広告クリックを誘導する文言や画像を使わない方針で運用します。"]],
      zh: [["必要存储", "为保持网站易用性，语言等设置可能会保存在本地存储中。"], ["广告 Cookie", "包括 Google 在内的第三方广告服务商可能使用 Cookie，根据以往访问记录展示广告。"], ["个性化广告", "用户可以通过 Google 广告设置选择退出个性化广告。"], ["同意与管理", "你可以在浏览器设置中阻止或删除 Cookie，但部分设置可能影响网站体验。"], ["接入 AdSense 前的说明", "添加广告代码前，我们会明确区分编辑工作区和广告区域，并避免使用诱导广告点击的文字或图形。"]],
      "zh-TW": [["必要儲存空間", "為維持網站易用性，語言等設定可能會儲存在本機儲存空間。"], ["廣告 Cookie", "包含 Google 在內的第三方廣告服務商可能使用 Cookie，根據過往造訪紀錄顯示廣告。"], ["個人化廣告", "使用者可以透過 Google 廣告設定選擇退出個人化廣告。"], ["同意與管理", "你可以在瀏覽器設定中封鎖或刪除 Cookie，但部分設定可能影響網站體驗。"], ["導入 AdSense 前的說明", "加入廣告程式碼前，我們會明確區分編輯工作區與廣告區域，並避免使用誘導廣告點擊的文字或圖形。"]]
    }[lang];
    return `<section class="info-hero compact"><p class="info-kicker">Cookie Policy</p><h1>${h1}</h1><p>${intro}</p></section><section class="info-grid">${rows.slice(0, 4).map((row) => `<article class="info-panel"><h2>${row[0]}</h2><p>${row[1]}</p></article>`).join("")}</section><section class="info-section"><h2>${rows[4][0]}</h2><p>${rows[4][1]}</p></section>`;
  }

  function termsPage(lang, h1, intro) {
    const rows = {
      ko: [["사용자 콘텐츠", "사용자가 만든 그림, 불러온 이미지, 저장한 파일의 권리와 책임은 사용자에게 있습니다. 타인의 저작권, 상표권, 초상권을 침해하는 콘텐츠를 만들거나 배포하지 않도록 주의해야 합니다."], ["서비스 제공과 변경", "웹 그림판은 정적 웹앱 형태로 제공되며, 브라우저와 기기 환경에 따라 일부 기능의 동작이 달라질 수 있습니다."], ["광고와 운영", "향후 서비스 운영을 위해 광고가 표시될 수 있습니다. 광고는 사용자의 편집 작업을 방해하지 않도록 배치하며, 광고 클릭을 인위적으로 유도하지 않습니다."]],
      en: [["User content", "You are responsible for the drawings, imported images, and saved files you create or use. Do not create or distribute content that infringes copyrights, trademarks, publicity rights, or other rights."], ["Service changes", "Web Paint is provided as a static web app. Some behavior may vary depending on your browser and device environment."], ["Ads and operation", "Ads may be displayed in the future to support service operation. Ads will be placed separately from the editing workflow, and we do not encourage artificial ad clicks."]],
      ja: [["ユーザーコンテンツ", "作成した画像、読み込んだ画像、保存したファイルの権利と責任はユーザーにあります。著作権、商標権、肖像権などを侵害しないよう注意してください。"], ["サービス提供と変更", "Web ペイントは静的 Web アプリとして提供され、ブラウザーや端末環境により一部機能の動作が異なる場合があります。"], ["広告と運営", "将来的にサービス運営のため広告を表示する場合があります。広告は編集作業を妨げないよう配置し、広告クリックを不自然に誘導しません。"]],
      zh: [["用户内容", "用户对自己创建、导入和保存的图片或文件负责。请勿制作或分发侵犯版权、商标权、肖像权等权利的内容。"], ["服务提供与变更", "网页画图以静态 Web 应用形式提供，部分功能可能因浏览器和设备环境而有所不同。"], ["广告与运营", "未来可能展示广告以支持服务运营。广告会尽量与编辑流程分离，并且不会诱导人为点击广告。"]],
      "zh-TW": [["使用者內容", "使用者對自己建立、匯入與儲存的圖片或檔案負責。請勿製作或散布侵害著作權、商標權、肖像權等權利的內容。"], ["服務提供與變更", "網頁小畫家以靜態 Web 應用程式形式提供，部分功能可能因瀏覽器與裝置環境而有所不同。"], ["廣告與營運", "未來可能顯示廣告以支持服務營運。廣告會盡量與編輯流程分離，並且不會誘導人為點擊廣告。"]]
    }[lang];
    return `<section class="info-hero compact"><p class="info-kicker">Terms of Use</p><h1>${h1}</h1><p>${intro}</p></section>${rows.map((row) => `<section class="info-section"><h2>${row[0]}</h2><p>${row[1]}</p></section>`).join("")}`;
  }

  function normalizeLanguage(value) {
    const lower = String(value || "").toLowerCase();
    if (lower === "zh-tw" || lower === "zh-hant" || lower === "zh-hk" || lower === "zh-mo") return "zh-TW";
    const base = lower.split("-")[0];
    return supported.includes(base) ? base : "en";
  }

  function currentLanguage() {
    const saved = localStorage.getItem("webPaintLanguage");
    if (!saved) return "en";
    if (saved !== "auto") return normalizeLanguage(saved);
    const languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "ko"];
    return normalizeLanguage(languages.find((item) => labels[normalizeLanguage(item)]) || "en");
  }

  function ensureLanguageSelect(lang) {
    const nav = document.querySelector(".info-nav");
    if (!nav || document.getElementById("infoLanguageSelect")) return;
    const select = document.createElement("select");
    select.id = "infoLanguageSelect";
    select.className = "info-lang-select";
    select.innerHTML = `
      <option value="auto">${labels[lang].auto}</option>
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="zh">简体中文</option>
      <option value="zh-TW">繁體中文</option>`;
    select.value = localStorage.getItem("webPaintLanguage") || "en";
    select.addEventListener("change", () => {
      localStorage.setItem("webPaintLanguage", select.value);
      render();
    });
    nav.appendChild(select);
  }

  function render() {
    const lang = currentLanguage();
    const label = labels[lang] || labels.en;
    const page = document.body.dataset.page;
    const pageContent = pages[page] && (pages[page][lang] || pages[page].en);
    document.documentElement.lang = lang;
    document.querySelector(".info-brand strong").textContent = label.brand;
    document.querySelectorAll(".info-links a").forEach((link, index) => {
      if (label.nav[index]) link.textContent = label.nav[index];
    });
    ensureLanguageSelect(lang);
    if (pageContent) {
      document.title = pageContent.title;
      document.querySelector(".info-shell").innerHTML = `${pageContent.html}<footer class="info-disclaimer">Web Paint is an independent project and is not affiliated with Microsoft.</footer>`;
    }
  }

  render();
})();
