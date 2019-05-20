class Genome {
  constructor(x, y) {
    this.idGenerator = new generator()
    this.inoovGenerator = new generator()
    if (x && !y) {
      let tab = []
      this.connection = x.brain;
      this.input_num = x.inpp
      this.output_num = x.outt;
      this.Nodes = [];
      for (var i = 0; i <= maxInov(this.connection); i++) {
        let h = findInov(this.connection, i);
        if (h != -1) {
          if (!tab.includes(h.input_id)) {
            tab.push(h.input_id);
          }
          if (!tab.includes(h.output_id)) {
            tab.push(h.output_id);
          }
        }
      }
      for (var i = 0; i < tab.length; i++) {
        if (i < this.input_num) {
          this.Nodes[i] = new nodeGene(i);
          this.assignID(this.Nodes[i], "I")
        } else if (i >= this.input_num && i < this.input_num + this.output_num) {
          this.Nodes[i] = new nodeGene(i);
          this.assignID(this.Nodes[i], "O")
        } else {
          this.Nodes[i] = new nodeGene(i);
          this.assignID(this.Nodes[i], "H")
        }
      }
    } else if (x && y) {
      this.input_num = x;
      this.output_num = y;
      this.Nodes = []
      this.connection = [];
      for (var i = 0; i < x; i++) {
        let h = new nodeGene(this.idGenerator.nextNum());
        this.assignID(h, "I")
        this.Nodes.push(h);
      }
      for (var i = 0; i < y; i++) {
        let h = new nodeGene(this.idGenerator.nextNum());
        this.assignID(h, "O")
        this.Nodes.push(h);
      }
      this.bias = new nodeGene(this.idGenerator.nextNum());
      this.assignID(this.bias, "B")
      this.bias.sum = 1;
      this.Nodes.push(this.bias);
      for (var iii of this.Nodes) {
        if (iii.status == "O") this.addconn(this.bias.id, iii.id, random(1), true);
      }
      this.addconnMutate()
      this.addconnMutate()
    }
  }
  mutate() {
    if (random(1) > 0.99) {
      console.log("add node");
      // if (random(1) > 0.93) {
      //   this.addNode();
      // } else {
      this.addNodeMutate();
      // }
    }
    if (random(1) > 0.9) {
      console.log("add connection");
      this.addconnMutate()
    }
    this.mutateWeight()

  }
  isconn(x1, x2) {
    let test = undefined;
    for (let th of this.connection) {
      if (th.input_id == x1 && th.output_id == x2 /*&& th.isAlive*/ ) {
        test = (this.findID(x1).sum * th.weight);
        break;
      }
    }
    return test;
  }
  isdone() {
    let end = true;
    for (var i = 0; i < this.Nodes.length; i++) {
      if (this.Nodes[i].sum == null) end = false;
    }
    return end;
  }
  feedforward(x) {
    let off = 0
    for (var i = 0; i < this.Nodes.length; i++) {

      this.Nodes[i].sum = null;
    }
    if (x.length == this.input_num) {
      for (var i = 0; i < this.input_num; i++) {
        if (x[i] == null) {
          this.findID(i).sum = 0;
        } else {
          this.findID(i).sum = x[i];
        }
      }
      while (true) {
        for (var i = maxId(this.Nodes); i >= this.input_num; i--) {
          if (this.findID(i).status == "B") {
            this.findID(i).sum = 1;
          } else {
            let sum = 0
            let skip = false;
            let alone = true;
            for (var j = 0; j <= maxId(this.Nodes); j++) {
              if (this.isconn(j, i) != undefined) {
                alone = false;
                if (this.findID(j).sum == null) {
                  skip = true;
                  break;
                } else {
                  sum += this.isconn(j, i);
                }
              }
            }
            if (this.findID(i) != -1) {
              if (alone) {
                this.findID(i).sum = 0;
              } else {
                let yy = this.findID(i)
                if (!skip && yy != -1) {
                  if (yy == undefined) console.log("     " + i);
                  yy.sum = 1 / (1 + Math.exp(-sum));
                }
              }
            }
          }
        }
        if (this.isdone()) {
          break;
        } else {
          off++;
        }
        if (off >= 3000) {
          console.log("safty exit");
          break;
        }
      }
      let tab = []
      for (var i = 0; i < this.Nodes.length; i++) {
        if (this.Nodes[i].status == "O") {
          tab.push(this.Nodes[i].sum);
        }
      }
      return tab;
    } else {
      console.log("input not matching");
    }

  }
  addNode(w = this.idGenerator.nextNum(), ifadd = "y") {
    let gh = new nodeGene(w);
    this.assignID(gh, "H");
    this.Nodes.push(gh)
    if (ifadd != "n") {
      this.addconn(this.bias.id, gh.id, random(1), true)
    }
    return gh;
  }
  assignID(id, val) {
    id.status = val;
  }
  maxInov() {
    let maxx = 0
    for (var g of this.connection) {
      if (maxx < g.Innov) maxx = g.Innov;
    }
    return maxx;
  }
  addNodeMutate() {
    let r = floor(random(this.connection.length))
    while (true) {
      if (this.Nodes[this.connection[r].input_id].status == "B" || this.Nodes[this.connection[r].output_id].status == "B") {
        r = floor(random(this.connection.length));
      } else {
        break;
      }
    }
    let inpp = this.connection[r].input_id
    let outp = this.connection[r].output_id;
    let savedconn = this.connection[r].weight;
    this.connection.splice(r, 1);
    let newwN = this.addNode();
    this.addconn(inpp, newwN.id, random(1), true);
    this.addconn(newwN.id, outp, savedconn, true);
  }
  mutateWeight() {
    for (var i = 0; i < this.connection.length; i++) {
      if (random(1) >= 0.9) {
        this.connection[i].weight = random(-1, 1);
      } else {
        this.connection[i].weight *= random(-1, 1);
      }
    }
  }
  static calcDifrence(g1, g2) {
    let maxi = maxInov(g1.connection, g2.connection)
    let total = 0;
    let num = 0;
    for (var i = 1; i <= maxi; i++) {
      let i1 = g1.findInov(i);
      let i2 = g2.findInov(i);
      if (i1 != -1 && i2 != -1) {
        num++;
        total += i1.weight + i2.weight;
      }
    }
    return total / num;
  }
  addconnMutate() {
    let maxi = maxInov(this.connection)
    let maxi1 = maxId(this.Nodes)
    let safe = 0
    let tab = []
    // if (safe == 6000) {
    //   console.log("safety Exit");
    //   break;
    // }
    let done = false;
    let exist, i1, i2;
    for (var x = 0; x < this.Nodes.length; x++) {
      for (var y = 0; y < this.Nodes.length; y++) {
        i1 = this.Nodes[x]
        i2 = this.Nodes[y]
        if (i1.id != i2.id) {
          exist = false;
          if (this.connection.length != 0) {
            for (var i = 0; i < this.connection.length; i++) {

              if ((this.connection[i].input_id == i1.id && this.connection[i].output_id == i2.id) || (this.connection[i].input_id == i2.id && this.connection[i].output_id == i1.id)) {
                exist = true;
                break;
              }
            }
          }
        } else {
          exist = true;
        }
        if (!exist) {
          tab.push({
            x1: i1,
            x2: i2
          })
        }
      }
      // if (done) {
      //   break;
      // }
    }
    while (true) {
      let index = floor(random(tab.length))
      if (tab.length != 0 && tab[index].x1.status != "B" && tab[index].x2.status != "B") {
        let r = tab[index];
        if ((r.x1.status != "O" && r.x2.status != "O") && (r.x1.status != "I" && r.x2.status != "I")) {
          if (r.x1.id > r.x2.id) {
            this.addconn(r.x2.id, r.x1.id, random(1), true);
          } else {
            this.addconn(r.x1.id, r.x2.id, random(1), true);
          }
          done = true;
        } else if ((r.x1.status != "O" && r.x2.status == "O") || (r.x1.status == "I" && r.x2.status != "I")) {
          this.addconn(r.x1.id, r.x2.id, random(1), true);
          done = true;
        } else if ((r.x1.status == "O" && r.x2.status != "O") || (r.x1.status != "I" && r.x2.status == "I")) {
          this.addconn(r.x2.id, r.x1.id, random(1), true);
          done = true;
        }
      } else {
        if (tab.length == 0) {
          console.log("no More connections");
          done = true;
        } else {
          tab.splice(index, 1)
        }

      }
      if (done) {
        break;
      } else {
        tab.splice(index, 1);
      }
    }
    safe++;
  }
  addconn(n1, n2, w, end, inv = -1) {
    let canadd = true;
    if (n1 == n2 || this.findID(n1) == -1 || this.findID(n2) == -1) {
      canadd = false;
      console.log("Node does not Exist");
    }
    if (canadd) {
      for (var i = 0; i < this.connection.length; i++) {
        if ((this.connection[i].input_id == n1 && this.connection[i].output_id == n2) || (this.connection[i].input_id == n2 && this.connection[i].output_id == n1)) {
          canadd = false;
          console.log("connection already Exist");
        }
      }
      if (canadd) {
        if (inv == -1) {
          this.connection.push(new conn(n1, n2, w, end, this.inoovGenerator.nextNum()))
        } else {
          this.connection.push(new conn(n1, n2, w, end, inv))
        }
      }
    }
  }
  static check(conna, g) {
    let maxi = maxInov(conna);
    let test = true;
    for (var i = 0; i <= maxi; i++) {
      let hg = findInov(conna, i)
      if (hg != -1) {
        if (hg.input_id == g.input_id && hg.output_id == g.output_id) {
          test = false;
          break;
        }
      }
    }
    return test;
  }
  static crossover(g1, g2) {
    let m = maxInov(g1.connection, g2.connection);
    // let m1 = maxId(g1.Nodes)
    // let m = maxId(g2.Nodes)
    let newgene = [];
    let newstate = [];
    for (var i = 0; i <= m; i++) {
      //if (g1.connection[i] || g2.connection[i]) {}
      let inv1 = g1.findInov(i)
      if (inv1 != -1) {
        inv1 = inv1.copy()
      }
      let inv2 = g2.findInov(i)
      if (inv2 != -1) {
        inv2 = inv2.copy()
      }
      if (inv1 != -1 && inv2 == -1 && Genome.check(newgene, inv1)) {
        let y = {
          id: inv1.input_id,
          status: g1.findID(inv1.input_id).status
        }
        let y1 = {
          id: inv1.output_id,
          status: g1.findID(inv1.output_id).status
        }
        if (!newstate.includes(y)) {
          newstate.push(y)
        }
        if (!newstate.includes(y1)) {
          newstate.push(y1)
        }
        newgene.push(inv1.copy())
      } else if (inv1 == -1 && inv2 != -1 && Genome.check(newgene, inv2)) {
        let y = {
          id: inv2.input_id,
          status: g2.findID(inv2.input_id).status
        }
        let y1 = {
          id: inv2.output_id,
          status: g2.findID(inv2.output_id).status
        }
        if (!newstate.includes(y)) {
          newstate.push(y)
        }
        if (!newstate.includes(y1)) {
          newstate.push(y1)
        }
        newgene.push(inv2.copy())
      } else if (inv1 != -1 && inv2 != -1) {

        if (inv1.isAlive == false && Genome.check(newgene, inv1)) {
          let y = {
            id: inv1.input_id,
            status: g1.findID(inv1.input_id).status
          }
          let y1 = {
            id: inv1.output_id,
            status: g1.findID(inv1.output_id).status
          }
          if (!newstate.includes(y)) {
            newstate.push(y)
          }
          if (!newstate.includes(y1)) {
            newstate.push(y1)
          }
          newgene.push(inv1.copy())
        } else if (inv2.isAlive == false && Genome.check(newgene, inv2)) {
          let y = {
            id: inv2.input_id,
            status: g2.findID(inv2.input_id).status
          }
          let y1 = {
            id: inv2.output_id,
            status: g2.findID(inv2.output_id).status
          }
          if (!newstate.includes(y)) {
            newstate.push(y)
          }
          if (!newstate.includes(y1)) {
            newstate.push(y1)
          }
          newgene.push(inv2.copy())
        } else {
          if (inv2.weight > inv1.weight && Genome.check(newgene, inv2)) {
            let y = {
              id: inv2.input_id,
              status: g2.findID(inv2.input_id).status
            }
            let y1 = {
              id: inv2.output_id,
              status: g2.findID(inv2.output_id).status
            }
            if (!newstate.includes(y)) {
              newstate.push(y)
            }
            if (!newstate.includes(y1)) {
              newstate.push(y1)
            }
            newgene.push(inv2.copy())
          } else if (Genome.check(newgene, inv1)) {
            let y = {
              id: inv1.input_id,
              status: g1.findID(inv1.input_id).status
            }
            let y1 = {
              id: inv1.output_id,
              status: g1.findID(inv1.output_id).status
            }
            if (!newstate.includes(y)) {
              newstate.push(y)
            }
            if (!newstate.includes(y1)) {
              newstate.push(y1)
            }
            newgene.push(inv1.copy())
          }
        }
      }
    }
    let h = new Genome({
      brain: newgene,
      inpp: g1.input_num,
      outt: g1.output_num
    });
    h.input_num = g1.input_num;
    h.output_num = g1.output_num;
    for (var i = 0; i <= maxId(g1.Nodes); i++) {
      if (g1.findID(i) != -1) {
        if (h.findID(i) == -1) {
          let gg = h.addNode(i, "n");
          gg.status = g1.Nodes[i].status;
        } else {
          h.Nodes[i].status = g1.Nodes[i].status;
        }
      }

    }
    for (var i = 0; i <= maxId(g2.Nodes); i++) {
      if (g2.findID(i) != -1) {
        if (h.findID(i) == -1) {
          let gg = h.addNode(i, "n");
          gg.status = g2.Nodes[i].status;
        } else {
          h.Nodes[i].status = g2.Nodes[i].status;
        }
      }
    }
    h.idGenerator.genn = maxId(h.Nodes);
    h.inoovGenerator.genn = maxInov(h.connection)
    for (let xx of h.Nodes) {
      if (xx.status == "B") {
        xx.sum = 1;
        h.bias = xx;
        break;
      }
    }
    return h;
  }

  findInov(k) {
    let gh = []
    for (var i = 0; i < this.connection.length; i++) {
      if (this.connection[i].Innov == k) {
        gh.push(this.connection[i]);
        break;
      }
    }
    if (gh.length == 0) {
      return -1;
    } else {
      return gh[0];
    }
  }
  findID(k) {
    let gh = []
    for (var i = 0; i < this.Nodes.length; i++) {
      if (this.Nodes[i].id == k) {
        gh.push(this.Nodes[i]);
        break;
      }
    }
    if (gh.length == 0) {
      return -1;
    } else {
      return gh[0];
    }
  }
}

class conn {
  constructor(inp, outp, w, enb, inv) {
    this.input_id = inp;
    this.output_id = outp;
    this.weight = w;
    this.isAlive = enb;
    this.Innov = inv;
  }
  static compGene(g1, g2) {
    let r = maxInov(g1.connection, g2.connection)
    let maxG1 = maxInov(g1.connection)
    let maxG2 = maxInov(g2.connection)
    let f = {
      matching: 0,
      disjoined: 0,
      excced: 0
    }
    for (var i = 1; i <= r; i++) {
      if (g1.findInov(i) != -1 && g2.findInov(i) != -1) {
        f.matching++;
      } else if ((g1.findInov(i) == -1 && g2.findInov(i) != -1 && g2.findInov(i).Innov >= maxG1) || (g2.findInov(i) == -1 && g1.findInov(i) != -1 && g1.findInov(i).Innov >= maxG2)) {
        f.excced++;
      } else if ((g1.findInov(i) == -1 && g2.findInov(i) != -1 && g2.findInov(i).Innov < maxG1) || (g2.findInov(i) == -1 && g1.findInov(i) != -1 && g1.findInov(i).Innov < maxG2)) {
        f.disjoined++;
      }
    }
    return f;
  }
  copy() {
    return new conn(this.input_id, this.output_id, this.weight, this.isAlive, this.Innov)
  }
  enable() {
    this.isAlive = true;
  }
  disable() {
    this.isAlive = false;
  }
}
class nodeGene {
  constructor(w) {
    this.id = w;
    this.status = null;
    this.sum = null;
  }
}

function maxInov(g, g1) {
  let maxx = 0
  for (var i = 0; i < g.length; i++) {
    if (g[i].Innov) {
      if (maxx < g[i].Innov) maxx = g[i].Innov;
    }
  }
  if (g1) {
    for (var i = 0; i < g1.length; i++) {
      if (g1[i].Innov) {
        if (maxx < g1[i].Innov) maxx = g1[i].Innov;
      }
    }
  }
  return maxx;
}
class generator {
  constructor() {
    this.genn = -1
  }
  nextNum() {
    this.genn++
    return this.genn;
  }
}

function findInov(g1, k) {
  let gh = []
  for (var i = 0; i < g1.length; i++) {
    if (g1[i].Innov == k) {
      gh.push(g1[i]);
      break;
    }
  }
  if (gh.length == 0) {
    return -1;
  } else {
    return gh[0];
  }
}

function maxId(h, h1) {
  let maxi = -1
  for (var i = 0; i < h.length; i++) {
    if (maxi < h[i].id) maxi = h[i].id;
  }
  if (h1) {
    for (var i = 0; i < h1.length; i++) {
      if (maxi < h1[i].id) maxi = h1[i].id;
    }
  }
  return maxi
}
// function findID(g1, k) {
//   let gh = []
//   for (var i = 0; i < g1.Nodes.length; i++) {
//     if (g1.Nodes[i].id == k) {
//       gh.push(g1.Nodes[i]);
//       break;
//     }
//   }
//   if (gh.length == 0) {
//     return -1;
//   } else {
//     return gh[0];
//   }
// }
