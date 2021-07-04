import {_} from '@/scripts/utils/helper'

function generateField() {
    const list = []
    const bomb = []
    let complexity = null
    let colBomb = 0

    switch (this.watch.complexity) {
        case 0:
            complexity = .44
            break
        case 1:
            complexity = .28
            break
        case 2:
            complexity = .4
            break
    }
    const chance = chance => Math.random() - complexity > chance ? '*' : null
    const value = (x, y) => {
        if (list[y]) return list[y][x] === '*'
    }

    for (let i = 0; i < this.TYPES[this.watch.complexity].row; i++) {
        list[i] = []
        for (let j = 0; j < this.TYPES[this.watch.complexity].col; j++) {
            const isBomb = chance(Math.random())
            if (isBomb === '*') {
                bomb.push({x: j, y: i})
                colBomb++
            }
            list[i][j] = isBomb
        }
    }

    list.map((row, iY) => {
        row.map((val, iX) => {
            let counter = 0
            if (val === '*') return

            const square = [
                [iX - 1, iY - 1], [iX, iY - 1], [iX + 1, iY - 1],
                [iX - 1, iY],                   [iX + 1, iY],
                [iX - 1, iY + 1], [iX, iY + 1], [iX + 1, iY + 1]
            ]

            square.map(([x, y]) => value(x, y) ? counter++ : '')
            list[iY][iX] = counter
        })
    })

    this.watch.bomb = colBomb

    return list
}
function generateLayout() {
    this.$game.style = `--col: ${this.TYPES[this.watch.complexity].col}; 
                        --row: ${this.TYPES[this.watch.complexity].row}; 
                        --size: ${this.TYPES[this.watch.complexity].size}px;
                        --fonts: ${this.TYPES[this.watch.complexity].fonts}px`

    this.field.map((row, iY) => {
        row.map((__, iX) => {
            const list = ['back', 'front']

            list.map(str => {
                const li = document.createElement('li')
                li.dataset.x = iX
                li.dataset.y = iY
                _(li).addClass('game__item')

                if (str === 'front') li.dataset.fill = ''

                if (iY % 2 === 0) _(li).addClass(iX % 2 === 0 ? 'odd' : 'even')
                else _(li).addClass(iX % 2 !== 0 ? 'odd' : 'even')

                this[`$game_${str}`].append(li)
            })
        })
    })
}

export default function(_this) {
    const list = ['back', 'front']
    list.map(str => _(_this[`$game_${str}`]).html())

    _this.field = generateField.call(_this)
    console.log(_this.field)
    generateLayout.call(_this)
}