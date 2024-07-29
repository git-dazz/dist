// read text
export async function rt(file, opt = {}) {
    let text = null;
    try {
        text = await Deno.readTextFile(file);
    } catch (err) {
        if (opt?.throw) {
            throw new Error(file, err);
        }
        if (opt.err) {
            console.error(`read [${file}] error;`, err);
        }
    }
    finally {
        return text;
    }

}

// write text
export async function wt(file, data, opt) {
    try {
        await Deno.writeTextFile(file, data, { append: !!opt?.append });
    } catch (error) {
        if (opt?.throw) {
            throw new Error(file, err);
        }
        if (opt.err) {
            console.error(`write [${file}] error;`, err);
        }
    }
    finally {

    }

}
