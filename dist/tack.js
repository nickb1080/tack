// Generated by CoffeeScript 1.7.1
(function() {
  var Tack, TackText, buildFromDomNode, defaults, each, extend, map, remove, selfClosingTags, tackMaker, tags,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  tags = Object.create(null);

  "a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn dialog div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header html i iframe ins kbd label legend li main map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small span strong style sub summary sup table tbody td textarea tfoot th thead time title tr u ul var video area base br col command embed hr img input keygen link meta param source track wbr".split(/\s+/).forEach(function(tag) {
    return tags[tag] = true;
  });

  selfClosingTags = Object.create(null);

  "area base br col command embed hr img input keygen link meta param source track wbr".split(/\s+/).forEach(function(tag) {
    selfClosingTags[tag] = true;
    return tags[tag] = true;
  });

  map = Function.prototype.call.bind(Array.prototype.map);

  each = Function.prototype.call.bind(Array.prototype.forEach);

  remove = function(arr, item) {
    var i;
    i = arr.indexOf(item);
    while (i > -1) {
      arr.splice(i, 1);
      i = arr.indexOf(item);
    }
    return arr;
  };

  defaults = function() {
    return {
      attributes: {},
      "class": [],
      children: []
    };
  };

  extend = function() {
    var obj, objs, prop, target, _i, _len;
    target = arguments[0], objs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objs.length; _i < _len; _i++) {
      obj = objs[_i];
      for (prop in obj) {
        target[prop] = obj[prop];
      }
    }
    return target;
  };

  buildFromDomNode = function(node) {
    var opts;
    opts = {
      attributes: {}
    };
    if (node.nodeType === 3) {
      return new TackText(node.textContent);
    } else if (node.nodeType === 1) {
      each(node.attributes, function(attr) {
        if (attr.name === "class") {
          return opts["class"] = attr.value.split(" ");
        } else {
          return opts.attributes[attr.name] = attr.value;
        }
      });
      opts.tagName = node.tagName.toLowerCase();
      opts.children = map(node.childNodes, function(node) {
        return new Tack(buildFromDomNode(node));
      });
      return opts;
    }
  };

  TackText = (function() {
    function TackText(str) {
      this.text = str;
    }

    TackText.prototype.render = function() {
      return this.text;
    };

    TackText.prototype.toString = function() {
      return this.text;
    };

    return TackText;

  })();

  Tack = (function() {
    function Tack(param) {
      if (typeof param === "string") {
        if (!tags[param]) {
          throw new Error("Invalid tag name.");
        }
        extend(this, defaults(), {
          tagName: param
        });
      } else if (param instanceof Element) {
        extend(this, defaults(), buildFromDomNode(param));
      } else {
        extend(this, defaults(), param);
      }
      if (typeof this["class"] === "string") {
        this["class"] = this["class"].split(" ");
      }
    }

    Tack.prototype.id = function(id) {
      if (id != null) {
        this.attributes.id = id;
        return this;
      } else {
        return this.attributes.id;
      }
    };

    Tack.prototype.attr = function(name, value) {
      if (value != null) {
        this.attributes[name] = value;
        return this;
      } else {
        return this.attributes[name];
      }
    };

    Tack.prototype.removeAttr = function(name) {
      delete this.attributes[name];
      return this;
    };

    Tack.prototype.addClass = function(className) {
      if (__indexOf.call(this["class"], className) < 0) {
        this["class"].push(className);
      }
      return this;
    };

    Tack.prototype.removeClass = function(className) {
      remove(this["class"], className);
      return this;
    };

    Tack.prototype.addChild = function(param) {
      this.children.push(tackMaker(param));
      return this;
    };

    Tack.prototype.removeChildAt = function(index) {
      this.children.splice(index, 1);
      return this;
    };

    Tack.prototype.addText = function(str) {
      return this.children.push(new TackText(str));
    };

    Tack.prototype.render = function() {
      var attr, child, result, str, _i, _len, _ref;
      result = [];
      str = "";
      result.push("<" + this.tagName + " ");
      if (this["class"].length) {
        result.push("class=\"" + (this["class"].join(" ")) + "\" ");
      }
      for (attr in this.attributes) {
        str += "" + attr + "=\"" + this.attributes[attr] + "\" ";
      }
      result.push(str.trim());
      result.push(">");
      if (!selfClosingTags[this.tagName]) {
        if (this.children.length) {
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            result.push(child.render());
          }
        }
        result.push("</" + this.tagName + ">");
      }
      return result.join("");
    };

    Tack.prototype.toString = function() {
      return this.render();
    };

    Tack.prototype.clone = function() {
      return new Tack(this);
    };

    return Tack;

  })();

  tackMaker = function(param) {
    return new Tack(param);
  };

  if (typeof module !== "undefined") {
    module.exports = tackMaker;
  } else {
    window.tackMaker = tackMaker;
  }

}).call(this);
