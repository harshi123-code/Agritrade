$securePassword = Read-Host 'Enter the MySQL root password for agritrade' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    $env:DB_USERNAME = 'root'
    $env:DB_URL = 'jdbc:mysql://localhost:3306/agritrade?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
    $env:SPRING_DATASOURCE_URL = $env:DB_URL
    $env:SPRING_DATASOURCE_USERNAME = $env:DB_USERNAME
    $env:SPRING_DATASOURCE_PASSWORD = $env:DB_PASSWORD
    Push-Location $PSScriptRoot
    & (Join-Path $PSScriptRoot 'mvnw.cmd') spring-boot:run
}
finally {
    Pop-Location -ErrorAction SilentlyContinue
    Remove-Item Env:DB_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:DB_USERNAME -ErrorAction SilentlyContinue
    Remove-Item Env:DB_URL -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_USERNAME -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
