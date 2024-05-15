import { GameState } from "@/app/_states/state";
type EventMessage = {
  [name: string]: string;
};

export const eventMessage = (turns: number, data: any): EventMessage => {
  return {
    game_start: `${Math.floor(turns / 5)}日目: 最初の感染者が出現しました！`,
    policy_v: `${Math.floor(turns / 5)}日目: ワクチン接種を実施！ウイルスの感染力が${data.prob}になりました！`,
    policy_e: `${Math.floor(turns / 5)}日目: 治療薬の普及！回復確率が${data.healProb}になりました！`,
    policy_m: `${Math.floor(turns / 5)}日目: マスク配布！感染者${data.all}人のうち${data.num}人がマスクをつけ、他人に感染させなくなりました！`,
    policy_d: `${Math.floor(turns / 5)}日目: 使い捨てマスク配布！${data.num}人が使い捨てマスクをつけ、一時的に感染させなくなりました！`,
    policy_l: `${Math.floor(turns / 5)}日目: ロックダウン！${data.name}がロックダウンされ、県境が封鎖されました！`,
    policy_p: `${Math.floor(turns / 5)}日目: PCR検査を実施！${data.all}人が検査され、${data.positive}人が陽性となり自宅謹慎することになりました。`,
    lockdown_failure: `${Math.floor(turns / 5)}日目: 住民の強い反対により、${data.name}のロックダウンに失敗しました。`,
    lockdown_end: `${Math.floor(turns / 5)}日目: ロックダウン解除！${data.name}に自由に出入りできるようになりました`,
    virus_e: `${Math.floor(turns / 5)}日目: ウイルスが強化！感染力が${data.prob}になりました。`,
    virus_c: `${Math.floor(turns / 5)}日目: ウイルスが強化！回復までの最短ターン数が${data.turnsRequiredForHeal}になりました。`,
    virus_d: `${Math.floor(turns / 5)}日目: ウイルスが強化！ウイルスによる死亡率が${data.prob}になりました。`,
  };
};
