const startListeningButton = document.getElementById("start-listening");
const assistantOutput = document.getElementById("assistant-output");
const voiceSelect = document.getElementById("voice-select");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis;

recognition.continuous = false;
recognition.lang = 'en-US';

const jokes = [
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "What do you call fake spaghetti? An impasta!",
    "Why couldn't the bicycle stand up by itself? It was two tired!"
];

const quotes = [
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Your limitation—it’s only your imagination."
];

const facts = [
    "Did you know? Honey never spoils.",
    "Did you know? A day on Venus is longer than a year on Venus.",
    "Did you know? There are more stars in the universe than grains of sand on Earth."
];

const currencyRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    NGN: 410
};

const weatherReports = {
    "clear": "It's a clear day with plenty of sunshine.",
    "rain": "It's raining outside. Don't forget your umbrella!",
    "cloudy": "It's a bit cloudy today but no rain expected.",
    "snow": "It's snowing outside. Stay warm!"
};

const newsHeadlines = [
    "Global markets show signs of recovery.",
    "New tech innovations are changing the landscape.",
    "Health experts urge vaccination as flu season approaches."
];

const motivationalMessages = [
    "Keep pushing forward; success is just around the corner.",
    "Your only limit is you. Be brave and fearless.",
    "Dream big and dare to fail."
];

let femaleVoice = null;
let tasks = [];

function loadVoices() {
    const voices = synth.getVoices();
    femaleVoice = voices.find(voice => voice.name.toLowerCase().includes("female")) || voices[0];

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });

    voiceSelect.addEventListener('change', () => {
        femaleVoice = voices.find(voice => voice.name === voiceSelect.value) || voices[0];
    });
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.voice = femaleVoice;
    synth.speak(utterance);
    assistantOutput.innerHTML = text;
}

window.addEventListener('load', loadVoices);

startListeningButton.addEventListener("click", () => {
    assistantOutput.innerHTML = "Listening for your command...";
    recognition.start();
});

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    assistantOutput.innerHTML = `You said: ${transcript}`;
    processCommand(transcript);
};

function processCommand(command) {
    if (command.includes("who are you")) {
        speak("I am AdamsAI, your virtual assistant created by my boss, Adams Abubakry Siddique.");
    } 
    else if (command.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com", "_blank");
    } 
    else if (command.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://web.whatsapp.com", "_blank");
    } 
    else if (command.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://www.facebook.com", "_blank");
    } 
    else if (command.includes("search for")) {
        const searchQuery = command.split("search for")[1].trim();
        speak(`Searching for ${searchQuery}`);
        window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
    } 
    else if (command.includes("play music")) {
        speak("Playing music for you...");
        window.open("https://www.spotify.com", "_blank");
    }
    else if (command.includes("what's the time")) {
        const currentTime = new Date().toLocaleTimeString();
        speak(`The current time is ${currentTime}`);
    }
    else if (command.includes("what's today's date")) {
        const currentDate = new Date().toLocaleDateString();
        speak(`Today's date is ${currentDate}`);
    }
    else if (command.includes("tell me a joke")) {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    }
    else if (command.includes("tell me a fact")) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        speak(randomFact);
    }
    else if (command.includes("give me a quote")) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speak(randomQuote);
    }
    else if (command.includes("what is")) {
        const expression = command.replace("what is", "").trim();
        try {
            const result = eval(expression);
            speak(`The result is ${result}`);
        } catch (error) {
            speak("Sorry, I couldn't calculate that.");
        }
    }
    else if (command.includes("set a timer for")) {
        const timeInMinutes = parseInt(command.replace("set a timer for", "").trim());
        if (isNaN(timeInMinutes)) {
            speak("I couldn't understand the time duration.");
        } else {
            speak(`Setting a timer for ${timeInMinutes} minutes.`);
            setTimeout(() => {
                speak("Time's up!");
            }, timeInMinutes * 60 * 1000);
        }
    } 
    else if (command.includes("currency converter")) {
        const [amount, fromCurrency, toCurrency] = command.match(/(\d+)\s*(\w+)\s*to\s*(\w+)/).slice(1);
        const fromRate = currencyRates[fromCurrency.toUpperCase()];
        const toRate = currencyRates[toCurrency.toUpperCase()];
        if (fromRate && toRate) {
            const convertedAmount = (amount * toRate) / fromRate;
            speak(`Converted amount is ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}.`);
        } else {
            speak("Sorry, I couldn't perform that currency conversion.");
        }
    }
    else if (command.includes("what's the weather")) {
        const weatherCondition = command.split("weather")[1].trim();
        const weatherMessage = weatherReports[weatherCondition] || "I don't have a weather update for that condition.";
        speak(weatherMessage);
    }
    else if (command.includes("tell me the news")) {
        const randomHeadline = newsHeadlines[Math.floor(Math.random() * newsHeadlines.length)];
        speak(`Here's a news headline: ${randomHeadline}`);
    }
    else if (command.includes("give me a motivational message")) {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        speak(randomMessage);
    }
    else if (command.includes("add task")) {
        const task = command.split("add task")[1].trim();
        tasks.push(task);
        speak(`Task "${task}" has been added to your list.`);
    }
    else if (command.includes("show my tasks")) {
        if (tasks.length === 0) {
            speak("You have no tasks in your list.");
        } else {
            const taskList = tasks.join(", ");
            speak(`Your tasks are: ${taskList}`);
        }
    }
    else if (command.includes("remove task")) {
        const taskToRemove = command.split("remove task")[1].trim();
        const index = tasks.indexOf(taskToRemove);
        if (index > -1) {
            tasks.splice(index, 1);
            speak(`Task "${taskToRemove}" has been removed from your list.`);
        } else {
            speak(`Task "${taskToRemove}" not found in your list.`);
        }
    }
    else if (command.includes("convert")) {
        const [value, fromUnit, toUnit] = command.match(/(\d+)\s*(\w+)\s*to\s*(\w+)/).slice(1);
        let conversionFactor = 1;

        if (fromUnit === "meters" && toUnit === "kilometers") {
            conversionFactor = 0.001;
        } else if (fromUnit === "kilometers" && toUnit === "meters") {
            conversionFactor = 1000;
        } else if (fromUnit === "grams" && toUnit === "kilograms") {
            conversionFactor = 0.001;
        } else if (fromUnit === "kilograms" && toUnit === "grams") {
            conversionFactor = 1000;
        }

        const convertedValue = value * conversionFactor;
        speak(`Converted value is ${convertedValue} ${toUnit}.`);
    }
    else {
        speak("I'm sorry, I don't recognize that command. Please try asking me something else.");
    }
}
