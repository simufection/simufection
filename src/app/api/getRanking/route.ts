import { appVersion } from "@/consts/appVersion";
import { convertToCamelCase } from "@/services/convert";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const today = new Date();
    const [year, month, date] = [
      today.getFullYear().toString().padStart(4, "0"),
      (today.getMonth() + 1).toString().padStart(2, "0"),
      today.getDate().toString().padStart(2, "0"),
    ];
    const today_str = `${year}/${month}/${date}`;
    const version = appVersion;
    const nowVer = `${version.split(".")[0]}.${version.split(".")[1]}`;
    const ver = data.version ?? nowVer;
    const res_all =
      await sql`SELECT ur_name, score FROM score where version = ${ver} ORDER BY score DESC limit 10;`;
    const res_today = data.version
      ? { rows: [] }
      : await sql`SELECT ur_name, score FROM score WHERE to_char(date, 'yyyy/mm/dd') = ${today_str} and version = ${ver} ORDER BY score DESC limit 10;`;

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
