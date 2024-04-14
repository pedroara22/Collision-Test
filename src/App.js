import "./App.css";
import Matter, {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Events,
} from "matter-js";

function App() {
  //* Creating a canvas that is 80% of the screen width and height and add it to the body
  let screenwidth = window.innerWidth * 0.8;
  let screenheight = window.innerHeight * 0.8;
  var engine = Engine.create({});
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: screenwidth,
      height: screenheight,
    },
  });
  var rect = [];
  //* Creating a mouse object and a mouse constraint object to allow the user to draw rectangles
  let mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        render: { visible: false },
      },
    });
  //* Creating a ground object to prevent the rectangles from falling
  var ground = Bodies.rectangle(
    screenwidth / 2,
    screenheight + 48,
    screenwidth,
    100,
    { isStatic: true }
  );
  //* Creating two walls to prevent the rectangles from going out of the screen
  var leftWall = Bodies.rectangle(-48, screenheight / 2, 100, screenheight, {
    isStatic: true,
  });
  var rightWall = Bodies.rectangle(
    screenwidth + 48,
    screenheight / 2,
    100,
    screenheight,
    { isStatic: true }
  );
  //* Adding the ground and walls to the world
  Composite.add(engine.world, [ground, leftWall, rightWall]);
  Render.run(render);
  var runner = Runner.create();
  //* Running the engine
  Runner.run(runner, engine);
  //* Variables to store the initial position of the mouse when the user starts drawing a rectangle
  let inicialPos = 0;
  //* Function to create a rectangle
  function createRect(position) {
    //* If the user is drawing a rectangle, remove the previous rectangle
    if (rect.length !== 0 && inicialPos !== 0) {
      Composite.remove(engine.world, rect);
      rect.pop();
    }
    //* Create a rectangle with the initial position of the mouse and the current position of the mouse
    let { x, y } = position;
    if (inicialPos === 0) {
      inicialPos = { x, y };
      rect.push(Bodies.rectangle(x, y, 1, 1, { isStatic: true }));
    } else {
      rect.push(
        Bodies.rectangle(
          inicialPos.x + (x - inicialPos.x) / 2,
          inicialPos.y + (y - inicialPos.y) / 2,
          x - inicialPos.x,
          y - inicialPos.y
        )
      );
    }
    Composite.add(engine.world, rect);
  }
  //* Event listener to create a rectangle when the user is drawing
  Events.on(engine, "afterUpdate", function (event) {
    if (mouseConstraint.mouse.button !== -1) {
      let mousePosition = mouse.position;
      createRect(mousePosition);
    }
    if (mouseConstraint.mouse.button === -1 && inicialPos !== 0) {
      var backup = rect;
      rect = [];
      inicialPos = 0;
      Composite.add(engine.world, backup);
    }
  });
  var paused = false;
  return (
    <div className="App">
      {/* Button to stop the engine */}
      <button
        onClick={() => {
          if (paused === false) {
            Runner.stop(runner);
            paused = true;
          } else {
            Runner.start(runner, engine);
            paused = false;
          }
        }}
      >
        Stop
      </button>
    </div>
  );
}

export default App;
