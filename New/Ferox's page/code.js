// A string containing all possible characters to be used in the text animation
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!";

document.addEventListener('DOMContentLoaded', () => {
  
  // Function to animate the text of an HTML element
  const animateText = (elementID) => {
    
    // Get the HTML element and its original text
    const element = document.querySelector(elementID);
    const originalText = element.dataset.value;
    
    // Initialize variables to control the animation
    let iterations = 0;
    let animationText = "";

    // Start a repeating interval that runs the anonymous function every 30 milliseconds
    const interval = setInterval(() => {

      // Convert the original text to an array, process each character of it, then join the processed characters back to a string
      animationText = originalText.split("")
        .map((letter, index) => {

          // For each character, if its index is less than the current iteration count, return the original character, otherwise return a random character from 'letters'
          if(index < iterations) {
            return originalText[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      // If the iterations have reached the length of the original text, clear the interval to stop the animation
      if(iterations >= originalText.length) {
        clearInterval(interval);
      }

      // Increment the iterations count by one-third at each run
      iterations += 1 / 3;
      
      // Update the text content of the HTML element with the animated text
      element.innerText = animationText;

    // Set the interval time (30 milliseconds)
    }, 30);
  }

  // Call the 'animateText' function to animate the 'welcome-text' element when the page loads
  animateText("#welcome-text");

  // Attach a 'mouseover' event listener to the 'footer-text' element
  document.querySelector("#footer-text").addEventListener("mouseover", (event) => {

    // When the mouse hovers over the 'footer-text' element, if it doesn't already have the 'decrypted' class, animate its text and add the 'decrypted' class to it
    if (!event.target.classList.contains('decrypted')) {
      animateText("#footer-text");
      event.target.classList.add('decrypted');
    }
  });
});
