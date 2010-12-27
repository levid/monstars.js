@echo off

if "%1"=="-h" GOTO HELP
if "%1"=="-help" GOTO HELP
if "%1"=="compress" GOTO COMPRESS
if "%1"=="app" GOTO APP

GOTO HELP

:APP
java -cp bin\js.jar org.mozilla.javascript.tools.shell.Main bin\app.js %2 %3
GOTO END

:COMPRESS
java -cp bin\js.jar org.mozilla.javascript.tools.shell.Main bin\compress.js %2config.js
java -jar bin\yuicompressor-2.4.2.jar --line-break 4096 -o %2compressed.js %2packed.js
GOTO END

:HELP
echo Command List:
echo js compress [path] - Builds a compressed file of all files in config.
echo js app [name] - Generates a directory with a skeleton model, controller, and views for [name].

:END