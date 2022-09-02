const sdk = require("microsoft-cognitiveservices-speech-sdk");
//Find your key and resource region under the 'Keys and Endpoint' tab in your Speech resource in Azure Portal
//Remember to delete the brackets <> when pasting your key and region!
const speechConfig = sdk.SpeechConfig.fromSubscription("2122d41ce88f4ec790605db128de6ab4", "germanywestcentral");
var readline = require("readline");

function synthesizeToSpeaker() {
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();


    speechConfig.speechSynthesisLanguage = "en-US";
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // Before beginning speech synthesis, setup the callbacks to be invoked when an event occurs.

    // The event synthesizing signals that a synthesized audio chunk is received.
    // You will receive one or more synthesizing events as a speech phrase is synthesized.
    // You can use this callback to streaming receive the synthesized audio.
    synthesizer.synthesizing = function (s, e) {
        var str = "(synthesizing) Reason: " + sdk.ResultReason[e.result.reason] + " Audio chunk length: " + e.result.audioData.byteLength;
        console.log(str);
    };

    // The event visemeReceived signals that a viseme is detected.
    // a viseme is the visual description of a phoneme in spoken language. It defines the position of the face and mouth when speaking a word.
    synthesizer.visemeReceived = function(s, e) {
        var str = "(viseme) : Viseme event received. Audio offset: " + (e.audioOffset / 10000) + "ms, viseme id: " + e.visemeId;
        console.log(str);
    }

    // The event synthesis completed signals that the synthesis is completed.
    synthesizer.synthesisCompleted = function (s, e) {
        console.log("(synthesized)  Reason: " + sdk.ResultReason[e.result.reason] + " Audio length: " + e.result.audioData.byteLength);
    };

    // The synthesis started event signals that the synthesis is started.
    synthesizer.synthesisStarted = function (s, e) {
        console.log("(synthesis started)");
    };

    // The event signals that the service has stopped processing speech.
    // This can happen when an error is encountered.
    synthesizer.SynthesisCanceled = function (s, e) {
        var cancellationDetails = sdk.CancellationDetails.fromResult(e.result);
        var str = "(cancel) Reason: " + sdk.CancellationReason[cancellationDetails.reason];
        if (cancellationDetails.reason === sdk.CancellationReason.Error) {
            str += ": " + e.result.errorDetails;
        }
        console.log(str);
    };

    // This event signals that word boundary is received. This indicates the audio boundary of each word.
    // The unit of e.audioOffset is tick (1 tick = 100 nanoseconds), divide by 10,000 to convert to milliseconds.
    synthesizer.wordBoundary = function (s, e) {
        console.log("(WordBoundary), Text: " + e.text + ", Audio offset: " + e.audioOffset / 10000 + "ms.");
    };

    rl.question("Type some text that you want to speak...\n> ", function (text) {
        rl.close();
        // start the synthesizer and wait for a result.
        synthesizer.speakTextAsync(text,
            function (result) {
            console.log('spoke',text)
                synthesizer.close();

            },
            function (err) {
                console.trace("err - " + err);
                synthesizer.close();
            })
    });

}
synthesizeToSpeaker()