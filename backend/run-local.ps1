$securePassword = Read-Host 'Enter the MySQL root password for agritrade' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$originalAiApiKey = $env:APP_AI_API_KEY
$originalAiModel = $env:APP_AI_MODEL
$originalAiBaseUrl = $env:APP_AI_BASE_URL

try {
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    if ([string]::IsNullOrWhiteSpace($originalAiApiKey)) { $env:APP_AI_API_KEY = 'ollama' }
    if ([string]::IsNullOrWhiteSpace($originalAiModel)) { $env:APP_AI_MODEL = 'llama3.2:1b' }
    if ([string]::IsNullOrWhiteSpace($originalAiBaseUrl)) { $env:APP_AI_BASE_URL = 'http://localhost:11434/v1' }
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
    foreach ($setting in @(
        @{ Name = 'APP_AI_API_KEY'; Value = $originalAiApiKey },
        @{ Name = 'APP_AI_MODEL'; Value = $originalAiModel },
        @{ Name = 'APP_AI_BASE_URL'; Value = $originalAiBaseUrl }
    )) {
        if ($null -ne $setting.Value) {
            Set-Item -Path "Env:$($setting.Name)" -Value $setting.Value
        } else {
            Remove-Item -Path "Env:$($setting.Name)" -ErrorAction SilentlyContinue
        }
    }
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
