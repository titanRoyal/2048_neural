let grid = [];
const caro = 4;
let scalar
let spacing;
let real;
let butt;
let nn;
stopp = false;
let playbot = true;
let data = []
let r

function setup() {
  rectMode(CENTER)
  createCanvas(600, 600);
  select("canvas")
    .position((windowWidth - width) / 2, (windowHeight - height) / 2);
  real = width / caro;
  spacing = real / 20;
  scalar = (width) / caro - spacing;
  r = new population(4000);
}

function resset() {
  for (var i = 0; i < caro; i++) {
    for (var j = 0; j < caro; j++) {
      grid[i][j].num = null;
    }
  }
  addtile();
  loop();
}

function addfile(gg) {
  for (var j = 0; j < 150; j++) {
    for (var i = 0; i < howlength(gg); i++) {
      let r = gg[i];
      nn.train(r.sqn, r.action)
    }
  }
  shuffle(gg, true)
}

function howlength(ghg) {
  let count = 0
  while (true) {
    if (ghg[count]) {
      count++
    } else {
      break;
    }
  }
  return count;
}

function draw() {
  r.show()
  r.update()
}

function savedgrid() {
  let tab = []
  for (var i = 0; i < caro; i++) {
    for (var j = 0; j < caro; j++) {
      tab.push(grid[i][j].num);
    }
  }
  return tab;
}

function keyPressed() {
  if (keyIsDown(UP_ARROW)) {
    if (r.combination("up", "n")[0] || r.shiffting("up", "n")[0]) {
      data.push({
        sqn: r.get_scr(),
        action: [1, 0, 0, 0]
      })
      for (var i = 0; i < 4; i++) {
        r.combination("up")
        r.shiffting("up")
      }
      //removeneww();
      r.addtile()
    }
  } else if (keyIsDown(DOWN_ARROW)) {
    if (r.combination("down", "n")[0] || r.shiffting("down", "n")[0]) {
      data.push({
        sqn: r.get_scr(),
        action: [0, 1, 0, 0]
      })
      for (var i = 0; i < 4; i++) {
        r.combination("down")
        r.shiffting("down")
      }
      //removeneww();
      r.addtile()
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    if (r.combination("left", "n")[0] || r.shiffting("left", "n")[0]) {
      data.push({
        sqn: r.get_scr(),
        action: [0, 0, 1, 0]
      })
      for (var i = 0; i < 4; i++) {
        r.combination("left")
        r.shiffting("left")
      }
      //removeneww();
      r.addtile()
    }
  } else if (keyIsDown(RIGHT_ARROW)) {

    if (r.combination("right", "n")[0] || r.shiffting("right", "n")[0]) {
      data.push({
        sqn: r.get_scr(),
        action: [0, 0, 0, 1]
      })
      for (var i = 0; i < 4; i++) {
        r.combination("right")
        r.shiffting("right")
      }
      r.addtile()
    }
  }
}

function trainnnn() {
  for (var j = 0; j < 500; j++) {
    for (var i = 0; i < data.length; i++) {
      let r = data[i];
      nn.train(r.sqn, r.action)
    }
  }
  shuffle(data, true)
}
function all_in(hh, x = 1) {
  for (var i = 0; i < x; i++) {
    addfile(hh)
    console.log("epoch n° " + (i + 1) + " done");
  }
}

function algoplay() {
  let g = posible();
  let r = g[0];
  let ff = []
  for (var i = 0; i < g.length; i++) {
    if (r < g[i]) r = g[i];
  }
  for (var i = 0; i < g.length; i++) {
    if (g[i] == r) {
      ff.push(i);
    }
  }
  let y;
  y = random(ff);
  // console.log(ff);
  // console.log(y);
  switch (y) {
    case 0:
      for (var i = 0; i < 4; i++) {
        combination("up")
        shiffting("up")
      }
      removeneww();
      addtile()
      break;
    case 01:
      for (var i = 0; i < 4; i++) {
        combination("down")
        shiffting("down")
      }
      removeneww();
      addtile()
      break;
    case 02:
      for (var i = 0; i < 4; i++) {
        combination("left")
        shiffting("left")
      }
      removeneww();
      addtile()
      break;
    case 03:
      for (var i = 0; i < 4; i++) {
        combination("right")
        shiffting("right")
      }
      removeneww();
      addtile()
      break;

  }
}
