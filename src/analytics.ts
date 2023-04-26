import * as $ from 'jquery'

function createAnalytics() { // : object
    let counter = 0
    let isDestroyed = false // : boolean

    const listener = () => counter++ // : number
    $(document).on('click', listener)

    return {
        destroy() {
            $(document).off('click', listener)
            isDestroyed = true
        },
        getClicks() {
            if(isDestroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}` 
            }
            return counter
        }
    }
}

window['analytics'] = createAnalytics()
