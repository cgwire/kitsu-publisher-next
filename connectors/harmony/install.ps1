param (
    [switch]$help = $false,
    [switch]$installer = $false
 )

$open_harmony_zip_url = "https://github.com/cfourney/OpenHarmony/archive/refs/tags/0.10.3.zip"
$harmony_app_data_folder = [IO.Path]::Combine($env:APPDATA, "Toon Boom Animation")

function Get-Help {
    # Display Help
    Write-Output "Script to install Toon Boom Harmony plugin for the Kitsu Publisher."
    Write-Output ""
    Write-Output "Usage: install.ps1 [options]"
    Write-Output "options:"
    Write-Output "-help"
    Write-Output "  Print this help."
    Write-Output "-installer"
    Write-Output "  Install the plugin for an installer installation."
}

function Download-Install-OpenHarmony {
    Write-Output "Downloading openHarmony."
    $open_harmony_zip = [IO.Path]::Combine($env:TMP, "openHarmony.zip")
    Invoke-WebRequest $open_harmony_zip_url -OutFile $open_harmony_zip
    Write-Output "OpenHarmony downloaded."
    $open_harmony_folder = [IO.Path]::Combine($env:APPDATA, "Toon Boom Animation", "openHarmony")
    Write-Output "Extracting openHarmony."
    Remove-Item $open_harmony_folder -Recurse -ErrorAction Ignore
    Expand-Archive $open_harmony_zip -DestinationPath $open_harmony_folder
    Write-Output "OpenHarmony extracted in $open_harmony_folder."
    $open_harmony_folder = (Get-ChildItem -Path ([IO.Path]::Combine($open_harmony_folder, "OpenHarmony-*"))).FullName
    foreach ($key in $UninstallKeysHarmony) {
        $split_for_subdir = ($key.getValue("DisplayName") -split " ")
        $subdir_harmony_appdata = $split_for_subdir[0] + " " + $split_for_subdir[1] + " " + $split_for_subdir[2] + " " + $split_for_subdir[4]
        $scripts_path_harmony_appdata = [IO.Path]::Combine($harmony_app_data_folder, $subdir_harmony_appdata, $key.getValue("VersionMajor").ToString()+"00-scripts")
        New-Item -ItemType Directory -Force -Path $scripts_path_harmony_appdata | Out-Null
        $content = "include(`"" + [IO.Path]::Combine($open_harmony_folder, "openHarmony.js") + "`");"
        $content = $content.Replace("\", "/")
        $file_with_content = [IO.Path]::Combine($scripts_path_harmony_appdata, "openHarmony.js")
        New-Item $file_with_content -ItemType File -Force -Value $content | Out-Null
        Write-Output "OpenHarmony installed in $file_with_content."
    }
}


if($help)
{
    Get-Help
} elseif ($installer)
{
    $UninstallKeys = @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
                    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'
                    )
    
    $UninstallKeysHarmony = [System.Collections.ArrayList]::new()
    foreach ($key in (Get-ChildItem $UninstallKeys)) {
        if ($key.getValue("DisplayName") -Like "Toon Boom Harmony *" ) {
            [void]$UninstallKeysHarmony.Add($key)
        }
    }

    if ($UninstallKeysHarmony.count -eq 0) {
        throw "Toon Boom Harmony is not installed on this computer." 
    }
    Download-Install-OpenHarmony

} else 
{
    throw "You need to specify a target (-help for help)."
}