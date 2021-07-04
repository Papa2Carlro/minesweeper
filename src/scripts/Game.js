import generateFields from "@/scripts/functions/generateFields"
import gameInit from "@/scripts/functions/mainGame"
// Helper
import {_} from "@/scripts/utils/helper"
import flag from '@/assets/images/flag.svg'
import refresh from '@/assets/images/refresh.svg'

export default class Game {
    constructor(root) {
        this.$root = document.body.querySelector(root)

        this.field = []
        this.TYPES = [
            {label: 'Ease', col: 10, row: 8, size: 45, fonts: 26},
            {label: 'Medium', col: 18, row: 14, size: 40, fonts: 24},
            {label: 'Hard', col: 24, row: 20, size: 35, fonts: 22}
        ]

        const _this = this
        this.watch = new Proxy({complexity: 0}, {
            set(...arg) {
                const result = Reflect.set(...arg)
                // eslint-disable-next-line no-unused-vars
                const [__, variable, value] = arg

                switch (variable) {
                    case 'complexity':
                        generateFields(_this)
                        break
                    case 'bomb':
                        _this.$bomb.textContent = value
                        break
                }
                return result
            }
        })
        this.layout()

        this.$game = _(this.$root).querySelectorJs('game')
        this.$complexity = _(this.$root).querySelectorJs('complexity')
        this.$game_back = _(this.$game).querySelectorJs('game_back')
        this.$game_front = _(this.$game).querySelectorJs('game_front')

        this.$bomb = _(this.$root).querySelectorJs('bomb')

        this.init()
    }

    init() {
        console.log(this)
        generateFields(this)
        gameInit(this)

        this.events()
    }

    events() {
        this.$complexity.addEventListener('change', e => this.watch.complexity = parseInt(e.target.value))
    }

    layout() {
        _(this.$root).addClass('app')
        _(this.$root).html(`
            <div data-js="win" class="app__again">
                <div class="app__again-body">
                    <img src="${refresh}" alt="">
                    <span>Play again!</span>
                </div>
            </div>
            <div data-js="again" class="app__again">
                <div class="app__again-body">
                    <img src="${refresh}" alt="">
                    <span>Try again!</span>
                </div>
            </div>

            <header class="app__header">
                <select data-js="complexity" class="app__header-select">
                    ${this.TYPES.map(({label}, i) => `
                        <option value="${i}" ${this.watch.complexity === i ? 'selected' : ''}>${label}</option> `).join('\n')}
                </select>
                <div class="app__header-info">
                    <div class="app__header-item">
                        <img src="${flag}" alt="">
                        <span data-js="bomb"></span>
                    </div>
                </div>
                <div></div>
            </header>
            <main data-js="game" class="game">
                <ul data-js="game_back" class="game__back"></ul>
                <ul data-js="game_front" class="game__front"></ul>
            </main>`)
    }
}