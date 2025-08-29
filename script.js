const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("img");



selectTag.forEach((tag , id)=>{
    

    for (const countriesCode in countries) {
        let selected ;
        if( id == 0 && countriesCode == "en-GB"){
            selected =" selected";
        }else if(id == 1 && countriesCode == "hi-IN"){
            selected =" selected";
        }
        let option = ` <option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
        }
});

translateBtn.addEventListener("click", () => {
    let textToTranslate = fromText.value;
    let sourceLanguage = selectTag[0].value; 
    let targetLanguage = selectTag[1].value; 



    const requestBody = {
        q: textToTranslate,
        target: targetLanguage,
        source: sourceLanguage 
    };

    fetch(`${GOOGLE_CLOUD_TRANSLATE_ENDPOINT}?key=${GOOGLE_CLOUD_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(errorData => {
                console.error("Google Cloud Translation API error:", errorData);
                throw new Error(`HTTP error! status: ${res.status} - ${errorData.error.message}`);
            });
        }
        return res.json();
    })
    .then(data => {
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            toText.value = data.data.translations[0].translatedText;
        } else {
            toText.value = "Translation failed or no translation found.";
            console.error("Unexpected response from Google Cloud Translation API:", data);
        }
    })
    .catch(error => {
        console.error("Error during translation:", error);
        toText.value = "Error: Could not translate text.";
    });
});

icons.forEach(icon =>{
icon.addEventListener( "click" , ({target}) => {
    if(target.classList.contains("copy") ){
        if(target.id == "from"){
           navigator.clipboard.writeText(fromText.value)
        }
        else{
            navigator.clipboard.writeText(toText.value)
        }
    }
    else{
        let utterance;
        if(target.id == "from"){
           utterance = new SpeechSynthesisUtterance(fromText.value)
           utterance.lang = selectTag[0].value;

        }else{
            utterance = new SpeechSynthesisUtterance(toText.value)
            utterance.lang = selectTag[1].value;
        }
        speechSynthesis.speak(utterance);
    }
});
});
