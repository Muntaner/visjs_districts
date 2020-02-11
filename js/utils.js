randomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

setRGBAColorAlpha = (startingColor, targetAlpha) => {
    let c = startingColor
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(startingColor)) {
        c = startingColor.substring(1).split('')
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = `0x${c.join('')}`
        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${targetAlpha})`
    } else return c
}