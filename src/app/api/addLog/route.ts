import { appVersion } from "@/consts/appVersion";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res =
      await sql`INSERT INTO access_counter (action) VALUES (${data.action}) returning id;`;

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
