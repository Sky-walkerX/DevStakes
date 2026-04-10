Set-Location $PSScriptRoot
$msg = Read-Host "Enter commit message"
git pull origin main
git add .
git commit -m "$msg"
git push