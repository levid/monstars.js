@echo off

if "%1"=="-h" GOTO HELP
if "%1"=="-help" GOTO HELP
if "%1"=="compress" GOTO RUN
if "%1"=="app" GOTO RUN

GOTO HELP

:RUN
java -cp bin\js.jar org.mozilla.javascript.tools.shell.Main bin\%1.js %2
GOTO END

:HELP
echo Command Lists:
echo js compress [path] Builds a compressed file of all files in config.
echo js app [name] Generates a directory with a skeleton model, controller, and views for [name].

:END