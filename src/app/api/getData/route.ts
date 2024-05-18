import { convertToCamelCase } from "@/services/convert";
import { getRandomString } from "@/services/randomString";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const res = await sql`SELECT ur_id, to_char(time, 'yyyy/mm/dd'), action FROM access_counter;`;
    const res2 = await sql`SELECT id, ur_name, score, to_char(date, 'yyyy/mm/dd'), is_received FROM score where score >= 90000;`;
    if (res && res2) {
      return new Response(JSON.stringify(convertToCamelCase({ success: true, data: res.rows, data2: res2.rows })));
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
