/**
 * 산리오 프렌즈 MBTI 성격 테스트 애플리케이션 로직
 */

document.addEventListener("DOMContentLoaded", () => {
  // 상태 변수
  let currentQuestionIndex = 0;
  let userAnswers = []; // 각 질문의 선택된 type ("E", "I", "S", "N", "T", "F", "J", "P")
  let isSoundEnabled = true;

  // DOM 요소 캐싱
  const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    loading: document.getElementById("screen-loading"),
    result: document.getElementById("screen-result")
  };

  const btnStart = document.getElementById("btn-start");
  const btnQuizBack = document.getElementById("btn-quiz-back");
  const btnRestart = document.getElementById("btn-restart");
  const btnShareLink = document.getElementById("btn-share-link");
  const btnSoundToggle = document.getElementById("sound-toggle-btn");

  const quizCounter = document.getElementById("quiz-counter");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.getElementById("quiz-progress-bar");
  const questionDimensionTag = document.getElementById("question-dimension-tag");
  const questionText = document.getElementById("question-text");
  const questionSubtext = document.getElementById("question-subtext");
  const optionsContainer = document.getElementById("options-container");

  const toastMsg = document.getElementById("toast-msg");

  // Web Audio API 효과음 생성기 (외부 음원 의존 없음)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // 뽀용/통통 튀는 효과음
  function playBoingSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      const now = audioCtx.currentTime;

      // 주파수 변조 (귀여운 통통 튀는 톤)
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 팡파레/축하 멜로디 (결과 화면용)
  function playSuccessJingle() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "triangle";
        const startTime = now + idx * 0.11;
        const duration = 0.22;

        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 사운드 토글
  btnSoundToggle.addEventListener("click", () => {
    isSoundEnabled = !isSoundEnabled;
    btnSoundToggle.textContent = isSoundEnabled ? "🔔" : "🔕";
    showToast(isSoundEnabled ? "효과음이 켜졌어요! 🔔" : "효과음이 꺼졌어요! 🔕");
    if (isSoundEnabled) playBoingSound();
  });

  // 배경 부유 파티클 초기화
  function initFloatingParticles() {
    const container = document.getElementById("bg-particles");
    if (!container) return;
    const icons = ["🎀", "💖", "🍓", "🌸", "✨", "🐰", "☁️", "🧁", "⭐"];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.textContent = icons[Math.floor(Math.random() * icons.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 12}s`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.fontSize = `${1.1 + Math.random() * 1.1}rem`;
      container.appendChild(particle);
    }
  }

  // 화면 전환 헬퍼
  function switchScreen(targetScreenName) {
    Object.values(screens).forEach(screen => {
      screen.classList.remove("active");
    });
    if (screens[targetScreenName]) {
      screens[targetScreenName].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // 토스트 메시지 표시
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toastMsg.classList.add("show");
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 2400);
  }

  // 질문 렌더링
  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    // 카운터 및 프로그레스 바 업데이트
    const stepNum = index + 1;
    const formattedNum = stepNum < 10 ? `0${stepNum}` : stepNum;
    quizCounter.innerHTML = `Q.${formattedNum} <span>/ ${questions.length}</span>`;

    const percent = ((stepNum) / questions.length) * 100;
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", stepNum);

    // 이전 버튼 가시성
    btnQuizBack.style.visibility = index > 0 ? "visible" : "hidden";

    // 질문 내용 텍스트 세팅
    questionDimensionTag.textContent = q.category;
    questionText.textContent = q.question;
    questionSubtext.textContent = q.description;

    // 선택지 리스트 비우고 새로 생성
    optionsContainer.innerHTML = "";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";

      // 이전에 선택했던 답변이 있다면 하이라이트 표시
      if (userAnswers[index] === opt.type) {
        btn.classList.add("selected");
      }

      btn.innerHTML = `
        <span class="option-emoji">${opt.emoji}</span>
        <span class="option-text">${opt.text}</span>
      `;

      btn.addEventListener("click", () => {
        handleOptionSelect(index, opt.type, btn);
      });

      optionsContainer.appendChild(btn);
    });
  }

  // 선택지 선택 핸들러
  function handleOptionSelect(index, selectedType, buttonElement) {
    playBoingSound();

    // 선택 효과
    const allOptions = optionsContainer.querySelectorAll(".option-btn");
    allOptions.forEach(b => b.classList.remove("selected"));
    buttonElement.classList.add("selected");

    userAnswers[index] = selectedType;

    // 부드러운 지연 후 다음으로 이동
    setTimeout(() => {
      if (index + 1 < questions.length) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
      } else {
        // 모든 질문 답변 완료 -> 로딩 후 결과 화면 표시
        showLoadingAndResult();
      }
    }, 280);
  }

  // 로딩 화면 후 결과 화면으로 전환
  function showLoadingAndResult() {
    switchScreen("loading");

    // 1.4초 후 결과 계산 및 화면 전환
    setTimeout(() => {
      const finalMBTI = calculateMBTI();
      renderResult(finalMBTI);
      switchScreen("result");
      playSuccessJingle();
    }, 1400);
  }

  // MBTI 계산 알고리즘
  function calculateMBTI() {
    const counts = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    userAnswers.forEach(type => {
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });

    const mbti = [
      counts.E >= counts.I ? "E" : "I",
      counts.S >= counts.N ? "S" : "N",
      counts.T >= counts.F ? "T" : "F",
      counts.J >= counts.P ? "J" : "P"
    ].join("");

    return {
      type: mbti,
      counts: counts
    };
  }

  // 결과 화면 렌더링
  function renderResult(calcResult) {
    const type = calcResult.type;
    const counts = calcResult.counts;
    const data = mbtiResults[type] || mbtiResults["ESFJ"];

    // 1. 헤더 & 아바타 & 닉네임
    document.getElementById("res-mbti").textContent = data.mbti;
    document.getElementById("res-char-name").textContent = data.character;
    document.getElementById("res-char-nickname").textContent = data.nickname;
    document.getElementById("res-avatar-img").src = data.avatar;
    document.getElementById("res-quote").textContent = data.quote;

    // 2. 태그 목록
    const tagsContainer = document.getElementById("res-tags");
    tagsContainer.innerHTML = "";
    data.tags.forEach(tag => {
      const tagSpan = document.createElement("span");
      tagSpan.className = "tag-item";
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });

    // 3. 성격 특징 리스트
    const traitsList = document.getElementById("res-traits");
    traitsList.innerHTML = "";
    data.traits.forEach(trait => {
      const li = document.createElement("li");
      li.textContent = trait;
      traitsList.appendChild(li);
    });

    // 4. 차원별 퍼센트 계산 & 그래프 업데이트
    if (counts) {
      const totalPerDim = 3; // 각 차원 3문항
      const ePct = Math.round((counts.E / totalPerDim) * 100);
      const iPct = 100 - ePct;
      const sPct = Math.round((counts.S / totalPerDim) * 100);
      const nPct = 100 - sPct;
      const tPct = Math.round((counts.T / totalPerDim) * 100);
      const fPct = 100 - tPct;
      const jPct = Math.round((counts.J / totalPerDim) * 100);
      const pPct = 100 - jPct;

      const labelE = document.getElementById("label-e");
      const labelI = document.getElementById("label-i");
      labelE.textContent = `외향(E) ${ePct}%`;
      labelI.textContent = `내향(I) ${iPct}%`;
      labelE.className = ePct >= 50 ? "active-dim" : "";
      labelI.className = iPct > 50 ? "active-dim" : "";
      document.getElementById("bar-ei").style.width = `${ePct}%`;

      const labelS = document.getElementById("label-s");
      const labelN = document.getElementById("label-n");
      labelS.textContent = `감각(S) ${sPct}%`;
      labelN.textContent = `직관(N) ${nPct}%`;
      labelS.className = sPct >= 50 ? "active-dim" : "";
      labelN.className = nPct > 50 ? "active-dim" : "";
      document.getElementById("bar-sn").style.width = `${sPct}%`;

      const labelT = document.getElementById("label-t");
      const labelF = document.getElementById("label-f");
      labelT.textContent = `사고(T) ${tPct}%`;
      labelF.textContent = `감정(F) ${fPct}%`;
      labelT.className = tPct >= 50 ? "active-dim" : "";
      labelF.className = fPct > 50 ? "active-dim" : "";
      document.getElementById("bar-tf").style.width = `${tPct}%`;

      const labelJ = document.getElementById("label-j");
      const labelP = document.getElementById("label-p");
      labelJ.textContent = `판단(J) ${jPct}%`;
      labelP.textContent = `인식(P) ${pPct}%`;
      labelJ.className = jPct >= 50 ? "active-dim" : "";
      labelP.className = pPct > 50 ? "active-dim" : "";
      document.getElementById("bar-jp").style.width = `${jPct}%`;
    }

    // 5. 궁합 정보
    document.getElementById("res-best-char").textContent = data.bestMatch.character;
    document.getElementById("res-best-mbti").textContent = data.bestMatch.mbti;
    document.getElementById("res-best-desc").textContent = data.bestMatch.reason;

    document.getElementById("res-worst-char").textContent = data.worstMatch.character;
    document.getElementById("res-worst-mbti").textContent = data.worstMatch.mbti;
    document.getElementById("res-worst-desc").textContent = data.worstMatch.reason;

    // 6. 나와 잘 맞는 찰떡 성격 상세 설명 렌더링
    if (data.compatiblePersonality) {
      document.getElementById("compat-title").textContent = data.compatiblePersonality.title;
      document.getElementById("compat-summary").textContent = data.compatiblePersonality.summary;

      const compatList = document.getElementById("compat-traits-list");
      compatList.innerHTML = "";
      data.compatiblePersonality.traits.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        compatList.appendChild(li);
      });

      document.getElementById("compat-synergy-text").textContent = data.compatiblePersonality.chemistryTip;
    }
  }

  // 이벤트 바인딩

  // 1. 시작하기 버튼
  btnStart.addEventListener("click", () => {
    initAudio();
    playBoingSound();
    currentQuestionIndex = 0;
    userAnswers = [];
    renderQuestion(currentQuestionIndex);
    switchScreen("quiz");
  });

  // 2. 질문 뒤로가기 버튼
  btnQuizBack.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      playBoingSound();
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
    }
  });

  // 3. 다시 테스트하기 버튼
  btnRestart.addEventListener("click", () => {
    playBoingSound();
    currentQuestionIndex = 0;
    userAnswers = [];
    switchScreen("start");
  });

  // 4. 결과 링크 복사
  btnShareLink.addEventListener("click", () => {
    playBoingSound();
    const currentMbti = document.getElementById("res-mbti").textContent;
    const shareUrl = `${window.location.origin}${window.location.pathname}?mbti=${currentMbti}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("결과 링크가 복사되었어요! 🎀 친구들에게 자랑해보세요!");
      }).catch(() => {
        fallbackCopy(shareUrl);
      });
    } else {
      fallbackCopy(shareUrl);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand("copy");
      showToast("결과 링크가 복사되었어요! 🎀");
    } catch (err) {
      showToast("주소창의 링크를 복사해주세요! 🎀");
    }
    document.body.removeChild(tempInput);
  }

  // URL 파라미터로 특정 MBTI 바로 확인 지원 (?mbti=ISFP)
  const urlParams = new URLSearchParams(window.location.search);
  const paramMbti = urlParams.get("mbti");
  if (paramMbti && mbtiResults[paramMbti.toUpperCase()]) {
    const targetType = paramMbti.toUpperCase();
    renderResult({
      type: targetType,
      counts: {
        E: targetType.includes("E") ? 3 : 0,
        I: targetType.includes("I") ? 3 : 0,
        S: targetType.includes("S") ? 3 : 0,
        N: targetType.includes("N") ? 3 : 0,
        T: targetType.includes("T") ? 3 : 0,
        F: targetType.includes("F") ? 3 : 0,
        J: targetType.includes("J") ? 3 : 0,
        P: targetType.includes("P") ? 3 : 0
      }
    });
    switchScreen("result");
  }

  // 배경 부유 파티클 시작
  initFloatingParticles();
});
