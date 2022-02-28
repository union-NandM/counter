const main = document.getElementById("main");

const div = "div";
const button = "button";

const input = document.getElementById("input");
const add_button = document.getElementById("add_button");

document.addEventListener("keydown", (e) => {
  if (document.activeElement !== input) {
    input.focus();
  } else if (e.key === "Enter") {
    add_button.click();
  }
});

class Item {
  static list = [];
  static name_list = [];

  constructor(name, $parent, cnt = 0) {
    this.counter = cnt;
    this.name = name;

    this.$body = generateElement({ classNames: ["box"] });
    this.$name_tag = generateElement({ classNames: ["name"], text: name });
    this.$value = generateElement({
      classNames: ["counter"],
      text: this.counter,
    });
    this.$button_box = generateElement({ classNames: ["btn_box"] });

    this.$inc_btn = generateElement({
      tag: "button",
      classNames: ["item_btn", "inc_btn"],
      text: "+",
      click_callback: this.increment,
    });
    this.$dec_btn = generateElement({
      tag: "button",
      classNames: ["item_btn", "dec_btn"],
      text: "-",
      click_callback: this.decrement,
    });
    this.$del_btn = generateElement({
      tag: "button",
      classNames: ["item_btn", "del_btn"],
      text: "x",
      click_callback: this.delete($parent),
    });

    this.$button_box.appendChild(this.$inc_btn);
    this.$button_box.appendChild(this.$dec_btn);
    this.$button_box.appendChild(this.$del_btn);

    this.$body.appendChild(this.$name_tag);
    this.$body.appendChild(this.$value);
    this.$body.appendChild(this.$button_box);

    Item.name_list.push(name);
    Item.list.push(this);

    this.save();
    console.log(Item.name_list);
  }

  increment = () => {
    this.counter++;
    this.$value.textContent = this.counter;
    this.save();
  };

  decrement = () => {
    this.counter--;
    this.$value.textContent = this.counter;
    this.save();
  };

  save = () => {
    localStorage.setItem(this.name, this.counter);
  };

  delete = (parent) => () => {
    if (window.confirm("本当に削除しますか？")) {
      parent.removeChild(this.$body);
      console.log(this.name);
      console.log(Item.name_list.indexOf(this.name));

      Item.name_list.splice(Item.name_list.indexOf(this.name), 1);
      Item.name_list.splice(Item.list.indexOf(this), 1);
      localStorage.removeItem(this.name);

      console.log(Item.name_list);
      delete this;
    }
  };

  static isExist = (name) => this.name_list.includes(name);
}

const generateElement = ({
  tag = "div",
  classNames = [""],
  text = "",
  click_callback = null,
}) => {
  const element = document.createElement(tag);
  classNames.forEach((className) => {
    element.classList.add(className);
  });
  element.textContent = text;
  if (click_callback) {
    element.addEventListener("click", click_callback);
  }

  return element;
};

add_button.addEventListener("click", () => {
  if (input.value && !Item.isExist(input.value)) {
    main.appendChild(new Item(input.value, main).$body);
  }
  input.value = "";
});

window.onload = () => {
  Object.keys(localStorage).forEach((key) => {
    main.appendChild(new Item(key, main, localStorage.getItem(key)).$body);
  });
};
