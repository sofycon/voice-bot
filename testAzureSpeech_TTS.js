const fs = require('fs');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
//Find your key and resource region under the 'Keys and Endpoint' tab in your Speech resource in Azure Portal
//Remember to delete the brackets <> when pasting your key and region!
const speechConfig = sdk.SpeechConfig.fromSubscription("2122d41ce88f4ec790605db128de6ab4", "germanywestcentral");

function recognizeFromFile() {
    let pushStream = sdk.AudioInputStream.createPushStream();

    /*fs.createReadStream("YourAudioFile.wav").on('data', function(arrayBuffer) {
        pushStream.write(arrayBuffer.slice());
    }).on('end', function() {
        pushStream.close();
    });*/

    let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    recognizer.recognizeOnceAsync(result => {
        console.log(`RECOGNIZED: Text=${result.text}`);
        recognizer.close();
    });
}
recognizeFromFile();