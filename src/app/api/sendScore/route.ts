import { sql } from "@vercel/postgres";

export async function GET() {
  const { rows } = await sql`select * from color;`;
  return Response.json({ data: rows });
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res =
      await sql`INSERT INTO score (ur_name, score) VALUES (${data.urName}, ${data.score}) returning id;`;

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
