let randomString = generateRandomString();

function generateRandomString() {
  const stringArray = ['Ram', 'Shyam', 'Om','Ganesh','Hanuman','Krishna'];
  let randomString = "";

  while (randomString.length < 10) {
    const randomIndex = Math.floor(Math.random() * stringArray.length);
    const randomStringElement = stringArray[randomIndex];

    // Ensure at least three characters are added from each element
    let charactersToAdd = Math.max(3, Math.floor(Math.random() * randomStringElement.length));

    for (let i = 0; i < charactersToAdd; i++) {
      randomString += randomStringElement[Math.floor(Math.random() * randomStringElement.length)];
    }
  }

  return randomString.toLowerCase();
}

module.exports = randomString;

