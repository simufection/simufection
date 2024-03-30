"use server";

import { SendScoreData } from "@/app/game/_functions/_game/score";
import { IncomingWebhook } from "@slack/webhook";

export const sendSlackMessage = async (data: SendScoreData) => {
  const date = new Date();
  const time = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const url = process.env.SLACK_WEBHOOK_URL as string;
  const webhook = new IncomingWebhook(url);
  const { urName, score, map, feedback, turns } = data;
  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "フィードバック",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*ユーザー名:* ${urName}`,
          },
          {
            type: "mrkdwn",
            text: `*スコア:* ${score}`,
          },
          {
            type: "mrkdwn",
            text: `*マップ:* ${map}`,
          },
          {
            type: "mrkdwn",
            text: `*ターン数:* ${turns}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*感想*\n${feedback}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: time,
          },
        ],
      },
      {
        type: "divider",
      },
    ],
  };
  await webhook.send(payload);
};
