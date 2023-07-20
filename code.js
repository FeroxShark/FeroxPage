const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

document.addEventListener('DOMContentLoaded', () => {
    const animateText = (elementID, intervalTime, finalText) => {
        const element = document.querySelector(elementID);
        let originalText = Array(finalText.length).fill(null)
            .map(() => letters[Math.floor(Math.random() * letters.length)])
            .join("");
        let iterations = 0;
        let animationText = "";
        element.style.color = "orange";
        const interval = setInterval(() => {
            animationText = finalText.split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return finalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            if(iterations >= originalText.length) {
                clearInterval(interval);
                element.innerText = finalText;
                element.dataset.value = finalText;
                element.style.color = "#2FD104";
            }
            iterations += 1 / 3;
            element.innerText = animationText;
        }, intervalTime);
    }

    animateText("#welcome-text", 30, "Welcome!");

    const footerTextElement = document.querySelector("#footer-text");
    const randomFooterText = Array(30).fill(null)
        .map(() => letters[Math.floor(Math.random() * letters.length)])
        .join("");
    footerTextElement.style.color = "red";
    footerTextElement.dataset.value = randomFooterText;
    footerTextElement.innerText = randomFooterText;

    footerTextElement.addEventListener("mouseover", (event) => {
        if (!event.target.classList.contains('decrypted')) {
            const randomWords = ["Furry", "Programmer", "Student", "Argentinian"];
            const finalFooterText = "Ferox Shark | Sharkjuangranero@gmail.com | " + randomWords[Math.floor(Math.random() * randomWords.length)];
            animateText("#footer-text", 5, finalFooterText);
            event.target.classList.add('decrypted');
        }
    });

    function success(pos) {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        weather(latitude, longitude);
    }

    function error() {
        console.log('No se pudo obtener tu ubicación');
    }

    function weather(latitude, longitude) {
        let apiKey = '75925d4185de598e1d4b49aa86decb9c';
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let tempC = Math.round(data.main.temp);
                let tempF = Math.round((tempC * 9/5) + 32);
                document.getElementById('location').innerHTML = `${data.name}, ${data.sys.country}`;
                document.getElementById('temp').innerHTML = `${tempC}°C | ${tempF}°F <i id="weather-icon" class="wi wi-owm-${data.weather[0].id}"></i>`;
            })
            .catch(error => {
                console.log('There was an error fetching the weather data: ', error);    
            });
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function sendMessage() {
      var message = document.getElementById('chat-input').value;
      var chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML += '<div><strong>User:</strong> ' + message + '</div>';
      // Clear the input field
      document.getElementById('chat-input').value = '';
    
      // Fetch the AI response
      fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              message: message
          })
      })
      .then(response => response.json())
      .then(data => {
          chatMessages.innerHTML += '<div><strong>SharkAI:</strong> ' + data.response + '</div>';
      });
    }
    
    document.getElementById('chat-submit').addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the form from submitting normally
      sendMessage();
    });
    
    document.getElementById('chat-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the form from submitting normally
          sendMessage();
      }
    });
});
