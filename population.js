class population {
  constructor(x = 10) {
    this.size = x;
    this.neural = [];
    this.save_neural = []
    this.gameOver = false;
    for (var i = 0; i < this.size; i++) {
      this.neural.push(new Game())
    }
  }
  update() {
    for (var i = 0; i < this.neural.length; i++) {
      this.neural[i].find2048();
      if (this.neural[i].gameOver || this.neural[i].gameover()) {
        this.save_neural.push(this.neural.splice(i, 1)[0])
      } else {
        this.neural[i].gess();
      }
    }
    if (this.neural.length == 0) {
      this.new_gen();
    }
  }
  show() {
    if (this.neural.length > 0) {
      this.neural[0].show();
    }
  }
  evaluat(x) {
    x.forEach((data) => {
      data.calcFitness()

    })
    let hh = x[0].score;
    for (var i = 1; i < x.length; i++) {
      if (hh < x[i].score) {
        hh = x[i].score;

      }
    }
    for (var i = 0; i < x.length; i++) {
      x[i].fitness += map(x[i].score, 0, hh, 0, 0.3);
    }
    this.matingpool = [];
    for (var i = 0; i < x.length; i++) {
      if (x[i].fitness > 0.4) {
        for (var j = 0; j < x[i].fitness * 100; j++) {
          this.matingpool.push(x[i]);
        }
      }
    }

  }
  selection(x) {
    this.neural[0] = x[x.length - 1];
    for (var i = 1; i < x.length; i++) {
      let g = [];
      let partA = random(this.matingpool).brain.weight;
      let partB = random(this.matingpool).brain.weight;
      for (var j = 0; j < partA.length; j++) {
        g[j] = matrix.crossover(partA[j], partB[j]);
      }
      // TODO:overcharge the neural constructor with the weight argument only
      this.neural[i] = new Game(g);

    }
    this.matingpool = [];
  }
  new_gen() {
    this.evaluat(this.save_neural)
    this.selection(this.save_neural)
    let r = this.save_neural.pop().grid;
    r = r.flat();
    r = r.reduce((acc, data) => {
      if (data.num > acc) {
        acc = data.num;
      }
      return acc;
    }, 0)
    console.log(`the max is: ${r}\nnew generation`);
    this.save_neural = [];
  }
}
