import { appVersion } from "@/consts/appVersion";
import { convertToCamelCase } from "@/services/convert";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const { realName, score, name } = data
    const res =
      await sql`SELECT id, is_received from score where ur_name = ${name} and score = ${score}`;

    if (!res || res.rows.length == 0) {
      return new Response(
        JSON.stringify({ success: false, error: "該当データが見つかりませんでした" })
      );
    }

    // const res2 =
    //   await sql`SELECT id, ur_name from score where real_name=${realName} and is_received = true`;

    // if (res2 && res2.rows.length > 0) {
    //   return new Response(
    //     JSON.stringify({ success: false, error: "すでに受取済みの可能性があります" })
    //   );
    // }

    const resData = convertToCamelCase(res.rows)
    if (resData[0].isReceived) {
      return new Response(
        JSON.stringify({ success: false, error: "すでに受取済みです" })
      );
    }

    const res3 = await sql`UPDATE score set (is_received, real_name) = (true, ${realName}) where id = ${resData[0].id}`;

    if (res3) {
      return new Response(
        JSON.stringify({ success: true })
      );
    }

  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ success: false, error: "失敗しました" })
    );
  }
}
