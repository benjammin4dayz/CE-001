import { shuffleArray } from './util.js';

class Expression {
  wrapper = ['p', { class: 'line' }];

  constructor(lines) {
    this.lines = lines;
    this.plain = lines.join('\n');
    this.oneLiner = lines.join(' / ');
    this.html = lines.map(line => this.#createElement(line)).join('');
  }

  #createElement(line) {
    const element = document.createElement(this.wrapper[0]);
    Object.entries(this.wrapper[1]).forEach(([key, value]) => {
      if (value) element.setAttribute(key, value);
    });
    element.innerHTML = line;
    return element.outerHTML;
  }
}

export class ExpressionGenerator {
  data = null;
  unseen = [];

  constructor(src) {
    if (Array.isArray(src)) {
      this.data = src;
    } else {
      fetch(src)
        .then(res => res.json())
        .then(data => {
          this.data = data;
        });
    }
  }

  get() {
    if (!this.data) {
      return ['', '', ''];
    }

    if (!this.unseen.length) {
      this.unseen.push(...this.data.map(emotion => new Expression(emotion)));
      shuffleArray(this.unseen);
    }

    return this.unseen.shift();
  }
}
