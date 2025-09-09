// sakura.js - 浏览器全局樱花飘落特效
(function () {
  if (window.__sakura_inited) return;
  window.__sakura_inited = true;
  function getRandom(option, config) {
    let ret, random;
    switch (option) {
      case 'x': ret = Math.random() * window.innerWidth; break;
      case 'y': ret = Math.random() * window.innerHeight; break;
      case 's': ret = config.size.min + Math.random() * (config.size.max - config.size.min); break;
      case 'r': ret = Math.random() * 6; break;
      case 'fnx': random = config.speed.horizontal.min + Math.random() * (config.speed.horizontal.max - config.speed.horizontal.min); ret = function (x, y) { return x + random; }; break;
      case 'fny': random = config.speed.vertical.min + Math.random() * (config.speed.vertical.max - config.speed.vertical.min); ret = function (x, y) { return y + random; }; break;
      case 'fnr': ret = function (r) { return r + config.speed.rotation; }; break;
    }
    return ret;
  }
  function Sakura(x, y, s, r, fn, idx, img, limitArray, config) {
    this.x = x; this.y = y; this.s = s; this.r = r; this.fn = fn; this.idx = idx; this.img = img; this.limitArray = limitArray; this.config = config;
  }
  Sakura.prototype.draw = function (cxt) {
    cxt.save(); cxt.translate(this.x, this.y); cxt.rotate(this.r); cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s); cxt.restore();
  };
  Sakura.prototype.update = function () {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
    this.r = this.fn.r(this.r);
    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
      if (this.limitArray[this.idx] === -1) { this.resetPosition(); }
      else if (this.limitArray[this.idx] > 0) { this.resetPosition(); this.limitArray[this.idx]--; }
    }
  };
  Sakura.prototype.resetPosition = function () {
    this.r = getRandom('fnr', this.config);
    if (Math.random() > 0.4) {
      this.x = getRandom('x', this.config); this.y = 0; this.s = getRandom('s', this.config); this.r = getRandom('r', this.config);
    } else {
      this.x = window.innerWidth; this.y = getRandom('y', this.config); this.s = getRandom('s', this.config); this.r = getRandom('r', this.config);
    }
  };
  function SakuraList() { this.list = []; }
  SakuraList.prototype.push = function (sakura) { this.list.push(sakura); };
  SakuraList.prototype.update = function () { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].update(); } };
  SakuraList.prototype.draw = function (cxt) { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].draw(cxt); } };
  function SakuraManager(config) {
    this.config = config; this.canvas = null; this.ctx = null; this.sakuraList = null; this.animationId = null; this.img = null; this.isRunning = false;
  }
  SakuraManager.prototype.init = function () {
    var self = this;
    if (!self.config.enable || self.isRunning) return;
    self.img = new window.Image();
    self.img.src = '/sakura.png';
    self.img.onload = function () {
      self.createCanvas();
      self.createSakuraList();
      self.startAnimation();
      self.isRunning = true;
    };
  };
  SakuraManager.prototype.createCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.setAttribute('style', 'position: fixed; left: 0; top: 0; pointer-events: none; z-index: ' + this.config.zIndex + ';');
    this.canvas.setAttribute('id', 'canvas_sakura');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', this.handleResize.bind(this));
  };
  SakuraManager.prototype.createSakuraList = function () {
    if (!this.img || !this.ctx) return;
    this.sakuraList = new SakuraList();
    var limitArray = new Array(this.config.sakuraNum).fill(this.config.limitTimes);
    for (var i = 0; i < this.config.sakuraNum; i++) {
      var sakura = new Sakura(
        getRandom('x', this.config),
        getRandom('y', this.config),
        getRandom('s', this.config),
        getRandom('r', this.config),
        { x: getRandom('fnx', this.config), y: getRandom('fny', this.config), r: getRandom('fnr', this.config) },
        i, this.img, limitArray, this.config
      );
      sakura.draw(this.ctx);
      this.sakuraList.push(sakura);
    }
  };
  SakuraManager.prototype.startAnimation = function () {
    if (!this.ctx || !this.canvas || !this.sakuraList) return;
    var self = this;
    function animate() {
      if (!self.ctx || !self.canvas || !self.sakuraList) return;
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.sakuraList.update();
      self.sakuraList.draw(self.ctx);
      self.animationId = requestAnimationFrame(animate);
    }
    self.animationId = requestAnimationFrame(animate);
  };
  SakuraManager.prototype.handleResize = function () {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  };
  // 全局初始化
  window.initSakura = function (config) {
    if (!window.__sakuraManager) {
      window.__sakuraManager = new SakuraManager(config);
      window.__sakuraManager.init();
    } else {
      window.__sakuraManager.config = config;
      window.__sakuraManager.init();
    }
  };
})();
