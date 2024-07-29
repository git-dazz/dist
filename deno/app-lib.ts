import { rt } from "./fs.ts"
import { toml } from "./ecd.ts"

export async function rcfg(name = "cfg.toml", type = "toml") {
    let txt = await rt(name);
    return toml.parse(txt);
}

export async function getOnlineConfig(url, config) {
  let replace = config?.replace;
  delete config.replace
  const textResponse = await fetch(url, config || {});
  let textData = await textResponse.text();
  if (replace) {
    textData = replace(textData);
  }
  return textData;
}


function bufferToString(buffer) {
  return new TextDecoder().decode(buffer);
}

export async function runCmd(exe, args) {
  const command = new Deno.Command(exe, {
    args: args,
    cwd: Deno.cwd(),
    stdin: "null",
  });
  let result = {};
  try {
    let { code, stdout, stderr } = await command.output();
    result = {
      code,
      stdout: bufferToString(stdout),
      stderr: { message: bufferToString(stderr) }
    }

  } catch (err) {
    result = {
      code: 1,
      stdout: "",
      stderr: {
        name: err.name,
        code: err.code,
        message: err.message,
        stack: err.stack,
      },
    };
  }

  return {
    sh: exe + " " + (args || []).join(" "),
    ...result,
  };
}
