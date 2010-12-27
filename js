#!/bin/sh
if [ "$1" == "-h" ] || [ "$1" == "-help" ] || [ "$1" == "" ]
then
	echo Command List:
	echo js compress [path] - Builds a compressed file of all files in config.
	echo js app [name] - Generates a directory with a skeleton model, controller, and views for [name].
	exit 127
fi

if [ "$1" == "compress" ]
then
	echo compress "$2"
	java -cp bin/js.jar org.mozilla.javascript.tools.shell.Main bin/compress.js "$2"config.js
	java -jar bin/yuicompressor-2.4.2.jar --line-break 4096 -o "$2"compressed.js "$2"packed.js
fi

if [ "$1" == "app" ]
then
	java -cp bin/js.jar org.mozilla.javascript.tools.shell.Main bin/app.js "$2" "$3"
fi