import React, { useEffect } from "react";

import Matter, {
    Body,
    Common,
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Events,
  } from "matter-js";

function BoxMap() {
    var engine = Engine.create();

    var h = window.innerHeight;
    var w = window.innerWidth*0.75;

    var render = Render.create({
        element: document.body,
        engine: engine,

        options: {
        // get window width and height
        width: w,
        height: h,
        wireframes: false,
        },
    });

    var runner = Runner.create();
    Runner.run(runner, engine);

    var ground = Bodies.rectangle(w/2, h-5, w, 10, { isStatic: true });
    var celling = Bodies.rectangle(w/2, 5, w, 10, { isStatic: true });
    var leftWall = Bodies.rectangle(5, h/2, 10, h, { isStatic: true });
    var rightWall = Bodies.rectangle(w-5, h/2, 10, h, { isStatic: true });

    var stack = Composite.create();
    for (var i = 0; i < 10; i++) {
        var box = Bodies.rectangle(400, 50 * i, 80, 80);
        Composite.add(stack, box);
    }

    Composite.add(engine.world, [ground, celling, leftWall, rightWall, stack]);

    var paused = false;
    Events.on(engine, "beforeUpdate", function (event) {

        if (paused) {
            return;
            }

        var engine = event.source;

        // apply random forces every 5 secs
        if (event.timestamp % 5000 < 50) {
        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
                if (!bodies[i].isStatic) {
                var forceMagnitude = 0.01 * bodies[i].mass;
                Body.applyForce(bodies[i], bodies[i].position, {
                    x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                    y: -forceMagnitude + Common.random() * -forceMagnitude,
                    });
                }
            }
        }
    });

    Render.run(render);
}

export default BoxMap;