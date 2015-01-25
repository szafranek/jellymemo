var App = App || {};
(function() {
	"use strict";

	/** Module definition */
	App.loadFiles = function(sourceLang, targetLang, callback) {
		var state = new LoadState();
		state.toLoad.push(sourceLang);
		state.toLoad.push(targetLang);
		loadFile(sourceLang, state, 0, callback);
		loadFile(targetLang, state, 1, callback);
	};

	/** Functions */
	function lineToArray(line) {
		if (!line.match(/".*"\s=\s".*";/i)) {
			return null;
		}
		var arr = line.split("\" = \"");
		arr[0] = arr[0].substring(1);
		arr[1] = arr[1].slice(0, -2);
		return arr;
	}

	function mergeLangs(langs) {
		var i, j;
		var result = [];
		var linesFirst = langs[0].split("\n");
		var linesSecond = langs[1].split("\n");
		for (i = 0; i < linesFirst.length; i++) {
			var lineFirst = lineToArray(linesFirst[i]);
			if (!lineFirst) {
				continue;
			}
			var keyFirst = lineFirst[0];
			var valFirst = lineFirst[1];
			if (valFirst.length <= 1) {
				continue;
			}
			for (j = 0; j < linesSecond.length; j++) {
				var lineSecond = lineToArray(linesSecond[j]);
				if (!lineSecond) {
					continue;
				}
				var keySecond = lineSecond[0];
				var valSecond = lineSecond[1];
				if (keyFirst === keySecond && valSecond.length > 1) {
					result.push([valFirst, valSecond]);
					// Optimization: remove matched element to reduce lookups
					linesSecond.splice(j, 1);
				}
			}
		}
		return result;
	}

	function loadFile(fileName, loadState, resultIndex, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', fileName, true);
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status < 400) {
				loadState.loaded.push(fileName);
				loadState.results[resultIndex] = xhr.responseText.trim();
				if (loadState.isComplete()) {
					var merged = mergeLangs(loadState.results);
					callback(merged);
				}
			}
		};
		xhr.onerror = function() {
		};
		xhr.send();
	}

	function LoadState() {
		this.results = [];
		this.toLoad = [];
		this.loaded = [];
	}

	LoadState.prototype.isComplete = function() {
		return this.loaded.length === this.toLoad.length;
	};

}());