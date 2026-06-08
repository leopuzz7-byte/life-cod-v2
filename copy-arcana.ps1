$source = "$env:USERPROFILE\Downloads"
$dest = "$PSScriptRoot\src\assets\arcana"

$copied = 0
$missing = @()

for ($i = 1; $i -le 22; $i++) {
    $file = "arcana-$i.png"
    $src = Join-Path $source $file
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $dest $file) -Force
        Write-Host "OK: $file"
        $copied++
    } else {
        $missing += $file
        Write-Host "MISSING: $file"
    }
}

Write-Host ""
Write-Host "Copied: $copied / 22"
if ($missing.Count -gt 0) {
    Write-Host "Missing files: $($missing -join ', ')"
}
Write-Host "Done! Press any key..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
