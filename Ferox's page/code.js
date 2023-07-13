// A string containing all possible characters to be used in the text animation
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

document.addEventListener('DOMContentLoaded', () => {
  
  // Function to animate the text of an HTML element
  const animateText = (elementID, intervalTime, finalText) => {
    
    // Get the HTML element
    const element = document.querySelector(elementID);

    // Generate a completely random string of the same length as the final text
    let originalText = Array(finalText.length).fill(null)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");

    // Initialize variables to control the animation
    let iterations = 0;
    let animationText = "";

    // Set the text color to red
    element.style.color = "orange";

    // Start a repeating interval that runs the anonymous function every 'intervalTime' milliseconds
    const interval = setInterval(() => {

      // Convert the original text to an array, process each character of it, then join the processed characters back to a string
      animationText = finalText.split("")
        .map((letter, index) => {

          // For each character, if its index is less than the current iteration count, return the original character, otherwise return a random character from 'letters'
          if(index < iterations) {
            return finalText[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      // If the iterations have reached the length of the original text, clear the interval to stop the animation and display the final text
      if(iterations >= originalText.length) {
        clearInterval(interval);
        element.innerText = finalText;
        element.dataset.value = finalText;
        // Change the text color to green when the animation is finished
        element.style.color = "#2FD104";
      }

      // Increment the iterations count by one-third at each run
      iterations += 1 / 3;
      
      // Update the text content of the HTML element with the animated text
      element.innerText = animationText;

    // Set the interval time
    }, intervalTime);
  }

  // Call the 'animateText' function to animate the 'welcome-text' element when the page loads
  animateText("#welcome-text", 30, "Welcome!");

  // Generate random footer text when the page loads and set it
  const footerTextElement = document.querySelector("#footer-text");
  const randomFooterText = Array(30).fill(null)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");

  // Set the text color to red
  footerTextElement.style.color = "red";

  footerTextElement.dataset.value = randomFooterText;
  footerTextElement.innerText = randomFooterText;

  // Attach a 'mouseover' event listener to the 'footer-text' element
  footerTextElement.addEventListener("mouseover", (event) => {

    // When the mouse hovers over the 'footer-text' element, if it doesn't already have the 'decrypted' class, animate its text and add the 'decrypted' class to it
    if (!event.target.classList.contains('decrypted')) {
      const randomWords = ["Furry", "Programmer", "Student", "Argentinian"];
      const finalFooterText = "Ferox Shark | Sharkjuangranero@gmail.com | " + randomWords[Math.floor(Math.random() * randomWords.length)];
      animateText("#footer-text", 5, finalFooterText);
      event.target.classList.add('decrypted');
    }
  });
});
