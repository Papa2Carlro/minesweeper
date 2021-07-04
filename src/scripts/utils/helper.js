export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

export function _(el) {
    return {
        querySelectorJs(selector) {
            return el.querySelector(`[data-js="${selector}"]`)
        },
        querySelectorXY(x, y) {
            return el.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        },
        addClass(className) {
            if (Array.isArray(className)) {
                className.map(item => el.classList.add(item))
                return _(el)
            }
            el.classList.add(className)
            return _(el)
        },
        removeClass(className) {
            el.classList.remove(className)
            return _(el)
        },
        css(styles = {}) {
            Object.assign(el.style, styles)
        },
        has(className) {
            return el.classList.contains(className)
        },
        attr(attr, val) {
            el.setAttribute(attr, val)
            return _(el)
        },
        rAttr(attr) {
            el.removeAttribute(attr)
            return _(el)
        },
        html(html) {
            el.innerHTML = html ?? ''
            return _(el)
        },
        data(data, value) {
            if (value) {
                el.dataset[data] = value
                return _(el)
            }
            return el.dataset[data]
        },
        get text() {
            return el.textContent
        },
        set class(className) {
            el.className = className
        }
    }
}

export function wait(s) {
    return new Promise((res) => setTimeout(res, s * 1000));
}

export function toBase64(file, callback) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => callback(null, reader.result)
    reader.onerror = error => callback(error, null)
}

export function toText(str) {
    return str.split('_').map(word => word.split('').map((later, i) => {
        if(i === 0) return later.toUpperCase()
        return later
    }).join('')).join(' ')
}

export function isObject(target) {
    return (
        target !== null &&
        typeof target === 'object' &&
        // eslint-disable-next-line no-prototype-builtins
        !target.hasOwnProperty('length')
    );
}