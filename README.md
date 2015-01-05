A simple flash card app to help you learn foreign languages. You can provide your own source text and translations in any two languages.

##Instructions

If you understand the phrase, mark it with thumbs up. If you don't, then use the thumbs down button. If your browser supports [Web Speech Synthesis API](http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API), you will additionally see a play button that allows you to listen to the phrase.

The display at the top shows the number of phrases you recognized and the total number of phrases you tried so far. If you don't recognize the phrase, you can always tap it to see its meaning in the language you already know.

The phrases are presented to you in random order. The app was designed with iPhone in mind, but can run in any modern web browser. Practice often for better results!

##Demo

[Demo Page](http://szafranek.github.io/jellymemo)

Example page using German text from the game [JellySplash](http://www.wooga.com/games/jelly-splash/) by [Wooga](http://www.wooga.com).

##Adding your own phrases

You can use the app with your own source text and translation in any language. The files have to conform to Apple's [format](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html) for localization resources. See the `data` folder for an example.

  1. Put your `.strings` files into the `data` folder.
  1. Open `main.js` file and specify:
    1. Target language's [code](http://www.w3.org/TR/html401/struct/dirlang.html#langcodes).
	1. Paths to the `.strings` files you provided. Target language is the one you want practice, source language is the reference language.
  1. Place entire app on the webserver and open it in a web browser.
  
##License
Unless specified otherwise, all code in the application is in public domain.

The `*.strings` text files are a copyrighted material from [JellySplash](http://www.wooga.com/games/jelly-splash/) by [Wooga](http://www.wooga.com).
They are used here only for demonstration purposes, courtesy of Wooga.

Entypo pictograms by Daniel Bruce — [www.entypo.com](http://www.entypo.com).