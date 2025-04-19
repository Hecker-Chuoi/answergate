# Tao thu muc luu bai thi
    $folderPath = "$HOME\Documents\multiple_choice_exam"
    if (!(Test-Path $folderPath)) {
        mkdir $folderPath
        Write-Host "Da tao thu muc: $folderPath"
    } else {
        Write-Host "Thu muc da ton tai: $folderPath"
    }

# Get source codes
    cd $folderPath
    git clone https://github.com/Hecker-Chuoi/answergate FrontEnd
    git clone https://github.com/Hecker-Chuoi/multiple-choice-exam.git BackEnd

# Move run script to main folder
    cp ..\Script\run.cmd .\run.cmd

# Open notepad to change API URL
    notepad .\FrontEnd\.env

    cd BackEnd
    ./mvnw clean install package