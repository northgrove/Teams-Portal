# Portal protected by IDporten from Microsoft Teams
#### Verify identity by doing an authentication with IDporten

## not for production
This application is ment for demonstration and example use only. It is NOT production ready code. Every single security measure that could be buypassed is buypassed.

## the application
The application use Azure AD B2C to integrate with IDporten. That means that Azure AD B2C also could easly be integrated with any other ID provider.

## Prerequisites
1. Registered App in Azure AD B2C
2. .env file with:
   ```
    AZURECONFIG_CLIENTID='<application_id from aad app>'
    AZURECONFIG_CLIENTSECRET='<KEY from aad app>'
    AZURECONFIG_CALLBACKURI='http://localhost:8081/auth/openid/callback'
    COOKIE_KEY1='<32bit cookie encryption key>'
    COOKIE_KEY2='<32bit cookie encryption key>'
    PASSPORTCOOKIE_KEY1='<32bit cookie encryption key>'
    PASSPORTCOOKIE_KEY2='<32bit cookie encryption key>'
    PASSPORTCOOKIE_KEY3='<12bit cookie encryption key>'
    PASSPORTCOOKIE_KEY4='<12bit cookie encryption key>'
    ```
3. A valid IDporten test user

## Run the application
```
run from .\Teams-Portal\:

npm install
npm start
```

URL: http://localhost:8080
