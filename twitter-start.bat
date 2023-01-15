start backend-dependencies
timeout /t 20
start frontend-dependencies
timeout /t 20
start mongo
timeout /t 5
start frontend-server.bat
start backend-server.bat
exit