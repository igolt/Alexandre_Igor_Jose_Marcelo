import { GameWorld } from "./GameWorld";
import { Engine } from "./Engine";
import { Display } from "./Display";
import { Controller } from "./Controller";
import { requestImage } from "./assets-utils";
import { requestZoneFromJSON } from "./GameZone";
import { Door } from "./Door";

window.addEventListener("load", () => {
  "use strict";

  //// CONSTANTS ////

  const ZONE_PREFIX = "../zones/zone";
  const ZONE_SUFFIX = ".json";
  const INITIAL_ZONE_ID = "00";

  ///////////////////
  //// FUNCTIONS ////
  ///////////////////

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
      gameWorld.height() / gameWorld.width()
    );
    display.render();

    const rectangle = display.getBoundingClientRect();

    pStats.style.left = rectangle.left + "px";
    pStats.style.top = rectangle.top + "px";
    pStats.style.fontSize =
      (gameWorld.tileSize() * rectangle.height) / gameWorld.height() + "px";
  };

  const render = () => {
    display.drawMap(
      tileSetImage,
      gameWorld.tileSetColumns(),
      gameWorld.tileSetRows(),
      gameWorld.graphicalMap(),
      gameWorld.columns(),
      gameWorld.rows(),
      gameWorld.tileSize()
    );

    for (let index = gameWorld.carrots().length - 1; index > -1; --index) {
      const carrot = gameWorld.carrots()[index];
      const frame = gameWorld.getFrame(carrot.frameValue());

      display.drawObject(
        tileSetImage,
        frame.x,
        frame.y,
        carrot.getX() +
          Math.floor(carrot.width() * 0.5 - frame.width * 0.5) +
          frame.offsetX,
        carrot.getY() + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    const frame = gameWorld.getFrame(gameWorld.player().frameValue());

    display.drawObject(
      tileSetImage,
      frame.x,
      frame.y,
      gameWorld.player().getX() +
        Math.floor(gameWorld.player().width() * 0.5 - frame.width * 0.5) +
        frame.offsetX,
      gameWorld.player().getY() + frame.offsetY,
      frame.width,
      frame.height
    );

    for (let index = gameWorld.grass().length - 1; index > -1; --index) {
      const grass = gameWorld.grass()[index];
      const frame = gameWorld.getFrame(grass.frameValue());

      display.drawObject(
        tileSetImage,
        frame.x,
        frame.y,
        grass.x + frame.offsetX,
        grass.y + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    display.render();
  };

  const carrotCollisionListener = () =>
    (pStats.innerHTML = "Apples: " + gameWorld.carrotsCount());

  const playerController = () => {
    if (controller.left.isDown()) {
      gameWorld.player().moveLeft();
    }
    if (controller.right.isDown()) {
      gameWorld.player().moveRight();
    }
    if (controller.up.isActive()) {
      gameWorld.player().jump();
      controller.up.deactivate();
    }
  };

  const update = () => {
    playerController();
    gameWorld.update();
  };

  const movePlayerToDoorDestination = (door: Door) => {
    if (door.destinationX != -1) {
      gameWorld.player().setCenterX(door.destinationX);
      gameWorld.player().setOldCenterX(door.destinationX); // It's important to reset the old position as well.
    }

    if (door.destinationY != -1) {
      gameWorld.player().setCenterY(door.destinationY);
      gameWorld.player().setOldCenterY(door.destinationY);
    }
  };

  const doorCollisionEventListener = (door: Door) => {
    if (door.destinationZone == gameWorld.zoneId()) {
      movePlayerToDoorDestination(door);
    } else {
      engine.stop();

      requestZoneFromJSON(
        ZONE_PREFIX + door.destinationZone + ZONE_SUFFIX,
        (zone) => {
          gameWorld.setup(zone);

          movePlayerToDoorDestination(door);

          engine.start();
        }
      );
    }
  };

  /////////////////
  //// OBJECTS ////
  /////////////////

  const controller = new Controller();
  const display = new Display();
  const gameWorld = new GameWorld();
  const engine = new Engine(1000 / 30, render, update);

  let tileSetImage: HTMLImageElement;

  const pStats = document.createElement("pStats");
  pStats.setAttribute("style", "color:#f00e0e; font-size:2.0em; position:fixed");
  pStats.innerHTML = "Apples: 0";
  document.body.appendChild(pStats);

  ////////////////////
  //// INITIALIZE ////
  ////////////////////

  display.setBufferCanvasHeight(gameWorld.height());
  display.setBufferCanvasWidth(gameWorld.width());
  display.disableImageSmoothing();

  requestZoneFromJSON(ZONE_PREFIX + INITIAL_ZONE_ID + ZONE_SUFFIX, (zone) => {
    gameWorld.setup(zone);
    gameWorld.addDoorCollisionEventListener(doorCollisionEventListener);
    gameWorld.addCarrotCollisionEventListener(carrotCollisionListener);

    requestImage("sprite_sheets/rabbit-trap3.png", (image) => {
      tileSetImage = image;

      resize();
      engine.start();
    });
  });
});
