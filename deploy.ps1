$name = $Env:AZURE_STORAGE_ACCOUNT
$key = $Env:AZURE_STORAGE_KEY
$serverUrl = $Env:SERVER_URL
$clientId = $Env:CLIENT_ID
$tenantId = $Env:TENANT_ID
$appUrl = $Env:APP_URL

$azCfgFileName = 'az.json';
$path = "$PSScriptRoot\$($azCfgFileName)"
if([System.IO.File]::Exists($path)) {
    $storage = Get-Content $path | Out-String | ConvertFrom-Json

    $name = $storage.name
    $key = $storage.key
    $appUrl = $storage.appUrl
    $serverUrl = $storage.serverUrl
    $clientId = $storage.clientId
    $tenantId = $storage.tenantId
}

# Load config
$config = Get-Content -Path "dist/rep-portal-envelopes/config.json" | ConvertFrom-Json
Write-host 'Initial config'
Write-Host ($config | ConvertTo-Json )
if ($serverUrl) {
  $config.session.serverUrl = $serverUrl + "/repportal/"
  $config.session.schoolFinderUrl = $serverUrl + "/fragment/"
  $config.msal.configAngular.protectedResourceMap[0][0] = $serverUrl + "/repportal/"
}

if ($clientId) {
  $config.msal.config.auth.clientId = $clientId
  $config.msal.configAngular.protectedResourceMap[0][1][0] = $clientId + "/.default"
}

if ($tenantId) {
  $config.msal.config.auth.authority = "https://login.microsoftonline.com/" + $tenantId + "/"
} else {
  $config.msal.config.auth.authority = "https://login.microsoftonline.com/" + "common/"
}

if ($appUrl) {
    $config.msal.config.auth.redirectUri = $appUrl
    $config.msal.config.auth.postLogoutRedirectUri = $appUrl
}

# Save config
$config | ConvertTo-Json -Depth 100 | Set-Content -Path "dist/rep-portal-envelopes/config.json"
Write-host 'Result config'
Write-Host ($config | ConvertTo-Json )
az storage blob delete-batch -s '$web' --pattern 'envelopes/*' --account-name $name --account-key $key
az storage blob upload-batch -s './dist/rep-portal-envelopes' -d '$web/envelopes' --account-name $name --account-key $key
