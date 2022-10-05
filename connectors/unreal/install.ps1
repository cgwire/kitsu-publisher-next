 param (
    [switch]$Help = $false,
    [switch]$Installer = $false,
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
    Write-Output "Script to install Unreal Editor plugin for the Kitsu Publisher."
    Write-Output ""
    Write-Output "Usage: install.ps1 [options]"
    Write-Output "options:"
    Write-Output "-help"
    Write-Output "  Print this help."
    Write-Output "-installer"
    Write-Output "  Install the plugin for an installer installation."
    Write-Output "-noprompt"
    Write-Output "  Disable the ending prompt."
}

function Install-Pip {
    Write-Output "Installation of pip."
    & $PythonExecutable -m ensurepip --upgrade
    Write-Output "Pip installed."
}

function Install-Plugin {
    Write-Output "Installation of the plugin."
    $PluginPath = [IO.Path]::Combine($PSScriptRoot, "KitsuPublisher")
    & $PythonExecutable -m pip install dccutils_server -t ([IO.Path]::Combine($PluginPath, "Content/Python/Lib/site-packages")) -U
    $UnrealPluginPath = [IO.Path]::Combine($InstallLocationUnreal, "Engine/Plugins")
    $PublisherUnrealPluginPath = [IO.Path]::Combine($UnrealPluginPath, "KitsuPublisher")
    if (Test-Path $PublisherUnrealPluginPath) {
        Remove-Item -LiteralPath $PublisherUnrealPluginPath -Force -Recurse
    }
    Copy-Item -Path $PluginPath -Destination $UnrealPluginPath -Recurse
    Write-Output "Plugin for Unreal Editor installed in $PublisherUnrealPluginPath"
}

function Installer-Installation {
    
    $RegisteredInstallations = @('HKLM:\SOFTWARE\EpicGames\Unreal Engine\')
    
    $InstallLocationsUnreal = [System.Collections.ArrayList]::new()
    foreach ($key in (Get-ChildItem $RegisteredInstallations)) {
            $UnrealVersion = $key | Split-Path -Leaf
            $UnrealVersion = $UnrealVersion -split '\.'
            if ([int]$UnrealVersion[0] -ge 5) {
                [void]$InstallLocationsUnreal.Add($key.getValue('InstalledDirectory'))
            }
        }

    if ($InstallLocationsUnreal.count -eq 0) {
        throw "Unreal Editor is not installed on this computer." 
    }
    foreach ($InstallLocationUnreal in $InstallLocationsUnreal) {
        Write-Output "Found installer installation of Unreal Editor in $InstallLocation."
            $PythonExecutable = [IO.Path]::Combine($InstallLocationUnreal, "Engine\Binaries\ThirdParty\Python3\Win64\python.exe")
            Install-Pip
            Install-Plugin
            break
    }
}

try {
    if($Help)
    {
        Get-Help
    } elseif ($Installer)
    {
        Installer-Installation
    } else 
    {
        if (! $NoPrompt) {
            if (ConvertTo-Boolean -Variable (Read-Host -Prompt "Do you want to install the Unreal Editor plugin for the Kitsu Publisher for Unreal Editor installer installation? (Y/N)")) {
                Installer-Installation
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