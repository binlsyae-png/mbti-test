// MBTI 12문항 데이터 (E/I, S/N, T/F, J/P 각 3문항)
const questions = [
  // E vs I (1~3)
  {
    id: 1,
    dimension: "EI",
    category: "외향 vs 내향",
    question: "주말에 약속이 갑자기 취소되었을 때, 나의 솔직한 심정은?",
    description: "약속 취소 톡을 확인한 순간!",
    options: [
      {
        text: "앗싸 자유다! 침대에서 하루종일 뒹굴뒹굴 힐링해야지 🛌✨",
        type: "I",
        emoji: "🧸"
      },
      {
        text: "헐 심심해졌어! 다른 친구한테 바로 번개 모임 연락해볼까? 📱🥳",
        type: "E",
        emoji: "🎈"
      }
    ]
  },
  {
    id: 2,
    dimension: "EI",
    category: "외향 vs 내향",
    question: "처음 보는 친구들이 가득한 파티에 초대받았을 때 나는?",
    description: "새로운 사람들과의 만남의 자리!",
    options: [
      {
        text: "어떤 재미있는 친구들을 만날지 벌써부터 기대되고 설레! 🎀💖",
        type: "E",
        emoji: "🎉"
      },
      {
        text: "어색하고 기 빨릴 것 같아서... 살짝 가기 망설여져 🥺🫧",
        type: "I",
        emoji: "☕"
      }
    ]
  },
  {
    id: 3,
    dimension: "EI",
    category: "외향 vs 내향",
    question: "친구들과 하루 종일 신나게 놀고 집에 돌아왔을 때 나는?",
    description: "집 문을 열고 들어왔을 때 나의 상태는?",
    options: [
      {
        text: "재미있었지만 배터리 1%... 혼자만의 방에서 충전이 시급해 🔋🌙",
        type: "I",
        emoji: "💤"
      },
      {
        text: "아직 흥이 덜 가라앉았어! 단톡방에 오늘 찍은 사진 올리며 수다 떨기 📸💬",
        type: "E",
        emoji: "⚡"
      }
    ]
  },

  // S vs N (4~6)
  {
    id: 4,
    dimension: "SN",
    category: "감각 vs 직관",
    question: "하늘에 몽실몽실 떠 있는 구름을 볼 때 드는 생각은?",
    description: "푸른 하늘을 올려다보았을 때!",
    options: [
      {
        text: "구름 모양이 솜사탕 같네! 오늘 비 안 오고 맑아서 다행이다 ☀️☁️",
        type: "S",
        emoji: "🌤️"
      },
      {
        text: "저 구름 위로 퐁당 다이빙하면 무슨 느낌일까? 천사들의 베개일지도? 🦄✨",
        type: "N",
        emoji: "🧚‍♀️"
      }
    ]
  },
  {
    id: 5,
    dimension: "SN",
    category: "감각 vs 직관",
    question: "친구가 여행 갈 때 무엇을 챙겨야 할지 물어본다면?",
    description: "짐 싸는 팁을 알려줄 때!",
    options: [
      {
        text: "보조배터리, 상비약, 세면도구 등 필수템 체크리스트를 착착 정리해준다 📋🎒",
        type: "S",
        emoji: "🧳"
      },
      {
        text: "그곳에 가면 느낄 수 있는 감성, 꼭 가봐야 할 낭만적인 포토존을 추천한다 🌸🔮",
        type: "N",
        emoji: "📸"
      }
    ]
  },
  {
    id: 6,
    dimension: "SN",
    category: "감각 vs 직관",
    question: "대화할 때 내가 더 흥미롭게 빠져드는 주제는?",
    description: "친구와의 즐거운 티타임 수다 주제!",
    options: [
      {
        text: "오늘 점심에 먹은 맛집, 어제 쇼핑한 옷 등 일상의 생생한 이야기 🍰🛍️",
        type: "S",
        emoji: "🍓"
      },
      {
        text: "‘만약 외계인이 나에게 말을 건다면?’, ‘우주의 끝은 어디일까?’ 같은 상상 이야기 🚀🌌",
        type: "N",
        emoji: "🪐"
      }
    ]
  },

  // T vs F (7~9)
  {
    id: 7,
    dimension: "TF",
    category: "사고 vs 감정",
    question: "친구가 \"나 오늘 너무 우울해서 딸기 조각 케이크 샀어...\"라고 했을 때 나의 첫마디는?",
    description: "우울한 친구의 카톡 알림!",
    options: [
      {
        text: "헐... 무슨 일 있었어? 케이크 먹고 기분은 좀 괜찮아졌어? 🥺🍰💖",
        type: "F",
        emoji: "💌"
      },
      {
        text: "딸기 케이크 어느 가게에서 샀어? 근데 왜 우울한데? 무슨 일이야? 🧐❓",
        type: "T",
        emoji: "💡"
      }
    ]
  },
  {
    id: 8,
    dimension: "TF",
    category: "사고 vs 감정",
    question: "친구와 사소한 의견 차이로 대화를 나눌 때 더 중요하게 생각하는 것은?",
    description: "서로 다른 생각을 맞출 때!",
    options: [
      {
        text: "대화하다가 친구의 기분이 상하거나 서운하지 않게 다독이는 배려 🌷🤝",
        type: "F",
        emoji: "🌸"
      },
      {
        text: "누구 말이 더 논리적이고 앞뒤가 맞는지 팩트를 명확히 하는 것 ⚖️🔍",
        type: "T",
        emoji: "📑"
      }
    ]
  },
  {
    id: 9,
    dimension: "TF",
    category: "사고 vs 감정",
    question: "고민을 털어놓으며 눈물 흘리는 친구에게 내가 해주고 싶은 것은?",
    description: "힘들어하는 친구 곁에서!",
    options: [
      {
        text: "말없이 꼭 안아주며 \"네 맘 다 알아, 무조건 네 편이야\"라고 공감해주기 🫂💗",
        type: "F",
        emoji: "🎀"
      },
      {
        text: "문제를 근본적으로 깔끔하게 해결할 수 있는 똑 부러진 해결책 찾아주기 🧭🛠️",
        type: "T",
        emoji: "📝"
      }
    ]
  },

  // J vs P (10~12)
  {
    id: 10,
    dimension: "JP",
    category: "판단 vs 인식",
    question: "친구들과 봄소풍 피크닉을 가기로 했을 때 나의 스타일은?",
    description: "두근두근 소풍 준비!",
    options: [
      {
        text: "12시 집결, 1시 도시락, 3시 자전거 코스까지 알차게 타임라인 계획 짜기 ⏰🗺️",
        type: "J",
        emoji: "📅"
      },
      {
        text: "일단 돗자리 들고 모여서 기분 내키는 대로, 날씨 좋은 곳으로 자유롭게 가기 🧺🎈",
        type: "P",
        emoji: "🍃"
      }
    ]
  },
  {
    id: 11,
    dimension: "JP",
    category: "판단 vs 인식",
    question: "방 청소나 중요한 과제를 할 때 나의 평소 모습은?",
    description: "해야 할 일이 눈앞에 있을 때!",
    options: [
      {
        text: "미리미리 계획해서 시작하고 차근차근 끝내야 마음이 편안해 🧹✅",
        type: "J",
        emoji: "🎀"
      },
      {
        text: "마감 직전 데드라인이 눈앞에 닥쳐야 놀라운 초집중 파워가 발휘돼! ⏳⚡",
        type: "P",
        emoji: "🏃‍♀️"
      }
    ]
  },
  {
    id: 12,
    dimension: "JP",
    category: "판단 vs 인식",
    question: "내일 아침 일찍 중요한 외출이 있을 때 전날 밤 나는?",
    description: "잠들기 전 준비 시간!",
    options: [
      {
        text: "입을 옷, 가방 속 소지품까지 침대 옆에 완벽히 세팅해두고 잠들기 👗👜",
        type: "J",
        emoji: "🌙"
      },
      {
        text: "내일 아침 날씨와 기분에 맞춰서 쏙쏙 챙기면 되지~ 바로 꿀잠 자기 😴🛌",
        type: "P",
        emoji: "⭐"
      }
    ]
  }
];
