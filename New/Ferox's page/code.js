const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!";

document.addEventListener('DOMContentLoaded', () => {
  const animateText = (elementID) => {
    const element = document.querySelector(elementID);
    const originalText = element.dataset.value;
    let iterations = 0;
    let animationText = "";

    const interval = setInterval(() => {
      animationText = originalText.split("")
        .map((letter, index) => {
          if(index < iterations) {
              return originalText[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if(iterations >= originalText.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
      element.innerText = animationText;
    }, 30);
  }

  // Animate welcome text on page load
  animateText("#welcome-text");

  // Animate footer text on mouseover
  document.querySelector("#footer-text").addEventListener("mouseover", (event) => {
    if (!event.target.classList.contains('decrypted')) {
      animateText("#footer-text");
      event.target.classList.add('decrypted');
    }
  });
});
