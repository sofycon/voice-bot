const sdk = require("microsoft-cognitiveservices-speech-sdk");
//Find your key and resource region under the 'Keys and Endpoint' tab in your Speech resource in Azure Portal
//Remember to delete the brackets <> when pasting your key and region!
const speechConfig = sdk.SpeechConfig.fromSubscription("2122d41ce88f4ec790605db128de6ab4", "germanywestcentral");

function synthesizeToSpeaker() {
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
        "Dies ist ein Test",
    result => {
        if (result) {
            console.log(JSON.stringify(result));
        }
        synthesizer.close();
    },
    error => {
        console.log(error);
        synthesizer.close();
    });
}
synthesizeToSpeaker()