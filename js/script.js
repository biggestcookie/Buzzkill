let total_buzz_words = 19;

function returnMap(wordList) {
    let wordMap = new Map();
    for (i = 0; wordList.length > i; i++) {
        wordMap.set(wordList[i], i);
    }
    return wordMap;
}

function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = './img/mic-slash.gif';
    showInfo('info_allow');
    // showButtons('none');
    start_timestamp = event.timeStamp;
}

var score = 0;
var final_score = 0;

words = [
    "adaptive",
    "agile",
    "ai",
    "ajax",
    "algorithm",
    "android",
    "analytics",
    "api",
    "artificial intelligence",
    "augmented",
    "authentication",
    "big data",
    "biometric",
    "bitcoin",
    "blockchain",
    "bot",
    "botnet",
    "bootstrap",
    "cloud",
    "cloud-based",
    "cross-platform",
    "cyber",
    "cyber-security",
    "cybersecurity",
    "data mining",
    "dark web",
    "deep web",
    "devops",
    "dmca",
    "encryption",
    "encrypted",
    "end-to-end",
    "emacs",
    "framework",
    "functional",
    "gdpr",
    "graphics processing",
    "hack",
    "hackathon",
    "hacker",
    "hacking",
    "internet of things",
    "ios",
    "iot",
    "linux",
    "machine learning",
    "ml",
    "mobile",
    "multi-threading",
    "multi-core",
    "neural network",
    "network",
    "networking",
    "predictive",
    "polymorphism",
    "quantum",
    "referential transparency",
    "responsive",
    "rest",
    "scalability",
    "science",
    "scrum",
    "security",
    "serverless",
    "skeuomorphic",
    "software",
    "tape drive",
    "threat management",
    "tor",
    "tuples",
    "turing complete",
    "ubuntu",
    "unit test",
    "unix",
    "virtual reality",
    "vim",
    "vr",
    "waterfall"
]

let wordMap = returnMap(words);
function inMap(wordMap, word) {
    word = word.toLowerCase();
    return (wordMap.get(word) > -1);
};

select_language = 'English';
select_dialect = 'en-US';
showInfo('info_start');

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;


if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.src = '../img/mic-animate.gif';
        score = 0;
        final_score = 0;
    };

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            start_img.src = '../img/mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = '../img/mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = './img/mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }

        // Show the id of the final score.
        showInfo('final_score');
        document.getElementById('final_score').innerHTML = "Your final score is " + final_score.toString() + " / 10";
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
                score = calculateScoreLive(score, event.results[i][0].transcript);
                console.log('Live score: ' + score);
            }
        }
        final_transcript = capitalize(final_transcript);
        final_score = calculateScoreFinalized(final_transcript);
        console.log('Final score: ' + final_score);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}

function calculateScoreLive(score, transcript) {
    var words = transcript.split(" ");
    console.log('Checking: ' + words[words.length - 1]);
    if (inMap(wordMap, words[words.length - 1])) {
        score++;
        return score;
    }
    return score;
};

function calculateScoreFinalized(final_transcript) {
    // Our longest word phrase in the dictionary is 3 words. So we will look at
    // up to 2 words before and 2 words after to see if it matches anything.
    var words = final_transcript.split(" ");
    var cal_fin_score = 0;
    for (index in words) {
        try {
            if (inMap(wordMap, words[index])) {
                cal_fin_score++;
            } else if (inMap(wordMap, words[index - 1] + " " + words[index])) { // 1 word before
                cal_fin_score++;
            } else if (inMap(wordMap, words[index - 2] + " " + words[index - 1] + " " + words[index])) {// 2 words before
                cal_fin_score++;
            } else if (inMap(wordMap, words[index] + " " + words[index + 1])) { // 1 word after
                cal_fin_score++;
            } else if (inMap(wordMap, words[index] + " " + words[index + 1] + " " + words[index + 2])) { // 2 words after
                cal_fin_score++;
            }
        } catch (err) {
            // do nothing.
            console.log(err);
        }
    }

    cal_fin_score = (cal_fin_score / total_buzz_words) * 10;
    return cal_fin_score;
};


var two_line = /\n\n/g;
var one_line = /\n/g;


var first_char = /\S/;


var current_style;
