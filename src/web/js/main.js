/*jslint white:true, browser:true, plusplus:true, vars:true, todo: true */
/*global App, NodeList, SpeechSynthesisUtterance, speechSynthesis, ontouchstart */
(function() {
	"use strict";
	
	var d = document;
	var APP = {};
	var score = 0;
	var	totalAttempts = 0;

    // Setup
	if (window.ontouchstart === undefined) {
		APP.touchEvent = "mousedown";
		APP.touchEventEnd = "mouseup";
	} else {
		APP.touchEvent = "touchstart";
		APP.touchEventEnd = "touchend";
	}


    NodeList.prototype.addEventListener = function(type, listener, useCapture) {
        var i;
        for (i = 0; i < this.length; i++) {
            this[i].addEventListener(type, listener, useCapture);
        }
    };

	// Functions
	var disableDrag = function() {
		d.querySelector(".actions").addEventListener("touchmove", function(event) {
			event.preventDefault();
		}, false);
	};
	
	var isSpeechOn = function() {
		return window.speechSynthesis && SpeechSynthesisUtterance !== "undefined";
	};

	var getRandomPhrase = function() {
        var phrases = d.querySelectorAll(".phrase");
		var randomIndex = Math.floor(Math.random() * (phrases.length));
		return phrases[randomIndex];
	};
	
	var setScore = function(knownScore, totalScore) {
		d.querySelector(".hud").innerHTML = knownScore + " / " + totalScore;
	};

    var renderPhrases = function(data) {
        var templateString = d.getElementById("phrase-template").innerHTML;
        var templateParent = d.createElement("div");
        templateParent.innerHTML = templateString;
        var template = templateParent.children[0];

        var fragment = d.createDocumentFragment();
        var i;
        for (i = 0; i < data.length; i++) {
            var element = template.cloneNode(true);
            var string = element.innerHTML;
            string = string.replace("{{source}}", data[i][0]);
            string = string.replace("{{target}}", data[i][1]);
            element.innerHTML = string;
            fragment.appendChild(element);
        }
        d.querySelector("#main").appendChild(fragment);
    };

    // Event listeners
	d.querySelector(".actions .speak").addEventListener(APP.touchEvent, function(event) {
		var phrase = d.querySelector(".phrase.current");
		var button = event.currentTarget;
		if (button.classList.contains("playing")) {
			window.speechSynthesis.cancel();
			button.classList.remove("playing");
		} else {
			button.classList.add("playing");
			var text = phrase.querySelector(".target").textContent;
			var utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "de-DE";
			if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
				utterance.rate = 0.3;
			}
			utterance.onpause = utterance.onend = function() {
				button.classList.remove("playing");
			};
			window.speechSynthesis.speak(utterance);
		}
	});
	
	var actionButton = d.querySelectorAll(".actions .known, .actions .unknown");
	actionButton.addEventListener(APP.touchEvent, function(event) {
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


    // Initialization
    (function init() {
        disableDrag();
        App.loadFiles("data/en-EN.txt", "data/de-DE.txt", function(data) {
            renderPhrases(data);
            setScore(0, 0);

            // TODO: use event delegation, so it's not necessary to bind events here
            var phrases = d.querySelectorAll(".phrase");
            phrases.addEventListener("click", function(event) {
                event.currentTarget.classList.toggle("selected");
            }, false);

            var randomPhrase = getRandomPhrase();
            randomPhrase.classList.add("current");
            if (isSpeechOn()) {
                d.body.classList.add("speech-on");
            }
        });
    }());

}());
