function getRandomNumber(): number {
    return Math.floor(Math.random() * 1000) + 1;
}

const randomNumber = getRandomNumber();
console.log(`Random number: ${randomNumber}`);

export default getRandomNumber;
