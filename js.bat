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
java -cp bin\js.jar org.mozilla.javascript.tools.shell.Main bin\compress.js %2
SET config=%2
SET packed=%config:config.js=packed.js%
SET compressed=%config:config.js=compressed.js%
java -jar bin\yuicompressor-2.4.2.jar --line-break 4096 -o %compressed% %packed% 
GOTO END

:HELP
echo Command Lists:
echo js compress [path] Builds a compressed file of all files in config.
echo js app [name] Generates a directory with a skeleton model, controller, and views for [name].

:END