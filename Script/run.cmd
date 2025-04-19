@echo off

cd ../multiple_choice_exam
REM Chạy backend ở cửa sổ mới
start "Backend" cmd /k "java -jar BackEnd\target\exam-0.0.1-SNAPSHOT.jar"

REM Chạy frontend ở cửa sổ mới
start "Frontend" cmd /k "cd FrontEnd & npm run dev"

REM Đợi backend khởi động một chút (có thể chỉnh số giây)
timeout /t 30

start "" http://localhost
exit