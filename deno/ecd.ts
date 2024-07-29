// sha 256 start
import { encodeHex } from "jsr:@std/encoding/hex";
export async function sha256(message) {
    const messageBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
    const hash = encodeHex(hashBuffer);
    return hash;
}
// sha 256 end


// yml start
import { parse as parseYml, stringify as stringifyYml } from "jsr:@std/yaml";
export const yml = {
    parse(str) {
        return parseYml(str);
    },
    stringify(obj) {
        return stringifyYml(obj);
    }
}
// yml end

// toml start
import { parse as parseToml, stringify as stringifyToml } from "jsr:@std/toml";
export const toml = {
    parse(str) {
        return parseToml(str);
    },
    stringify(obj) {
        return stringifyToml(obj);
    }
}
// toml end

// json5 start
import npmJson5 from "npm:json5";
export const json5 = npmJson5;
export const json = npmJson5;
// json5 end
