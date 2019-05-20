function neural_net(inp, nh, o) {
  if (inp instanceof neural_net) {
    this.input_n = private(inp.input_n);
    this.hiden_n = private(inp.hiden_n);
    this.hiden_layer = private(inp.hiden_layer);
    this.output_n = private(inp.output_n);
    this.lr = private(inp.lr);
    this.weight = private([]);
    this.bias = private([]);
    for (var i = 0; i < inp.weight.length; i++) {
      this.weight[i] = inp.weight[i].copy()
    }
    for (i = 0; i < inp.bias.length; i++) {
      this.bias[i] = inp.bias[i].copy()
    }
  } else {
    this.input_n = inp;
    this.hiden_n = nh;
    this.hiden_layer = nh.length;
    this.output_n = o;
    this.lr = 0.055;
    this.weight = [];
    this.bias = []
    for (var i = 0; i < this.hiden_layer + 1; i++) {
      if (i == 0) {
        this.weight[i] = new matrix(this.hiden_n[i], this.input_n);
      } else if (i == this.hiden_layer) {
        this.weight[i] = new matrix(this.output_n, this.hiden_n[i - 1]);
        this.bias[i] = new matrix(this.output_n, 1);
        this.bias[i].randomize();
      } else {
        this.weight[i] = new matrix(this.hiden_n[i], this.hiden_n[i - 1]);
        this.bias[i] = new matrix(this.hiden_n[i], 1);
        this.bias[i].randomize();
      }
      this.weight[i].randomize();
    }
    for (var i = 0; i < this.hiden_layer + 1; i++) {
      if (i == this.hiden_layer) {
        this.bias[i] = new matrix(this.output_n, 1);
      } else {
        this.bias[i] = new matrix(this.hiden_n[i], 1);
      }
      this.bias[i].randomize();
    }
  }
  this.feedforward = function(inp) {
    let inputs = matrix.fromarray(inp);
    let sum_h;
    for (var i = 0; i < this.weight.length; i++) {
      sum_h = matrix.mult(this.weight[i], inputs);
      sum_h.add(this.bias[i]);
      sum_h.map(sigmoid);
      inputs = sum_h;
    }
    return matrix.toarray(inputs);
  }

  this.train = function(input, answer) {
    //	let output = this.feedforward( input );
    //////////////////////////////////////////////////
    let inputs = matrix.fromarray(input);
    let target = matrix.fromarray(answer);
    let output;
    let err_tab = [];
    let gradiant = [];
    let deltaw = [];

    let sum_h = [];
    sum_h[0] = inputs;
    for (var i = 0; i < this.weight.length; i++) {
      sum_h[i] = matrix.mult(this.weight[i], sum_h[i]);
      sum_h[i].add(this.bias[i]);
      sum_h[i].map(sigmoid);
      sum_h[i + 1] = sum_h[i];
    }
    sum_h.splice(this.weight.length, 1);
    output = sum_h[sum_h.length - 1];
    let output_err = matrix.substract(target, output);
    for (var i = this.weight.length - 1; i >= 0; i--) {
      if (i == this.weight.length - 1) {
        err_tab[i] = matrix.mult(matrix.transpose(this.weight[i]), output_err);
      } else {
        err_tab[i] = matrix.mult(matrix.transpose(this.weight[i]), err_tab[i + 1])
      }
    }
    for (var i = 0; i < this.weight.length; i++) {
      if (i == 0) {
        gradiant[i] = matrix.map(sum_h[i], dsigmoidA);
        gradiant[i].mult(err_tab[i + 1]);
        gradiant[i].mult(this.lr);
        this.bias[i].add(gradiant[i]);
        let inppp_t = matrix.transpose(inputs);
        deltaw[i] = matrix.mult(gradiant[i], inppp_t);

      } else if (i == this.weight.length - 1) {
        gradiant[i] = matrix.map(sum_h[i], dsigmoidA);
        gradiant[i].mult(output_err);
        gradiant[i].mult(this.lr);
        this.bias[i].add(gradiant[i]);
        deltaw[i] = matrix.mult(gradiant[i], matrix.transpose(sum_h[i - 1]));
      } else {
        gradiant[i] = matrix.map(sum_h[i], dsigmoidA);
        gradiant[i].mult(err_tab[i + 1]);
        gradiant[i].mult(this.lr);
        this.bias[i].add(gradiant[i]);
        deltaw[i] = matrix.mult(gradiant[i], matrix.transpose(sum_h[i - 1]));
      }
      this.weight[i].add(deltaw[i]);
    }
  }
  this.copy = function() {
    return new neural_net(this);
  }
  this.mutate = function(func) {
    for (var i = 0; i < this.weight.length; i++) {
      this.weight[i].map(func)
    }
    for (var i = 0; i < this.bias.length; i++) {
      this.bias[i].map(func)
    }

  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoidA(x) {
  return x * (1 - x);
}

function addall(xy) {
  let r = 0;
  for (var i = 0; i < xy.row; i++) {
    for (var j = 0; j < xy.col; j++) {
      r += xy.matrox[i][j];
    }
  }
  return r;
}
