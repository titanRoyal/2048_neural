class cell {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.h = z
    this.num = null;
    this.neww = true;
  }
  show() {
    push()
      noStroke()
    if (this.num != null) {
      fill(color_it(this.num));
    } else {
      fill("#353b48");
    }
    noTint()
    ellipse(this.x, this.y, this.h, this.h);
    pop()
    if (this.num != null) {
      fill(255)
      noStroke()
      textSize(this.h / 100 * 40)
      textAlign(CENTER, CENTER)
      text(this.num, this.x, this.y)
    }
  }
}
function color_it(x) {
  switch (x) {
    case null:
      return "#d98911"
    case 2:
      return "#9c1136"
    case 4:
      return "#1f0cc1"
    case 8:
      return "#1295be"
    case 16:
      return "#09b361"
    case 32:
      return "#28c60e"
    case 64:
      return "#398e0c"
    case 128:
      return "#97c820"
    case 256:
      return "#b1261d"
    case 512:
      return "#e1e616"
    case 1024:
      return "#51753e"
    case 2048:
      return "#dfdd14"
    default:
      return "#601b09"
  }
}

function removeneww() {
  for (var i = 0; i < grid.length; i++) {
    for (gg of grid[i]) {
      if (gg.num != null && gg.neww) {
        gg.neww = false;
      } else {
        gg.neww = false;
      }
    }
  }
}

function mutate(x) {
  if (random(1) < 0.3) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function posible() {
  let ddata = []
  let savegrid = []
  let sscore = []
  for (var i = 0; i < grid.length; i++) {
    savegrid[i] = []
    for (var j = 0; j < grid[i].length; j++) {
      savegrid[i][j] = grid[i][j].num
    }
  }
  for (var i = 0; i < 4; i++) {
    combination("up")
    shiffting("up")
  }
  addtile()
  if (!equ(grid, savegrid)) {
    ddata.push(get_scr())
    sscore.push(0)
  } else {
    sscore.push(-1)
  }
  swap(grid, savegrid);
  ////////////////////////////////////
  for (var i = 0; i < 4; i++) {
    combination("down")
    shiffting("down")
  }
  addtile()
  if (!equ(grid, savegrid)) {
    ddata.push(get_scr())
    sscore.push(0)
  } else {
    sscore.push(-1)
  }
  swap(grid, savegrid);
  ////////////////
  for (var i = 0; i < 4; i++) {
    combination("left")
    shiffting("left")
  }
  addtile()
  if (!equ(grid, savegrid)) {
    ddata.push(get_scr())
    sscore.push(0)
  } else {
    sscore.push(-1)
  }
  swap(grid, savegrid);
  //////////////////////////
  for (var i = 0; i < 4; i++) {
    combination("right")
    shiffting("right")
  }
  addtile()
  if (!equ(grid, savegrid)) {
    ddata.push(get_scr())
    sscore.push(0)
  } else {
    sscore.push(-1)
  }
  swap(grid, savegrid);
  for (var i = 0; i < ddata.length; i++) {
    if (sscore[i] == 0) {
      sscore[i] = 0;
      for (var j = 0; j < ddata[i].length; j++) {
        if (j % 2 == 0) {
          sscore[i] += ddata[i][j] * 5
        } else {
          sscore[i] += ddata[i][j] * 2;
        }
      }
    }
  }
  return sscore;
}

function swap(grid, savegrid) {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      grid[i][j].num = savegrid[i][j]
    }
  }
}

function equ(grid, savegrid) {
  let testi = true;
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      if (grid[i][j].num != savegrid[i][j]) {
        testi = false;
      }
    }
  }
  return testi
}
