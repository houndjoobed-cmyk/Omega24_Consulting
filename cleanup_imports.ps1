$files = Get-ChildItem -Path "src/components/ui" -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Pattern to match "package@version" in imports
    # We look for 'from "package@version"' or "from 'package@version'"
    # regex: (from\s+["'])([^"']+)@\d+\.\d+\.\d+(["'])
    
    $newContent = $content -replace 'from\s+["'']([^"'']+)@\d+\.\d+\.\d+["'']', 'from "$1"'
    
    if ($content -ne $newContent) {
        Write-Host "Updating $($file.Name)"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}
Write-Host "Done stripping versions."
