Array.prototype.peek = function() {
  return this[this.length - 1];
};
Array.prototype.test = function(arr) {
  if (this.length != arr.length) {
    console.log("sorry this arrays are not equal in length");
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] != this[i]) {
        return false;
      }
    }
    return true;
  }
};

////this is the new version
