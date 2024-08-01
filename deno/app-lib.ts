import { rt } from "./fs.ts"
import { toml } from "./ecd.ts"

import { Edge } from 'npm:edge.js'

export function random(len, chars) {
    let str = '';
    for (let i = 0; i < len; i++) {
        let x = Math.floor(Math.random() * chars.length)
        str += chars.charAt(x);
    }
    return str;
};

export function randomNum(len = 10) {
    return random(len, "0123456789");
}
export function randomString(len = 10) {
    return random(len, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
}

export async function render(template, data) {
    const edge = Edge.create()
    edge.global('rdN', randomNum);
    edge.global('rdS', randomString);
    const txt = await edge.renderRaw(template, data);
    return txt
}


export async function rcfg(name = "cfg.toml", type = "toml") {
    let txt = await rt(name) || "";
    const env = Deno.env.toObject();
    let txt2 = await render(txt, { env, evn: env, username: 'virk' })
    if (!txt2) return {};
    return toml.parse(txt2);
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
