const languageSelect = document.getElementById('language-select');
const startBtn = document.getElementById('start-btn');
const resultText = document.getElementById('result');
const sunlight = document.getElementById('sunlight');
const water = document.getElementById('water');

// Language mappings for UI text
const languageData = {
    en: {
        title: "Plant Care: Best Yield Sunlight and Water Requirements",
        listening: "Listening for your voice input...",
        askingCrop: "Which crop are you using?",
        askingCity: "Which city are you farming in?",
        askingAcreage: "How much land do you have (in acres)?",
        calculateButton: "Start Listening",
        responseWater: "The water requirement is",
        responseSunlight: "The sunlight requirement is",
    },
    kn: {
        title: "ಸಸ್ಯ ನಿರ್ವಹಣೆ: ಉತ್ತಮ ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಸೂರ್ಯ ಬೆಳಕು ಮತ್ತು ನೀರಿನ ಅಗತ್ಯ",
        listening: "ನೀವು ನಿಮ್ಮ ಧ್ವನಿಯ ಇನ್‌ಪುಟ್‌ನ್ನು ಕೇಳುತ್ತಿರುವೆವು...",
        askingCrop: "ನೀವು ಯಾವ ಬೆಳೆ ಬಳಸುತ್ತಿದ್ದೀರಿ?",
        askingCity: "ನೀವು ಯಾವ ನಗರದಲ್ಲಿ ಕೃಷಿ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        askingAcreage: "ನೀವು ಎಷ್ಟು ಎಕರೆ ಭೂಮಿಯನ್ನು ಹೊಂದಿದ್ದೀರಿ?",
        calculateButton: "ಶ್ರವಣ ಪ್ರಾರಂಭಿಸಿ",
        responseWater: "ನೀರು ಅಗತ್ಯವೇನು",
        responseSunlight: "ಸೂರ್ಯ ಬೆಳಕು ಅಗತ್ಯವೇನು",
    }
};

// Update the UI text based on selected language
function updateUI(language) {
    document.getElementById('app-title').textContent = languageData[language].title;
    document.querySelector('button').textContent = languageData[language].calculateButton;
}

// Initialize speech recognition and synthesis
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis;
let currentQuestion = "";

// Start listening to user's voice input
startBtn.addEventListener('click', () => {
    const selectedLang = languageSelect.value;
    updateUI(selectedLang);
    promptForCrop(selectedLang);
});

// Function to prompt user for crop (voice input)
function promptForCrop(lang) {
    currentQuestion = languageData[lang].askingCrop;
    speak(languageData[lang].askingCrop);
    recognition.start();
}

// Function to speak a question or answer
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelect.value === 'en' ? 'en-US' : `${languageSelect.value}-IN`;
    synth.speak(utterance);
}

// Handle voice recognition results
recognition.onresult = function (event) {
    const userResponse = event.results[0][0].transcript.toLowerCase();

    if (currentQuestion === languageData[languageSelect.value].askingCrop) {
        handleCropResponse(userResponse);
    } else if (currentQuestion === languageData[languageSelect.value].askingCity) {
        handleCityResponse(userResponse);
    } else if (currentQuestion === languageData[languageSelect.value].askingAcreage) {
        handleAcreageResponse(userResponse);
    }
};

// Handle crop response
function handleCropResponse(crop) {
    const selectedLang = languageSelect.value;
    promptForCity(selectedLang, crop);
}

// Ask for city
function promptForCity(lang, crop) {
    currentQuestion = languageData[lang].askingCity;
    speak(languageData[lang].askingCity);
    recognition.start();
}

// Handle city response
function handleCityResponse(city) {
    const selectedLang = languageSelect.value;
    promptForAcreage(selectedLang, city);
}

// Ask for acreage
function promptForAcreage(lang, city) {
    currentQuestion = languageData[lang].askingAcreage;
    speak(languageData[lang].askingAcreage);
    recognition.start();
}

// Handle acreage response and calculate water and sunlight
function handleAcreageResponse(acreage) {
    const crop = document.getElementById('crop').value; // Assuming crop input is available
    const city = document.getElementById('city').value; // Assuming city input is available
    const selectedLang = languageSelect.value;

    // Send a request to the backend for calculations
    fetch(`/calculate?crop=${crop}&city=${city}&acreage=${acreage}&lang=${selectedLang}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                speak(data.error);
            } else {
                speak(`${languageData[selectedLang].responseSunlight} ${data.sunlight}`);
                speak(`${languageData[selectedLang].responseWater} ${data.water}`);
            }
        })
        .catch(err => {
            console.error(err);
            speak('Error occurred while fetching data.');
        });
}
