import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const data = await req.json();

  const currentTime = new Date();
  const oneMinutesAgo = new Date(currentTime.getTime() - 60 * 1000);

  try {
    const res1 = await sql`SELECT id FROM access_counter where ur_id = ${data.id} AND time >= ${oneMinutesAgo.toISOString()} AND action = ${data.action};`;

    if (res1.rows.length > 0) return new Response(
      JSON.stringify({ success: false, error: "データが重複している可能性があります" })
    );

    const res2 =
      await sql`INSERT INTO access_counter(action, ur_id) VALUES(${data.action}, ${data.id}) returning id; `;

    if (res2) {
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
