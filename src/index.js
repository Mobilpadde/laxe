window.laxe = {};
window.laxe.helpers = {
    findOffset: function findOffset(e) {
        let x = 0;
        let y = 0;

        const p = e.offsetParent;
        if (p != null && p !== 'body') {
            const o = window.laxe.helpers.findOffset(p);

            x += o.x;
            y += o.y;
        }

        x += e.offsetLeft;
        y += e.offsetTop;

        return { x, y };
    }
}

window.Laxe = (function Laxe() {
    const o = {
        speed: 1,
        axis: 'y',
    } 

    let elms = [];
    let plugins = [];
    const preSetup = () => {
        elms = elms.map(elm => {
            const s = Object.keys(o).reduce((acc, k) => {
                acc[k] = o[k];

                if (elm.dataset.hasOwnProperty(k)) {
                    acc[k] = elm.dataset[k];
                    
                    if (typeof o[k] == 'number') {
                        acc[k] = parseFloat(acc[k])
                    }
                }

                return acc;
            }, {});

            s['_p'] = laxe.helpers.findOffset(elm);

            return { e: elm, s };
        });
        
        let ret = true;
        plugins.forEach(p => {
            ret = p.setup(elms);
        });

        return ret;

    }

    const setup = () => {
        elms.forEach(e => {
            e.e.style.position = 'fixed';
            e.e.style.top = `${e.s._p.y}px`;
            e.e.style.left = `${e.s._p.x}px`;
        });
    }

    const move = (e) => {
        let doMove = true;
        const y = e.deltaY;
        plugins.forEach(p => doMove = p.move(y));

        if (doMove) {
            elms.forEach(elm => {
                const a = elm.s.axis;

                if (['x', 'y'].indexOf(a) > -1) {
                    elm.s._p[a] += y;

                    elm.e.style[a === 'y' ? 'top' : 'left'] = `${elm.s._p[a] * elm.s.speed}px`;
                } else {
                    elm.s._p.x += y;
                    elm.s._p.y += y;

                    elm.e.style.left = `${elm.s._p.x * elm.s.speed}px`;
                    elm.e.style.top = `${elm.s._p.y * elm.s.speed}px`;
                }
            });
        }
    }

    const touch = {};
    const touchStart = (e) => touch.deltaY = e.touches[0].screenY;
    const touchEnd = (e) => {
        touch.deltaY -= e.changedTouches[0].screenY;
        move(touch);
    }

    return function Laxe(thing, p) {
        if (['.', '#'].indexOf(thing[0]) > -1) {
            elms = [...document.querySelectorAll(thing)];
            plugins = p || [];

            if (preSetup(plugins)) {
                setup();
            }

            window.addEventListener('mousewheel', move);
            window.addEventListener('touchstart', touchStart);
            window.addEventListener('touchend', touchEnd);
        } else {
            throw new Error('Please provide either a class or id using the corrsponding specifier')
        }

        return {
            destroy: () => {
                window.addEventListener('mousewheel', move);
                window.addEventListener('touchstart', touchStart);
                window.addEventListener('touchend', touchEnd);
            }
        } 
    }
}());
