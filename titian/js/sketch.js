let test = async function(x) {
  return new Promise(function(resolve, reject) {
    if(x){
      return resolve(x)
    }else{
      reject("invalid input CORRECT IT")
    }
  });
}

let test1 = (x) => {
  test(x).then((ff) => {
    console.log(ff)
  }).catch((e) => {
    console.error(e);
  })
}

function setup() {
  createCanvas(600, 600);
};

function draw() {
  background(51);
}
