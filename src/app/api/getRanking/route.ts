import { convertToCamelCase } from "@/services/convert";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const today = new Date();
    const [year, month, date] = [
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    ];
    const today_str = `${year}/${month}/${date}`;
    const res_all =
      await sql`SELECT ur_name, score FROM score ORDER BY score DESC limit 10;`;
    const res_today =
      await sql`SELECT ur_name, score FROM score WHERE to_char(date, 'yyyy/mm/dd') = ${today_str} ORDER BY score DESC limit 10;`;

    return new Response(
      JSON.stringify({
        success: true,
        all: convertToCamelCase(res_all.rows),
        today: convertToCamelCase(res_today.rows),
      })
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ success: false, error: "失敗しました" })
    );
  }
}
