import generateFields from "@/scripts/functions/generateFields"
import gameInit from "@/scripts/functions/mainGame"
// Helper
import {_} from "@/scripts/utils/helper"
import flag from '@/assets/images/flag.svg'
import win from '@/assets/images/win.svg'
import refresh from '@/assets/images/refresh.svg'

export default class Game {
    constructor(root) {
        this.$root = document.body.querySelector(root)

        this.field = []
        this.TYPES = [
            {label: 'Ease', col: 10, row: 8, size: 45, fonts: 32},
            {label: 'Medium', col: 18, row: 14, size: 40, fonts: 29},
            {label: 'Hard', col: 24, row: 20, size: 35, fonts: 26, openZero: true, prompt: 2},
            {label: 'Super Hard', col: 40, row: 26, size: 25, fonts: 21, openZero: true, prompt: 5},
            {label: 'You Die!', col: 70, row: 35, size: 20, fonts: 18, openZero: true, prompt: 10},
        ]
        this.END_GAME = false

        const _this = this
        this.watch = new Proxy({complexity: 0, PROMP: false}, {
            set(...arg) {
                const result = Reflect.set(...arg) // eslint-disable-next-line no-unused-vars
                const [__, variable, value] = arg

                switch (variable) {
                    case 'complexity':
                        generateFields(_this)
                        _(_this.$win).removeClass('open')
                        _(_this.$again).removeClass('open')
                        break
                    case 'bomb':
                        _this.$bomb.textContent = value
                        break
                    case 'promp':
                        _this.$promt.textContent = value

                        if (!value) _(_this.$promtWrapper).css({display: 'none'})
                        else _(_this.$promtWrapper).css({display: 'block'})
                        break
                    case 'PROMP':
                        _(_this.$game)[`${value ? 'add' : 'remove'}Class`]('promp')
                        _this.$promtBtn.textContent = value ? 'Cancel' : 'Use'
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
        this.$record = _(this.$root).querySelectorJs('record')

        this.$promt = _(this.$root).querySelectorJs('promt')
        this.$promtBtn = _(this.$root).querySelectorJs('promt_use')
        this.$promtWrapper = _(this.$root).querySelectorJs('promt_wrapper')

        this.$again = _(this.$root).querySelectorJs('again')
        this.$win = _(this.$root).querySelectorJs('win')

        this.init()
    }

    init() {
        gameInit(this)
        generateFields(this)

        this.events()
    }

    events() {
        this.$complexity.addEventListener('change', e => this.watch.complexity = parseInt(e.target.value))

        _(this.$win).querySelectorJs('refresh').addEventListener('click', () => {
            generateFields(this)
            this.END_GAME = false
            _(this.$win).removeClass('open')
        })
        _(this.$again).querySelectorJs('refresh').addEventListener('click', () => {
            generateFields(this)
            this.END_GAME = false
            _(this.$again).removeClass('open')
        })

        this.$promtBtn.addEventListener('click', () => this.watch.PROMP = !this.watch.PROMP)
    }

    layout() {
        _(this.$root).addClass('app')
        _(this.$root).html(`
            <div data-js="win" class="app__again">
                <div data-js="refresh" class="app__again-body">
                    <img src="${refresh}" alt="">
                    <span>Play again!</span>
                </div>
            </div>
            <div data-js="again" class="app__again">
                <div data-js="refresh" class="app__again-body">
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
                    <div data-js="record">
                        <img src=${win} alt="">
                        <span></span>
                    </div>
                </div>
                <div class="app__header-more">
                    <div data-js="promt_wrapper">
                        Prompt: <span data-js="promt"></span> <button data-js="promt_use">Use</button>
                    </div>
                </div>
            </header>
            <main data-js="game" class="game">
                <ul data-js="game_back" class="game__back"></ul>
                <ul data-js="game_front" class="game__front"></ul>
            </main>`)
    }
}