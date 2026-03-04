# Script para resetar o banco de dados e migrações
# Execute no PowerShell dentro do diretório backend

Write-Host "🗑️  Removendo banco de dados SQLite..."
if (Test-Path "db.sqlite3") {
    Remove-Item "db.sqlite3" -Force
    Write-Host "   ✅ db.sqlite3 removido"
} else {
    Write-Host "   ℹ️  db.sqlite3 não encontrado"
}

Write-Host ""
Write-Host "🗑️  Removendo migrações antigas..."
$migrationsPath = "core\migrations"
Get-ChildItem -Path $migrationsPath -Filter "*.py" | Where-Object { $_.Name -ne "__init__.py" } | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "   ✅ Removido: $($_.Name)"
}

# Limpar __pycache__
if (Test-Path "$migrationsPath\__pycache__") {
    Remove-Item "$migrationsPath\__pycache__" -Recurse -Force
    Write-Host "   ✅ __pycache__ removido"
}

Write-Host ""
Write-Host "✨ Limpeza concluída!"
Write-Host ""
Write-Host "Agora execute:"
Write-Host "   python manage.py makemigrations core"
Write-Host "   python manage.py migrate"
Write-Host "   python manage.py createsuperuser"
Write-Host "   python manage.py runserver"
