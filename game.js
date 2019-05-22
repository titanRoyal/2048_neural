class Game {
  constructor(x) {
    this.brain = new neural_net(Math.pow(caro, 2) + 8, [10], 4)
    if (x) {
      this.brain.weight = x;
      this.brain.mutate(mutate);
    }
    this.grid = []
    this.score = 0;
    this.fitness = 0;
    this.gameOver = false;
    for (var i = 0; i < caro; i++) {
      this.grid[i] = []
      for (var j = 0; j < caro; j++) {
        this.grid[i][j] = new cell(i * real + real / 2, j * real + real / 2, scalar - spacing)
        
      }
    }
    this.addtile()
  }
  calcFitness() {
    let tab = this.grid.flat(Infinity);
    let fitn = 0
    tab.sort((a, b) => {
      return b.num - a.num
    })
    fitn = map(tab[0].num, 2, 2048, 0, 0.4)
    if (tab[0].num != null) {
      if (tab[1].num != null) {
        fitn += map(Game.distence(tab[0], tab[1]), 1, (2 * caro - 1) * 2, 0.1, 0)
      }
      if (tab[2].num != null) {
        fitn += map(Game.distence(tab[0], tab[2]), 1, (2 * caro - 1) * 2, 0.1, 0)
      }
    }
    if (tab[1].num != null && tab[2].num != null) {
      fitn += map(Game.distence(tab[2], tab[1]), 1, (2 * caro - 1) * 2, 0.1, 0)
    }
    this.fitness = fitn;
  }
  static distence(a, b) {
    return (Math.abs((a.x - b.x) / 75) + Math.abs((a.y - b.y) / 75))
  }
  addtile(x = "y") {
    let tab = []
    for (var i = 0; i < this.grid.length; i++) {
      for (let gg of this.grid[i]) {
        if (gg.num == null) {
          tab.push(gg);
        }
      }
    }
    if (tab.length == 0) {
      return "sorry ther are no more room to fill";
    } else {
      if (x == "y") {
        let r = random(tab);
        if (random(1) > 0.8) {
          r.num = 4;
        } else {
          r.num = 2;
        }
        r.neww = true;
        return true;
      } else {
        return "yes there are moves"
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  shiffting(x, yy = "y") {
    let hh = false;
    let tt = 0;
    switch (x) {
      case "up":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = this.grid[i].length - 1; j > 0; j--) {
            if (this.grid[i][j].num != null && this.grid[i][j - 1].num == null) {
              if (yy == "y") {
                this.grid[i][j - 1].num = this.grid[i][j].num
                this.grid[i][j].num = null;
              }
              tt++;
              hh = true;
            }
          }
        }
        return [hh, tt];
        break;
      case "down":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.grid[i].length - 1; j++) {
            if (this.grid[i][j].num != null && this.grid[i][j + 1].num == null) {
              if (yy == "y") {
                this.grid[i][j + 1].num = this.grid[i][j].num
                this.grid[i][j].num = null;
              }
              tt++;
              hh = true;
            }
          }
        }
        return [hh, tt];
        break;
      case "right":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.grid[i].length - 1; j++) {
            if (this.grid[j][i].num != null && this.grid[j + 1][i].num == null) {
              if (yy == "y") {
                this.grid[j + 1][i].num = this.grid[j][i].num
                this.grid[j][i].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;
      case "left":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = this.grid[i].length - 1; j > 0; j--) {
            if (this.grid[j][i].num != null && this.grid[j - 1][i].num == null) {
              if (yy == "y") {
                this.grid[j - 1][i].num = this.grid[j][i].num
                this.grid[j][i].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;

    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  combination(x, yy = "y") {
    let hh = false;
    let tt = 0;
    switch (x) {
      case "up":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = this.grid[i].length - 1; j > 0; j--) {
            if (this.grid[i][j - 1].num != null && this.grid[i][j].num != null && this.grid[i][j - 1].num == this.grid[i][j].num) {
              if (yy == "y") {
                this.grid[i][j - 1].num *= 2;
                this.grid[i][j].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;
      case "down":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.grid[i].length - 1; j++) {
            if (this.grid[i][j + 1].num != null && this.grid[i][j].num != null && this.grid[i][j + 1].num == this.grid[i][j].num) {
              if (yy == "y") {
                this.grid[i][j + 1].num *= 2;
                this.grid[i][j].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;
      case "right":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.grid[i].length - 1; j++) {
            if (this.grid[j][i].num != null && this.grid[j + 1][i].num != null && this.grid[j + 1][i].num == this.grid[j][i].num) {
              if (yy == "y") {
                this.grid[j + 1][i].num *= 2;
                this.grid[j][i].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;
      case "left":
        for (var i = this.grid.length - 1; i >= 0; i--) {
          for (var j = this.grid[i].length - 1; j > 0; j--) {
            if (this.grid[j][i].num != null && this.grid[j - 1][i].num != null && this.grid[j - 1][i].num == this.grid[j][i].num) {
              if (yy == "y") {
                this.grid[j - 1][i].num *= 2
                this.grid[j][i].num = null;
              }
              hh = true;
              tt++;
            }
          }
        }
        return [hh, tt];
        break;

    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  gameover() {
    if (this.combination("up", "n")[1] == 0 && this.shiffting("up", "n")[1] == 0 && this.combination("down", "n")[1] == 0 && this.shiffting("down", "n")[1] == 0 && this.combination("left", "n")[1] == 0 && this.shiffting("left", "n")[1] == 0 && this.combination("right", "n")[1] == 0 && this.shiffting("right", "n")[1] == 0) {
      return true;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  show() {
    this.grid.forEach((data) => {
      data.forEach((data1) => {
        data1.show()

      })

    })
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  find2048() {
    let data = this.grid.flat()
    for (var i of data) {
      if (i.num == 2048) {
        console.log("find it");
      }
    }

  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  get_grid() {
    let r = []
    let tab = this.grid.flat()
    for (var i = 0; i < tab.length; i++) {
      r.push(tab[i].num / 2048);
    }
    return r;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  gess() {
    let gh = this.brain.feedforward(this.get_grid().concat(this.get_scr()));
    let hg = max(gh);
    switch (gh.indexOf(hg)) {
      case 0:
        if (this.combination("up", "n")[0] || this.shiffting("up", "n")[0]) {
          this.score++;
          for (var i = 0; i < 4; i++) {
            this.combination("up")
            this.shiffting("up")
          }
          //removeneww();
          this.addtile()
        } else {
          this.gameOver = true;
        }

        break;
      case 1:
        if (this.combination("down", "n")[0] || this.shiffting("down", "n")[0]) {
          this.score++;
          for (var i = 0; i < 4; i++) {
            this.combination("down")
            this.shiffting("down")
          }
          //removeneww();
          this.addtile()
        } else {
          this.gameOver = true;
        }
        break;
      case 2:
        if (this.combination("left", "n")[0] || this.shiffting("left", "n")[0]) {
          this.score++;
          for (var i = 0; i < 4; i++) {
            this.combination("left")
            this.shiffting("left")
          }
          //removeneww();
          this.addtile()
        } else {
          this.gameOver = true;
        }
        break;
      case 3:
        if (this.combination("right", "n")[0] || this.shiffting("right", "n")[0]) {
          this.score++;
          for (var i = 0; i < 4; i++) {
            this.combination("right")
            this.shiffting("right")
          }
          //  removeneww();
          this.addtile()
        } else {
          this.gameOver = true;
        }
        break;

    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  get_scr() {
    let g = []
    g = [this.combination("up", "n")[1], this.shiffting("up", "n")[1], this.combination("down", "n")[1], this.shiffting("down", "n")[1], this.combination("left", "n")[1], this.shiffting("left", "n")[1], this.combination("right", "n")[1], this.shiffting("right", "n")[1]]
    return g;
  }
}
