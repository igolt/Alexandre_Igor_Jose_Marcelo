import { GameWorld } from "./GameWorld";
import { Engine } from "./Engine";
import { Display } from "./Display";
import { Controller } from "./Controller";
import { requestZoneFromJSON } from "./GameZone";
import { Door } from "./Door";
import { AssetsManager } from "./AssetsManager";

window.addEventListener("load", async () => {
  "use strict";

  //// CONSTANTS ////

  const INITIAL_ZONE_ID = "00";

  ///////////////////
  //// FUNCTIONS ////
  ///////////////////

  const startGame = () => {
    gameStarted = true;
    requestZoneFromJSON(assetsManager, INITIAL_ZONE_ID).then(async zone => {
      gameWorld.setup(zone);
      gameWorld.addDoorCollisionEventListener(doorCollisionEventListener);
      gameWorld.addCollectibleEventListener(coffeeCollisionListener);
      gameWorld.addEnemyCollisionEventListener(enemyCollisionEventListener);

      gameWorld.loadSprites().then(() => {
        document.body.appendChild(pStats);
        resize();
        engine.start();
      });
    });
  };

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
      gameWorld.tileSetImage(),
      gameWorld.tileSetColumns(),
      // gameWorld.tileSetRows(),
      gameWorld.graphicalMap(),
      gameWorld.columns(),
      // gameWorld.rows(),
      gameWorld.tileSize()
    );

    for (let index = gameWorld.collectibles().length - 1; index > -1; --index) {
      const coffee = gameWorld.collectibles()[index];
      const frame = coffee.frame();

      display.drawObject(
        coffee.spriteSheet(),
        frame.x,
        frame.y,
        coffee.getX() +
          Math.floor(coffee.width() * 0.5 - frame.width * 0.5) +
          frame.offsetX,
        coffee.getY() + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    const frame = gameWorld.player().frame();

    display.drawObject(
      gameWorld.player().spriteSheet(),
      frame.x,
      frame.y,
      gameWorld.player().getX() +
        Math.floor(gameWorld.player().width() * 0.5 - frame.width * 0.5) +
        frame.offsetX,
      gameWorld.player().getY() + frame.offsetY,
      frame.width,
      frame.height
    );

    for (let index = gameWorld.enemies().length - 1; index > -1; --index) {
      const enemy = gameWorld.enemies()[index];
      const frame = enemy.frame();

      display.drawObject(
        enemy.spriteSheet(),
        frame.x,
        frame.y,
        enemy.getX() +
          Math.floor(enemy.width() * 0.5 - frame.width * 0.5) +
          frame.offsetX,
        enemy.getY() + frame.offsetY,
        frame.width,
        frame.height
      );
    }

    for (let index = gameWorld.grass().length - 1; index > -1; --index) {
      const grass = gameWorld.grass()[index];
      const frame = grass.frame();

      display.drawObject(
        grass.spriteSheet(),
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

  const coffeeCollisionListener = () =>
    (pStats.innerHTML = "Points: " + gameWorld.collectibleCount());

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
    gameWorld.update();
    playerController();
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

  const endGame = () => {
    engine.stop();
    const endSound = assetsManager.loadAudio(
      "end-game-sound",
      "/audio/end-game.mp3"
    );
    endSound.onended = () => location.reload();
    endSound.volume = 0.3;
    endSound.load();
    endSound.play();
  };

  const enemyCollisionEventListener = () => {
    gameWorld.player().dealDamage(1);

    if (gameWorld.player().lifePoints() == 0) {
      endGame();
    }
  };

  const doorCollisionEventListener = (door: Door) => {
    if (door.destinationZone == gameWorld.zoneId()) {
      movePlayerToDoorDestination(door);
    } else {
      engine.stop();

      requestZoneFromJSON(assetsManager, door.destinationZone).then(zone => {
        gameWorld.setup(zone);

        gameWorld.loadSprites().then(() => {
          movePlayerToDoorDestination(door);

          engine.start();
        });
      });
    }
  };

  /////////////////
  //// OBJECTS ////
  /////////////////

  const controller = new Controller();
  const display = new Display();
  const assetsManager = new AssetsManager();
  const gameWorld = new GameWorld(assetsManager);
  const engine = new Engine(1000 / 30, render, update);
  const startScreen = assetsManager.getOrLoadImage(
    "game-menu",
    "sprite_sheets/menu.png"
  );

  const pStats = document.createElement("pStats");
  pStats.setAttribute("style", "color:#ffffff; font-size: 2em; position:fixed");
  pStats.innerHTML = "Points: 0";

  let gameStarted = false;

  ////////////////////
  //// INITIALIZE ////
  ////////////////////

  display.setBufferCanvasHeight(gameWorld.height());
  display.setBufferCanvasWidth(gameWorld.width());
  display.disableImageSmoothing();

  window.addEventListener("resize", resize);

  display.drawImage(await startScreen);
  resize();

  window.addEventListener("keypress", e => {
    if (gameStarted) {
      if (e.key == "p") {
        if (engine.isRunning()) {
          engine.stop();
        } else {
          engine.start();
        }
      }
    } else {
      if (e.key == " ") {
        startGame();
      }
    }
  });
});
