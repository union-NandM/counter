const main = document.getElementById("main");

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
    const order = Item.name_list.indexOf(this.name);
    const val = {
      count: this.counter,
      order: order,
    };
    localStorage.setItem(this.name, JSON.stringify(val));
  };

  delete = (parent) => () => {
    if (window.confirm("本当に削除しますか？")) {
      parent.removeChild(this.$body);

      Item.name_list.splice(Item.name_list.indexOf(this.name), 1);
      Item.list.splice(Item.list.indexOf(this), 1);
      localStorage.removeItem(this.name);

      Item.list.forEach((item) => {
        item.save();
      });

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

const checkFormat = (obj) => {
  return (
    Number.isSafeInteger(obj?.order) &&
    (typeof obj?.name).toLowerCase() === "string" &&
    Number.isSafeInteger(obj?.count)
  );
};

window.onload = () => {
  const data = Object.keys(localStorage).map((key) => {
    try {
      const obj = JSON.parse(localStorage.getItem(key));
      return { ...obj, name: key };
    } catch (e) {
      return {};
    }
  });

  const arr = new Array(data.length);

  for (const datam of data) {
    if (!checkFormat(datam)) {
      localStorage.clear();
      return;
    }
    arr[datam.order] = { name: datam.name, count: datam.count };
  }

  if (arr.includes(undefined)) {
    localStorage.clear();
    return;
  }

  for (const item of arr) {
    main.appendChild(new Item(item.name, main, item.count).$body);
  }
};
