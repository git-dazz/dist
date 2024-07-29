import { rt } from "./fs.ts"
import { toml } from "./ecd.ts"

export async function rcfg(name = "cfg.toml", type = "toml") {
    let txt = await rt(name);
    return toml.parse(txt);
}
