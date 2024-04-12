import politicianImage1 from "@/assets/img/pol_1.png";
import politicianImage2 from "@/assets/img/pol_2.png";
import politicianImage3 from "@/assets/img/pol_3.png";
import politicianImage4 from "@/assets/img/pol_4.png";
import politicianImage5 from "@/assets/img/pol_5.png";
import politicianImage6 from "@/assets/img/pol_6.png";
import { StaticImageData } from "next/image";

interface Rank {
  index: number;
  name: string;
  border: number;
  image: StaticImageData;
}

export const rank: Rank[] = [
  { index: 0, name: "一流政治家", border: 90000, image: politicianImage1 },
  { index: 1, name: "二流政治家", border: 80000, image: politicianImage2 },
  { index: 2, name: "三流政治家", border: 70000, image: politicianImage3 },
  { index: 3, name: "出来ない政治家", border: 60000, image: politicianImage4 },
  { index: 4, name: "ひどい政治家", border: 50000, image: politicianImage5 },
  { index: 5, name: "最悪な政治家", border: 0, image: politicianImage6 },
];

export const scoreToRank = (score: number): Rank => {
  return rank.find((r) => r.border < score) ?? rank[rank.length - 1];
};
