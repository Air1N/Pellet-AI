let ue = {};

let physicsObjects = [];
let textObjects = [];
let killBuffer = [];

ue.kill = function(obj) {
    killBuffer.push(obj);
};

ue.clamp = function(a, b, c) {
    return Math.max(b, Math.min(a, c));
};

ue.text = function(t, x, y, s, b, c, vx, vy, f) {
    this.text = t;
    this.x = x;
    this.y = y;
    this.font = s;
    this.border = b;
    this.color = c;
    this.vx = vx;
    this.vy = vy;
    this.fade = f;
    this.timer = 100;

    textObjects.push(this);
};

ue.abs = function(x) {
    return (x ^ (x >> 31)) - (x >> 31);
};

ue.tanh = function(x) {
    if (x < -3)
        return -1;
    else if (x > 3)
        return 1;
    else
        return x * (27 + x * x) / (27 + 9 * x * x);
};

ue.round = function(x) {
    return ((((var1 / var2) + 0.5) << 1) >> 1) * var2;
};

ue.sprite = function(inp, x, y, w, h, img, animated, f, fps) {
    inp.sprite = new Image();
    inp.sprite.x = x;
    inp.sprite.y = y;
    inp.sprite.width = w;
    inp.sprite.height = h;
    inp.sprite.rotation = 0;
    animated = animated || false;
    inp.sprite.frame = 0;

    if (animated) {
        f = f || 3;
        fps = fps || 10;
        inp.sprite.frames = f;
        inp.sprite.fps = fps;
    }

    inp.sprite.src = img;
    inp.sprite.animated = animated;

    inp.sprite.animate = function() {
        if (inp.sprite.frame < inp.sprite.frames - 1) {
            inp.sprite.frame++;
        } else {
            inp.sprite.frame = 0;
        }
    };

    setInterval(inp.sprite.animate, 1000 / inp.sprite.fps);
};

ue.object = function(x, y, w, h, n, img, he, at, animated, sw, sh, f, fps) {
    n = n || "object";
    this.name = n;

    this.health = he;
    this.attack = at;

    img = img || null;
    animated = animated || false;
    if (img !== null) {
        if (animated) {
            new ue.sprite(this, x, y, sw, sh, img, animated, f, fps);
        } else {
            new ue.sprite(this, x, y, w, h, img);
        }
    }

    this.body = {};
    this.hasMoved = false;

    this.body.visible = true;

    this.body.hasGravity = true;

    this.body.x = x;
    this.body.y = y;

    this.body.lx = x;
    this.body.ly = y;

    this.body.width = w;
    this.body.height = h;

    this.body.velocity = {};

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    this.body.velocity.lx = 0;
    this.body.velocity.ly = 0;

    this.body.colliding = {
        top: [],
        bottom: [],
        left: [],
        right: [],
        overlap: []
    };

    this.body.mass = (this.body.width * this.body.height);

    this.body.velocity.damper = {
        x: 0.1,
        y: 0.1
    };

    this.body.solid = true;
    this.color = null;

    this.notoverlap = function(obj) {
        if (obj == this || this.body.x >= obj.body.x + obj.body.width || this.body.x + this.body.width <= obj.body.x || this.body.y >= obj.body.y + obj.body.height || this.body.y + this.body.height <= obj.body.y) {
            return true;
        }

        return false;
    };


    this.overlap = function(obj) {
        if (obj == this || this.body.x >= obj.body.x + obj.body.width || this.body.x + this.body.width <= obj.body.x || this.body.y >= obj.body.y + obj.body.height || this.body.y + this.body.height <= obj.body.y) {
            return false;
        }

        if (obj != this && this.body.ly + this.body.height <= obj.body.y && this.body.y + this.body.height >= obj.body.y && this.body.x < obj.body.x + obj.body.width && this.body.x + this.body.width > obj.body.x) {
            return true;
        }

        if (obj != this && this.body.ly >= obj.body.y + obj.body.height && this.body.y <= obj.body.y + obj.body.height && this.body.x < obj.body.x + obj.body.width && this.body.x + this.body.width > obj.body.x) {
            return true;
        }

        if (obj != this && this.body.lx + this.body.width <= obj.body.x && this.body.x + this.body.width >= obj.body.x && this.body.y < obj.body.y + obj.body.height && this.body.y + this.body.height > obj.body.y) {
            return true;
        }

        if (obj != this && this.body.lx >= obj.body.x + obj.body.width && this.body.x <= obj.body.x + obj.body.width && this.body.y < obj.body.y + obj.body.height && this.body.y + this.body.height > obj.body.y) {
            return true;
        }

        return true;
    };

    this.collidingtop = function(obj) {
        if (obj != this && this.body.ly + this.body.height <= obj.body.y && this.body.y + this.body.height >= obj.body.y && this.body.x < obj.body.x + obj.body.width && this.body.x + this.body.width > obj.body.x) {
            return true;
        }

        return false;
    };

    this.collidingbottom = function(obj) {
        if (obj != this && this.body.ly >= obj.body.y + obj.body.height && this.body.y <= obj.body.y + obj.body.height && this.body.x < obj.body.x + obj.body.width && this.body.x + this.body.width > obj.body.x) {
            return true;
        }

        return false;
    };

    this.collidingleft = function(obj) {
        if (obj != this && this.body.lx + this.body.width <= obj.body.x && this.body.x + this.body.width >= obj.body.x && this.body.y < obj.body.y + obj.body.height && this.body.y + this.body.height > obj.body.y) {
            return true;
        }

        return false;
    };

    this.collidingright = function(obj) {
        if (obj != this && this.body.lx >= obj.body.x + obj.body.width && this.body.x <= obj.body.x + obj.body.width && this.body.y < obj.body.y + obj.body.height && this.body.y + this.body.height > obj.body.y) {
            return true;
        }

        return false;
    };

    physicsObjects.push(this);
};


ue.explosion = function(x, y, n, s, p, c, a, d, g) {
    n = n || 20;
    s = s || 20;
    p = p || 5;
    c = c || "#ffffff";
    a = a || 0;
    d = d / 2 || 360 / 2;
    g = g || true;


    for (let i = 0; i < n; i++) {
        let size = s * Math.random();
        let explosionbit = new ue.object(x, y, size, size, "explosion");
        explosionbit.body.solid = false;
        explosionbit.color = c;

        let rp = (0.25 + Math.random() * 0.75) * p;
        let rd = (Math.random() * 2 - 1) * d;
        let px = Math.sin(rd + a);
        let py = Math.cos(rd + a);

        if (g) {
            explosionbit.body.hasGravity = true;
            explosionbit.body.velocity.x = rp * px;
            explosionbit.body.velocity.y = -rp * py;
        } else {
            explosionbit.body.hasGravity = false;
            explosionbit.body.velocity.x = rp * px;
            explosionbit.body.velocity.y = -rp * py;
        }
    }
}

ue.viewport = function(x, y, w, h, f, dr, d2) {
    this.par = f || null;
    this.base = dr;
    this.drawTo = d2;

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.velocity = {
        x: 0,
        y: 0
    };

    this.draw = function() {
        this.drawTo.getContext('2d')
            .drawImage(display, this.x, this.y, this.width, this.height, 0, 0, this.drawTo.width, this.drawTo.height);
    }

    this.followPar = function(t) {
        if (t.par !== null) {
            t.velocity.x = ((t.par.body.x - t.width / 2 + t.par.body.width / 2) - t.x) / 50;
            t.x += t.velocity.x;

            t.velocity.y = ((t.par.body.y - t.height / 2 + t.par.body.height / 2) - t.y) / 50;
            t.y += t.velocity.y;
        }
    }

    this.screenshake = function(h, v, time, times) {
        this.shake.time = time;
        this.shake.timer = time;
        this.shake.times = times;

        this.shake.h = h;
        this.shake.v = v;
    };

    this.shake = {};

    this.shake.timer = 0;
    this.shake.time = 0;

    this.sctiming = function(t) {
        if (t.shake.timer > 0) {
            t.shake.timer--;

            if (t.shake.timer < t.shake.time * (1 / 4)) {
                t.x -= t.shake.h / t.shake.time;
            } else if (t.shake.timer < t.shake.time * (2 / 4)) {
                t.y -= t.shake.v / t.shake.time;
            } else if (t.shake.timer < t.shake.time * (3 / 4)) {
                t.y += t.shake.v / t.shake.time;
            } else if (t.shake.timer < t.shake.time * (4 / 4)) {
                t.x += t.shake.h / t.shake.time;
            }
        } else {
            t.shake.times--;

            if (t.shake.times > 0) {
                t.shake.timer = t.shake.time;
            }
        }
    }

    setInterval(this.followPar, 1000 / 100, this);
    setInterval(this.sctiming, 1000 / 100, this);
}