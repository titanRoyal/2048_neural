function private(x){
  return(
    (function() {
      let locked = x;
      return {
        get() {
          return locked;
        },
        set(xx) {
          locked = xx;
        }
      }
    })()
  )
}
