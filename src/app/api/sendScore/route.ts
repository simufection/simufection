import { appVersion } from "@/consts/appVersion";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const version = appVersion;
    const res =
      await sql`INSERT INTO score (ur_name, score, map, turns, feedback, version) VALUES (${data.urName}, ${data.score}, ${data.map}, ${data.turns}, ${data.feedback}, ${version}) returning id;`;

    if (res) {
      return new Response(JSON.stringify({ success: true }));
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "登録できませんでした" })
      );
    }
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ success: false, error: "失敗しました" })
    );
  }
}
