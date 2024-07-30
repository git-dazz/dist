
function queue(init = null) {
    let arr = [];
    let p = Promise.resolve(init);
    let fire = () => {
        arr.forEach(fun => {
            p = p.then(fun);
        })
    };
    let tick = 0;
    let handle = {
        task(fun) {
            clearTimeout(tick);
            p = p.then(fun);
            tick = setTimeout(() => { fire() }, 1);
            return handle;
        },
        last(fun) {
            arr.push(fun);
            return handle;
        }
    }
    return handle;
}


import Fastify from "npm:fastify@4.26.1";

// export default fast;
export function fast({ logger = true, host = "0.0.0.0", port = 3000 }) {

    // let fapp = null;
    return queue().task(() => {
        return Fastify({ logger: logger });
    }).task(app => {
        app.addContentTypeParser('application/json', { parseAs: 'string' }, function (request, body, done) {
            console.log(request.raw.toString());
            try {
                let data = JSON.parse(body);
                request.rawBody = body;
                done(null, data);
            } catch (error) {
                console.log("json err")
                done(error, undefined);
            }

        });
        return app;
    }).last(app => {
        let opt = { port: port || 3000, host: host || "0.0.0.0" };
        console.log("listen", opt, "\n");
        app.listen(opt, (err, address) => {
            if (err) {
                console.log("error", opt);
                throw err;
            }
        });
        return app;
    })

}

/*
fast({ host: "127.0.0.12", port: 12345 })
    .task(app => {
        app.get("/", (req, reply) => { reply.send({ hello: "world" }); });
    });

*/ 
