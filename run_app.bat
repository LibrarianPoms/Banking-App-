@echo off
echo Compiling Banking System Application...

:: Create bin directory if it doesn't exist
if not exist bin mkdir bin

:: Compile all Java files
javac -d bin src\model\*.java src\server\*.java src\*.java

echo.
echo Starting Banking Server...
echo.
echo Use Ctrl+C to stop the server when done
echo.
echo Open http://localhost:8080 in your browser once the server is running

:: Run the server
java -cp bin server.SimpleHttpServer

pause
