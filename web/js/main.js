/*global SpeechSynthesisUtterance, Util */
var App = App || {};
(function() {
	"use strict";
	
	var d = document;
	var score = 0;
	var	totalAttempts = 0;

    /** Config */
    App.targetLang = "de-DE";
    App.sourceLangFile = "data/en-EN.strings";
    App.targetLangFile = "data/de-DE.strings";

	/** Initialization */
	init();

	/** Functions */
	function init() {
		disableDrag();
		App.loadFiles(App.sourceLangFile, App.targetLangFile, function(data) {
			renderPhrases(data);
			setScore(0, 0);

			var randomPhrase = getRandomPhrase();
			randomPhrase.classList.add("current");
			if (isSpeechOn()) {
				d.body.classList.add("speech-on");
			}
		});
	}

	function disableDrag() {
		d.querySelector(".actions").addEventListener("touchmove", function(event) {
			event.preventDefault();
		}, false);
	}
	
	function isSpeechOn() {
		return window.speechSynthesis && SpeechSynthesisUtterance !== "undefined";
	}

	function getRandomPhrase() {
        var phrases = d.querySelectorAll(".phrase");
		var randomIndex = Math.floor(Math.random() * (phrases.length));
		return phrases[randomIndex];
	}
	
	function setScore(knownScore, totalScore) {
		d.querySelector(".hud").innerHTML = knownScore + " / " + totalScore;
	}

    function renderPhrases(data) {
        var templateString = d.querySelector(".phrase-template").innerHTML;
        var templateParent = d.createElement("div");
        templateParent.innerHTML = templateString;
        var template = templateParent.children[0];

        var fragment = d.createDocumentFragment();
        var i, element, string;
        for (i = 0; i < data.length; i++) {
            element = template.cloneNode(true);
            string = element.innerHTML;
            string = string.replace("{{source}}", data[i][0]);
            string = string.replace("{{target}}", data[i][1]);
            element.innerHTML = string;
            fragment.appendChild(element);
        }
        d.querySelector(".content").appendChild(fragment);
    }

    /** Event listeners */
    var speakButton = d.querySelector(".actions .speak");
	speakButton.addEventListener(Util.touchEvent, function speak(event) {
		var phrase = d.querySelector(".phrase.current");
		var button = event.currentTarget;
		if (button.classList.contains("playing")) {
			window.speechSynthesis.cancel();
			button.classList.remove("playing");
		} else {
			button.classList.add("playing");
			var text = phrase.querySelector(".target").textContent;
			var utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = App.targetLang;
			if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
				utterance.rate = 0.2;
			}
			utterance.onpause = utterance.onend = function() {
				button.classList.remove("playing");
			};
			window.speechSynthesis.speak(utterance);
		}
	});
	
	var actionButtons = d.querySelectorAll(".actions .known, .actions .unknown");
	Util.addEventListener(actionButtons, Util.touchEvent, function markAnswer(event) {
		var known = event.currentTarget.classList.contains("known");
		var resultClass = known ? "known" : "unknown";
		if (known) {
			score++;
		}
		totalAttempts++;
        setScore(score, totalAttempts);

		var phrase = d.querySelector(".phrase.current");
		phrase.classList.add("done");
		phrase.classList.add(resultClass);
		phrase.classList.remove("current");

		var randomPhrase = getRandomPhrase();
		randomPhrase.classList.add("next");

		setTimeout((function(donePhrase, nextPhrase) {
            return function() {
                if (isSpeechOn()) {
                    window.speechSynthesis.cancel();
                }
                donePhrase.classList.remove("done");
                donePhrase.classList.remove(resultClass);
                nextPhrase.classList.remove("next");
                nextPhrase.classList.add("current");
            };
        }(phrase, randomPhrase)), 300);
	}, false);

	var content = d.querySelector(".content");
	content.addEventListener("click", function toggleTranslation(event) {
		var currentPhrase = event.currentTarget.querySelector(".current");
		currentPhrase.classList.toggle("selected");
	}, false);

}());
