Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$rootPath = $PSScriptRoot
$zipPath = Join-Path $rootPath "Atelier-Luxe-Shopify-Theme.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
$folders = @('assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates')

foreach ($folder in $folders) {
    $folderPath = Join-Path $rootPath $folder
    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -Recurse -File
        foreach ($file in $files) {
            # Compute relative path from theme root with forward slashes
            $relPath = $file.FullName.Substring($rootPath.Length + 1).Replace("\", "/")
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal)
            Write-Host "Added: $relPath"
        }
    }
}

$zip.Dispose()
Write-Host "ZIP packaging complete: $zipPath"
