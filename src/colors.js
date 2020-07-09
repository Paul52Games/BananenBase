module.exports = function Color(string) {
  return {
    out: "\x1b[0m",
    done: function () {
      return `${this.out}${string}\x1b[0m`;
    },
    black: function () {
      this.out += "\x1b[30m";
      return this;
    },
    red: function () {
      this.out += "\x1b[31m";
      return this;
    },
    green: function () {
      this.out += "\x1b[32m";
      return this;
    },
    yellow: function () {
      this.out += "\x1b[33m";
      return this;
    },
    blue: function () {
      this.out += "\x1b[34m";
      return this;
    },
    magenta: function () {
      this.out += "\x1b[35m";
      return this;
    },
    cyan: function () {
      this.out += "\x1b[36m";
      return this;
    },
    white: function () {
      this.out += "\x1b[37m";
      return this;
    },
    reset: function () {
      this.out += "\x1b[0m";
      return this;
    }
  }
}