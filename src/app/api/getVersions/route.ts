import { exec } from "child_process";

const execPromise = (
  cmd: string
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

export async function POST(req: Request): Promise<Response> {
  const command = "git log -p -- package.json | grep -E '^\\+.*\"version\":'";

  try {
    const { stdout } = await execPromise(command);

    const versions = stdout
      .split("\n")
      .filter((line) => line.startsWith("+"))
      .map((line) => line.match(/"version": "(.*?)(\.\d+)?"/)?.[1])
      .filter((version): version is string => version !== undefined)
      .filter((value, index, self) => self.indexOf(value) === index);

    return new Response(JSON.stringify({ success: true, versions }));
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `exec error: ${(error as Error).message}`,
      })
    );
  }
}
