# Install necessary software
    # Set-ExecutionPolicy Bypass -Scope Process -Force
    # set up winget
    try{
        winget --version
        Write-Host "Winget already installed"
    }
    catch{
        Write-Host "Winget not found, start intall"
        $progressPreference = 'silentlyContinue'
        Write-Host "Installing WinGet PowerShell module from PSGallery..."
        Install-PackageProvider -Name NuGet -Force | Out-Null
        Install-Module -Name Microsoft.WinGet.Client -Force -Repository PSGallery | Out-Null
        Write-Host "Using Repair-WinGetPackageManager cmdlet to bootstrap WinGet..."
        Repair-WinGetPackageManager
        Write-Host "Done."
    }

    # App to install
    $installApps = 
        "Git.Git",
        "Microsoft.SQLServer.2022.Express",
        "OpenJS.NodeJS",
        "Oracle.JDK.23"

    Write-host "Installing apps"
    Foreach ($app in $installApps) {
        $listApp = winget list --exact -q $app
        if (![String]::Join("", $listApp).Contains($app)) {
            Write-host "Installing: " $app
            winget install -e -h --accept-source-agreements --accept-package-agreements --id $app
        }
        else {
            Write-host "Skipping: " $app" (already installed)"
        }
    }

# Configure database
    sqlcmd -S "$((Get-Item env:\COMPUTERNAME).Value)\SQLEXPRESS" -i ./initialize.sql

# Restart SQL Server service
    Restart-Service -Name 'MSSQL$SQLEXPRESS' -Force

# Install vite for FrontEnd
npm install vite