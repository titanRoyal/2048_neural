class neural_net {
  //setting up the neural network layers
  constructor(inp, nh, o, lr = 0.055) {
    if (inp instanceof neural_net) {
      this.input_n = inp.input_n;
      this.hiden_n = inp.hiden_n
      this.hiden_layer = inp.hiden_layer;
      this.output_n = inp.output_n;
      //learning rate variables
      this.epochs = 0;
      this.lr_decay = 1;
      this.alpha0 = 0.2;
      this.lr;
      //////////////////
      this.weight = [];
      this.bias = [];
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
      //learnin rate variables
      this.epochs = 0;
      this.lr_decay = 1;
      this.alpha0 = 0.2;
      this.lr = lr;
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
  }
  //learning rate decay
  // decay(){
  //   this.epochs++;
  //   retrun (1/(1+this.lr_decay*this.epochs))*this.alpha0;
  // }
  //inserting input funtion to recive the neural network output
  feedforward(inp) {
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
  //training the neural network by tuning the weight
  train(input, answer) {
    // this.lr=this.decay();
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
  copy() {
    return new neural_net(this);
  }
  saveData() {
    let r = {
      weights: this.weight,
      bias: this.bias
    }
    saveJSON(r, "data.json")
  }
  loadData(path) {
    loadJSON(path, (data) => {
      if (data.weights.length == this.weight.length && data.bias.length == this.bias.length) {
        this.weight.forEach((data1,index)=>{
          data1.matrox=data.weights[index].matrox
        })
        this.bias.forEach((data1,index)=>{
          data1.bias=data.bias[index].matrox
        })
        console.log("loaded");
      } else {
        console.log("not compatible");
      }
    })
  }
  mutate(func) {
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
