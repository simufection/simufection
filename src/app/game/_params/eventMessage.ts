import { GameState } from "../_states/state";
type EventMessage = {
  [name: string]: string;
};

export const eventMessage = (turns: number, data: any): EventMessage => {
  return {
    game_start: `${turns}: ゲーム開始！`,
    policy_v: `${turns}: ワクチン接種を実施！ウイルスの感染力が${data.prob}になりました！`,
    policy_e: `${turns}: 抗菌薬の普及！回復確率が${data.healProb}になりました！`,
    policy_m: `${turns}: マスク配布！感染者${data.all}人のうち${data.num}人がマスクをつけ、他人に感染させなくなりました！`,
    policy_l: `${turns}: ロックダウン！${
      data.name
    }がロックダウンされ、移動できる確率が${(1 - data.compliance).toFixed(
      2
    )}になりました！`,
    policy_p: `${turns}: PCR検査を実施！${data.all}人が検査され、${data.positive}人が陽性となり自宅謹慎することになりました。`,
    lockdown_end: `${turns}: ロックダウン解除！${data.name}に自由に出入りできるようになりました`,
    virus_e: `${turns}: ウイルスが強化！感染力が${data.prob}になりました。`,
    virus_c: `${turns}: ウイルスが強化！回復までの最短ターン数が${data.turnsRequiredForHeal}になりました。`,
  };
};
