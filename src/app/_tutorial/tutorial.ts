import { ParamsModel } from "../_params/params"
import { createBall } from "../_states/balls"
import { GameState, PlayingState } from "../_states/state"
import { enhanceProb } from "../_states/virus";

export type Spotlight = {
    position: Position;
    size: Position;
}

export type TutorialEvent = {
    condition: boolean;
    messages?: string[],
    func?: (params: ParamsModel) => any,
    messageposition?: Position
    done?: boolean,
    spotlightElement?: string;
    spotlight?: Spotlight;
}
export const tutorialEventsData = (gameState: GameState, tutorialTurns: number): TutorialEvent[] => [
    {
        condition: gameState.sceneState.turns >= 0, messages: ["Simufectionの世界へようこそ。", "あなたはこのエリアを治める政治家です。"], func: (_) => {
            return { playingState: PlayingState.tutorial }
        }
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.playing, tutorialMessage: "" }
        }
    },
    { condition: gameState.sceneState.turns >= 150, messages: ["このように動いているマップ内のボールは人を表します。", "青い人は健康な人です。"], func: (_) => { return { playingState: PlayingState.tutorial } } },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.playing, tutorialMessage: "" }
        }
    },
    {
        condition: gameState.sceneState.turns >= 200, messages: ["最初の感染者が出現しました。", "赤い色は感染者を表します。感染者は接触すると確率で他の人にも感染させます。"], func: (params) => {
            const { balls, map, sceneState } = { ...gameState }
            balls.push(createBall(false, params, map.map, undefined, { x: 105, y: 255 }, true))
            sceneState.turns = 0;
            return { balls: balls, sceneState: sceneState, playingState: PlayingState.tutorial }
        },
        spotlight: { position: { x: 90, y: 230 }, size: { x: 20, y: 20 } }
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.playing, tutorialMessage: "" }
        }
    },
    {
        condition: (gameState.sceneState.infectedCount >= 10), messages: ["感染者が10人になりました。政策を使ってみましょう。", "ドラッグ&ドロップで政策を実行することができます。ドラッグしたまま止めることで影響範囲をプレビューすることもできます。", "特別に政策ポイントを4差し上げます。試しに一番左の「ワクチン接種」の政策を使ってみましょう！「ワクチン接種」はエリア全域での感染確率を0.7倍に下げます。"], func: (_) => {
            const { player } = { ...gameState }
            player.points = 4;
            return { playingState: PlayingState.tutorial, player: player }
        },
        spotlightElement: "v"
    },
    {
        condition: gameState.tutorialMessage == "dropped", messages: ["このように政策を実行するとタイムラインに記録されます。", "政策に必要なポイントは感染者数の割合に応じて増加します。"], func: (_) => {
            const { player } = { ...gameState }
            player.zero = false;
            return { player: player, tutorialMessage: "" }
        }
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            const { virus } = { ...gameState };
            virus.healProb = 0.1;
            virus.deadProb = 0.02;
            return { playingState: PlayingState.playing, tutorialMessage: "", virus: virus }
        }
    },
    {
        condition: gameState.sceneState.healedCount > 0 || gameState.sceneState.deadCount > 0, messages: [`一人の感染者が${gameState.sceneState.healedCount > 0 ? "回復" : "死亡"}しました。${gameState.sceneState.healedCount > 0 ? "回復" : "死亡"}した人は${gameState.sceneState.healedCount > 0 ? "緑" : "灰"}色で表示されます。`, `感染後一定ターンが経過すると確率で回復・あるいは死亡します。${gameState.sceneState.healedCount > 0 ? "死亡" : "回復"}した人は${gameState.sceneState.healedCount > 0 ? "灰" : "緑"}色で表示されます。`], func: (_) => {
            return { playingState: PlayingState.tutorial }
        },
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["他の政策を実行するとどうなるでしょうか。"], func: (_) => {
            return { tutorialMessage: "" }
        }
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["「治療薬」の政策は感染後、回復するかどうかの抽選に必要なターン数を減らします。"], func: (_) => {
            return { tutorialMessage: "" }
        },
        spotlightElement: "e"
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["「使い捨てマスク」の政策は最大20人の感染者に対して、一定の間の感染させないようにします。"], func: (_) => {
            return { tutorialMessage: "" }
        },
        spotlightElement: "d"
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["「ロックダウン」の政策は感染者の増えたエリアに適用すると、一定以下の感染者数に抑えられるまでエリアを超えた移動を不可能にします。", "感染者数が一定未満のエリアに対しては適用することができません。"], func: (_) => {
            return { tutorialMessage: "" }
        },
        spotlightElement: "l"
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["「PCR検査」の政策は全体の半分を対象として検査が行われ、陽性となった人は自宅謹慎（感染させない）状態になります。", "偽陽性（感染していないのに陽性となる）や偽陰性（感染しているのに陰性と出る）人もいるので注意しましょう。"], func: (_) => {
            return { tutorialMessage: "" }
        },
        spotlightElement: "p"
    },
    {
        condition: gameState.tutorialMessage == "clicked", messages: ["各政策にはクールタイムが設定されており、連続で使用することができないものもあります。", "それでは、これらの政策を駆使してウイルスの根絶を目指しましょう！"], func: (_) => {
            return { tutorialMessage: "" }
        },
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.playing, tutorialMessage: "" }
        }
    },
    {
        condition: gameState.sceneState.healedCount >= 50, messages: ["定期的にウイルスは変異を起こし、その強さに影響があります。", "こちらもその効果がタイムラインに記録されます。", "都度政策を用いて対応し、感染者数を抑えましょう。"], func: (params) => {
            const { virus, sceneState, events } = { ...gameState };
            const { newVirus, event } = enhanceProb(virus, params, sceneState.turns);
            events.push(event as [number, string, any]);

            return { virus: newVirus, event: events, playingState: PlayingState.tutorial }
        },
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.playing, tutorialMessage: "" }
        }
    },
    {
        condition: gameState.sceneState.infectedCount == 0, messages: ["感染者数が0になりましたね！これでゲームクリアです！", "クリアまでの累計感染者数や死者数が高得点の鍵となりますので覚えておいてください！"], func: (_) => {
            return { playingState: PlayingState.tutorial }
        }
    },
    {
        condition: gameState.tutorialMessage == "clicked", func: (_) => {
            return { playingState: PlayingState.finishing, tutorialMessage: "" }
        }
    },
]
