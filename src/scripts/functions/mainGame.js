import {_, isObject} from '@/scripts/utils/helper'
import flag from '@/assets/images/flag.svg'

function openItem(item, value, {x, y}) {
    const backItem = _(this.$game_back).querySelectorXY(x, y)

    backItem.textContent = value ? value : ''
    if (value) _(backItem).addClass(`num_${value}`)

    _(item).addClass('hide')
    setTimeout(() => _(item).rAttr('data-fill'), 300)
}
function openSquare(x, y) {
    const emptyList = []

    const addToEmpty = (_x, _y) => {
        const [double] = emptyList.filter(({x: $x, y: $y}) => $x === _x && $y === _y)
        if (!isObject(double)) emptyList.push({x: _x, y: _y})
        const square = [
            [_x - 1, _y - 1], [_x, _y - 1], [_x + 1, _y - 1],
            [_x - 1, _y], [_x + 1, _y],
            [_x - 1, _y + 1], [_x, _y + 1], [_x + 1, _y + 1]
        ]

        square.map(([xC, yC]) => {
            if (this.field[yC] !== undefined) {
                if (this.field[yC][xC] !== undefined) {
                    const [double] = emptyList.filter(({x: $x, y: $y}) => $x === xC && $y === yC)
                    if (isObject(double)) return

                    if (this.field[yC][xC] === 0) {
                        emptyList.push({x: xC, y: yC})
                        addToEmpty(xC, yC)
                    } else emptyList.push({x: xC, y: yC})
                }
            }
        })
    }
    addToEmpty(x, y)

    emptyList.map(coord => {
        const $item = _(this.$game_front).querySelectorXY(coord.x, coord.y)
        openItem.call(this, $item, this.field[coord.y][coord.x], {x: coord.x, y: coord.y})
    })
}
function endGame(x, y) {
    console.log("BANG!!!")
}

function gameEvents() {
    this.$game_front.addEventListener('click', e => {
        const target = e.target.closest('[data-fill]')

        if (target) {
            if (target.dataset.close !== undefined) return
            const {x, y} = target.dataset
            const value = this.field[y][x]

            switch (value) {
                case '*':
                    endGame.call(this, +x, +y)
                    break
                case 0:
                    openSquare.call(this, +x, +y)
                    break
                default:
                    openItem.call(this, target, value, {x, y})
                    break
            }
        }
    })
    this.$game_front.addEventListener('contextmenu', e => {
        e.preventDefault()
        const target = e.target.closest('[data-fill]')

        if (target) {
            if (target.dataset.close !== undefined) {
                _(target).rAttr('data-close').html()
                this.watch.bomb++
            } else {
                this.watch.bomb--
                target.dataset.close = ''
                _(target).html(`<img src="${flag}" alt="" />`)
            }
        }
    })
}

export default function gameInit(_this) {
    gameEvents.call(_this)
}