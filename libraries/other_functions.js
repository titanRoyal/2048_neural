function private(x) {
  if (x) {
    return (
      (() => {
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
  } else {
    console.error("Invalid input");
  }
}
