class BinaryTree {
  constructor(x) {
    this.indexi = -1;
    this.addNode(x);
  }
  addNodei(x, boll = false) {
    if (boll == true) {
      ++this.indexi;
      let r = this.indexi;
      return {
        value: x,
        bigger: null,
        smaller: null,
        Id: r
      }
    } else {
      let current = this.head;
      if (this.head.value == undefined) {
        this.head = this.addNodei(x, true);
        console.log("added");
        return;
      }
      while (true) {
        if (current.value == x) {
          console.log("Already exist");
          return;
        } else if (current.value > x) {
          if (current.smaller == null) {
            current.smaller = this.addNodei(x, true);
            console.log("added");
            return;
          } else {
            current = current.smaller;
          }
        } else {
          if (current.bigger == null) {
            current.bigger = this.addNodei(x, true);
            console.log("added");
            return;
          } else {
            current = current.bigger;
          }
        }

      }
    }
  }
  addNode(x) {
    if (typeof(x) == "object") {
      if (this.head == null) {
        this.head = this.addNodei(x.shift(), true);
      }
      x.forEach((data) => {
        this.addNodei(data);
      })
    } else {
      if (this.head == null) {
        this.head = this.addNodei(x, true)
      } else {
        this.addNodei(x);
      }
    }
  }
  findNode(x) {
    console.time();
    let current = this.head;
    let tab = [];
    while (true) {

      if (current.value == x) {
        console.timeEnd();
        if (current.Id == 0) {
          return "it is in the root"
        } else {
          return tab;
        }
      } else if (current.value > x) {
        if (current.smaller == null) {
          console.timeEnd();
          return "not Found";
        } else {
          tab.push(current.Id + "_S");
          current = current.smaller;
        }
      } else {
        if (current.bigger == null) {
          console.timeEnd();
          return "not Found";
        } else {
          tab.push(current.Id + "_B");
          current = current.bigger;
        }
      }
    }
  }
}
