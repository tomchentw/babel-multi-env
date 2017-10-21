const a = "a";

const pen = () => "pen";

class Accumulator {
  constructor() {
    this.value = "";
  }

  append(it) {
    this.value += it;
  }

  get final() {
    return this.value;
  }
}

const result = new Accumulator();
for (const value of ["This", `is ${a}`, pen``]) {
  result.append(value);
  result.append(" ");
}

console.log(result.final);
