 param (
    [switch]$Help = $false,
    [switch]$Installer = $false,
    [switch]$Portable = $false,
    [string]$PortablePath = "",
    [switch]$NoPrompt = $false
 )

function ConvertTo-Boolean {
    param($Variable)
    if ($Variable.ToLower() -eq "y") {
        $true
    }
    if ($Variable.ToLower() -eq "n") {
        $false
    }
    if ($Variable.ToLower() -eq "yes") {
        $true
    }
    if ($Variable.ToLower() -eq "no") {
        $false
    }
}

function Get-Help {
    # Display Help
    Write-Output "Script to install Blender plugin for the Kitsu Publisher."
    Write-Output ""
    Write-Output "Usage: install.ps1 [options]"
    Write-Output "options:"
    Write-Output "-help"
    Write-Output "  Print this help."
    Write-Output "-installer"
    Write-Output "  Install the plugin for an installer installation."
    Write-Output "-portable PATH"
    Write-Output "  Install the plugin for a portable directory installation. You need to specify the path to this directory."
    Write-Output "-NoPrompt"
    Write-Output "  Disable the ending prompt."
}

function Install-Pip {
    Write-Output "Installation of pip."
    & $PythonExecutable -m ensurepip --upgrade
    Write-Output "Pip installed."
}

function Install-Plugin {
    Write-Output "Installation of the plugin."
    $BlenderAddonsPath = [IO.Path]::Combine($env:APPDATA, "Blender Foundation", "Blender", $BlenderVersion, "scripts", "addons")
    & $PythonExecutable -m pip install -r ([IO.Path]::Combine($PSScriptRoot, "..", "requirements_python_connector.txt")) -t ([IO.Path]::Combine($BlenderAddonsPath, "modules")) -U
    Copy-Item -Path ([IO.Path]::Combine($PSScriptRoot, "kitsu-publisher.py")) ([IO.Path]::Combine($BlenderAddonsPath)) -force
    Write-Output "Plugin for blender installed in $BlenderAddonsPath"
    Write-Output "Enabling the plugin in Blender."
    & $BlenderExecutable -b -P ([IO.Path]::Combine($PSScriptRoot, "auto-enable.py"))
    Write-Output "Plugin enabled."
}

function Installer-Installation {
    $UninstallKeys = @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'
                    )
    
    $InstallLocationsBlender = [System.Collections.ArrayList]::new()
    foreach ($key in (Get-ChildItem $UninstallKeys)) {
        if ($key.getValue("DisplayName") -eq "blender" ) {
            $DisplayVersion = $key.getValue("DisplayVersion") -split '\.'
            if (([int]$DisplayVersion[0] -ge 3) -or (([int]$DisplayVersion[0] -ge 2) -and [int]$DisplayVersion[1] -ge 80)) {
                [void]$InstallLocationsBlender.Add($key.getValue("InstallLocation"))
            }
        }
    }

    if ($InstallLocationsBlender.count -eq 0) {
        throw "Blender is not installed on this computer." 
    }
    foreach ($InstallLocation in $InstallLocationsBlender) {
        $BlenderExecutable = [IO.Path]::Combine($InstallLocation, "blender.exe")
        if (Test-Path $BlenderExecutable) 
        {
            Write-Output "Found installer installation of Blender in $InstallLocation."
            foreach ($Line in (((cmd.exe /c $BlenderExecutable -v) | Out-String) -split '\n')) {
                if ($Line -match 'Blender [0-9]+\.[0-9]+\.[0-9]+') {
                    $BlenderVersion = ($Line -split ' ')[1] -split '\.'
                    $BlenderVersion = $BlenderVersion[0] + "." + $BlenderVersion[1]
                    $PythonExecutable = (Get-ChildItem -Path ([IO.Path]::Combine($InstallLocation, $BlenderVersion, "python", "bin", "python*.exe"))).FullName
                    Install-Pip
                    Install-Plugin
                    break
                }
            }
        }
    }
}

function Portable-Installation {
    if ($PortablePath -eq "") {
        if (!$NoPrompt) {
            $PortablePath = Read-Host -Prompt "Type the path to your portable Blender "
        }
        else {
            throw "You need to give the path to your portable Blender (-help for help)."
        }
    }
    $BlenderExecutable = [IO.Path]::Combine($PortablePath, "blender.exe")
    if (-not (Test-Path $BlenderExecutable)) 
    {
        throw [System.IO.FileNotFoundException] "Blender could not be found as a portable directory at $PortablePath."
    }
    $BlenderVersion = (((cmd.exe /c $BlenderExecutable -v) | Out-String) -split '\n')[0] 
    $BlenderVersion = ($BlenderVersion -split ' ')[1] -split '\.'
    $BlenderVersion = $BlenderVersion[0] + "." + $BlenderVersion[1]
    $PythonExecutable = (Get-ChildItem -Path ([IO.Path]::Combine($PortablePath, $BlenderVersion, "python", "bin", "python*.exe"))).FullName
    Install-Pip
    Install-Plugin
}

try {
    if($Help)
    {
        Get-Help
    } elseif ($Installer)
    {
        Installer-Installation
    } elseif ($Portable)
    {
        Portable-Installation
    } else 
    {
        if (! $NoPrompt) {
            if (ConvertTo-Boolean -Variable (Read-Host -Prompt "Do you want to install the Blender plugin for the Kitsu Publisher for Blender installer installation? (Y/N)")) {
                Installer-Installation
            }
            elseif (ConvertTo-Boolean -Variable (Read-Host -Prompt "Do you want to install the Blender plugin for the Kitsu Publisher for Blender portable? (Y/N)")) {
                Portable-Installation
            }
            else {
                throw "Installation aborted."
            }
        }
        else {
            throw "You need to specify a target (-help for help)."
        }
    }
} catch {
    Write-Host -Foreground Red -Background Black ($_)
} finally {
    if (! $NoPrompt) {
        Read-Host -Prompt "Press enter to finish"
    }
}