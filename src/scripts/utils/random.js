const getRandomInt = (min, max) => {
    const minimum = Math.ceil(min);
    const maximum = Math.floor(max);

    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

export default function randIntException(min, max, exp) {
    let randomNumber;

    if(!Array.isArray(exp)) {
        randomNumber = getRandomInt(min, max);
        return randomNumber;
    }

    do {
        randomNumber = getRandomInt(min, max);
    } while ((exp || []).includes(randomNumber));

    return randomNumber;
}