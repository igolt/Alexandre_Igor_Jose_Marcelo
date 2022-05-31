export class GameMap {
  constructor(modelo) {
    let exemplo = {
      cells: [],
      LINES: 32,
      COLUMNS: 32,
      SIZE: 32,
      mapindice: [],
      mapAssets: null,
    };
    Object.assign(this, exemplo, modelo);
    for (var c = 0; c < this.COLUMNS; c++) {
      this.cells[c] = [];
      for (var l = 0; l < this.LINES; l++) {
        exemplo.cells[c][l] = { tipo: 0 };
      }
    }
    if (modelo.m) {
      for (var c = 0; c < this.COLUMNS; c++) {
        for (var l = 0; l < this.LINES; l++) {
          this.cells[c][l] = { tipo: modelo.m[l][c] };
        }
      }
    }
  }

  drawBackground(ctx){
    ctx.drawImage(
      this.mapAssets.image("background"),
      0,
      0,
      this.mapAssets.image("background").naturalWidth,
      this.mapAssets.image("background").naturalHeight,
      0,
      0,
      this.SIZE * this.COLUMNS,
      this.SIZE * this.LINES
    );
  }

  draw(ctx) {
    for (var c = 0; c < this.COLUMNS; c++) {
      for (var l = 0; l < this.LINES; l++) {
        switch (this.cells[c][l].tipo) {
          //andavel
          case 0:
            break;
          //solido
          case 1:
            ctx.drawImage(
              this.mapAssets.image("tile"),
              0,
              0,
              16,
              16,
              c * this.SIZE,
              l * this.SIZE,
              this.SIZE,
              this.SIZE
            );
            break;
          //teleporte
          case 2:
            ctx.fillRect(
              c * this.SIZE,
              l * this.SIZE,
              this.SIZE,
              this.SIZE
            );
        }
      }
    }
  }
}
