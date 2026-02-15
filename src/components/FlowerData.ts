export interface FlowerInfo {
  id: number;
  loveLanguage: string;
  title: string;
  description: string;
  color: string;
  petalColor: string;
  centerColor: string;
  leafColor: string;
  emoji: string;
}

export const FLOWERS: FlowerInfo[] = [
  {
    id: 0,
    loveLanguage: "Words of Affirmation",
    title: "Words of Affirmation",
    description:
      "You always say thank you which shows you are grateful.",
    color: "#FF6B8A",
    petalColor: "#FF6B8A",
    centerColor: "#FFD700",
    leafColor: "#4a7c59",
    emoji: "💬",
  },
  {
    id: 1,
    loveLanguage: "Acts of Service",
    title: "Acts of Service",
    description:
      "You care for me and my well being. I love your cooking and massage sessions. I like how you always tell me what you want for gifts, which removes the guessing game. You wear what I like...",
    color: "#FF8C42",
    petalColor: "#FF8C42",
    centerColor: "#FFF176",
    leafColor: "#4a7c59",
    emoji: "🤲",
  },
  {
    id: 2,
    loveLanguage: "Receiving Gifts",
    title: "Receiving Gifts",
    description:
      "You are very thoughtful with your gifts. You put in effort in trying to see what I would like as a gift.",
    color: "#AB47BC",
    petalColor: "#AB47BC",
    centerColor: "#FFE082",
    leafColor: "#4a7c59",
    emoji: "🎁",
  },
  {
    id: 3,
    loveLanguage: "Quality Time",
    title: "Quality Time",
    description:
      "Spending time with you is very fun and enjoyable. You find shows for us to watch and suggest things to do.",
    color: "#42A5F5",
    petalColor: "#42A5F5",
    centerColor: "#FFF9C4",
    leafColor: "#4a7c59",
    emoji: "⏰",
  },
  {
    id: 4,
    loveLanguage: "Physical Touch",
    title: "Physical Touch",
    description:
      "We are very touchy which I like. I appreciate you for always making me feel good. I promise I will be giving back that feeling.",
    color: "#EF5350",
    petalColor: "#EF5350",
    centerColor: "#FFCC80",
    leafColor: "#4a7c59",
    emoji: "🫂",
  },
];

export const WATER_CLICKS_TO_GROW = 1;
export const GROW_STAGES = ["seed", "blooming"] as const;
export type GrowStage = (typeof GROW_STAGES)[number];
