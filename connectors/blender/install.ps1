 param (
    [switch]$help = $false,
    [switch]$installer = $false,
    [switch]$portable = $false,
    [string]$portable_path = "",
    [switch]$noprompt = $false
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
    Write-Output "-noprompt"
    Write-Output "  Disable the ending prompt."
}

function Install-Pip {
    Write-Output "Installation of pip."
    & $python_executable -m ensurepip --upgrade
    Write-Output "Pip installed."
}

function Install {
    Write-Output "Installation of the plugin."
    $blender_addons_path = [IO.Path]::Combine($env:APPDATA, "Blender Foundation", "Blender", $blender_version, "scripts", "addons")
    & $python_executable -m pip install $PSScriptRoot -t ([IO.Path]::Combine($blender_addons_path, "modules")) -U
    Copy-Item -Path ([IO.Path]::Combine($PSScriptRoot, "kitsu-publisher.py")) ([IO.Path]::Combine($blender_addons_path)) -force
    Write-Output "Plugin for blender installed in $blender_addons_path"
    Write-Output "Enabling the plugin in Blender."
    & $blender_executable -b -P ([IO.Path]::Combine($PSScriptRoot, "auto-enable.py"))
    Write-Output "Plugin enabled."
}

function Installer {
    $UninstallKeys = @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'
                    )
    
    $InstallLocationsBlender = [System.Collections.ArrayList]::new()
    foreach ($key in (Get-ChildItem $UninstallKeys)) {
        if ($key.getValue("DisplayName") -eq "blender" ) {
            $display_version = $key.getValue("DisplayVersion") -split '\.'
            if (([int]$display_version[0] -ge 3) -or (([int]$display_version[0] -ge 2) -and [int]$display_version[1] -ge 80)) {
                [void]$InstallLocationsBlender.Add($key.getValue("InstallLocation"))
            }
        }
    }

    if ($InstallLocationsBlender.count -eq 0) {
        throw "Blender is not installed on this computer." 
    }
    foreach ($InstallLocation in $InstallLocationsBlender) {
        $blender_executable = [IO.Path]::Combine($InstallLocation, "blender.exe")
        if (Test-Path $blender_executable) 
        {
            Write-Output "Found installer installation of Blender in $InstallLocation."
            foreach ($line in (((cmd.exe /c $blender_executable -v) | Out-String) -split '\n')) {
                if ($line -match 'Blender [0-9]+\.[0-9]+\.[0-9]+') {
                    $blender_version = ($line -split ' ')[1] -split '\.'
                    $blender_version = $blender_version[0] + "." + $blender_version[1]
                    $python_executable = (Get-ChildItem -Path ([IO.Path]::Combine($InstallLocation, $blender_version, "python", "bin", "python*.exe"))).FullName
                    Install-Pip
                    Install
                    break
                }
            }
        }
    }
}

function Portable {
    if ($portable_path -eq "") {
        if (!$noprompt) {
            $portable_path = Read-Host -Prompt "Type the path to your portable Blender "
        }
        else {
            throw "You need to give the path to your portable Blender (-help for help)."
        }
    }
    $blender_executable = [IO.Path]::Combine($portable_path, "blender.exe")
    if (-not (Test-Path $blender_executable)) 
    {
        throw [System.IO.FileNotFoundException] "Blender could not be found as a portable directory at $portable_path."
    }
    $blender_version = (((cmd.exe /c $blender_executable -v) | Out-String) -split '\n')[0] 
    $blender_version = ($blender_version -split ' ')[1] -split '\.'
    $blender_version = $blender_version[0] + "." + $blender_version[1]
    $python_executable = (Get-ChildItem -Path ([IO.Path]::Combine($portable_path, $blender_version, "python", "bin", "python*.exe"))).FullName
    Install-Pip
    Install
}

try {
    if($help)
    {
        Get-Help
    } elseif ($installer)
    {
        Installer
    } elseif ($portable)
    {
        Portable
    } else 
    {
        if (! $noprompt) {
            if (ConvertTo-Boolean -Variable (Read-Host -Prompt "Do you want to install the Blender plugin for the Kitsu Publisher for Blender installer installation? (Y/N)")) {
                Installer
            }
            elseif (ConvertTo-Boolean -Variable (Read-Host -Prompt "Do you want to install the Blender plugin for the Kitsu Publisher for Blender portable? (Y/N)")) {
                Portable
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
    if (! $noprompt) {
        Read-Host -Prompt "Press enter to finish"
    }
}