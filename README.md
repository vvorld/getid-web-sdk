# GetID WEB SDK

## Table of contents
*   [Overview](#overview)
*   [Getting started](#getting-started)
    *   [Requirements](#requirements)
    *   [Obtaining an API key](#obtaining-an-api-key)
*   [Installation](#installation)
    *   [Obtaining JWT](#obtaining-jwt)
    *   [HTML markup](#html-markup)
*   [Initialization](#initialization)
*   [Customization](#customization)
    *   [Container id](#container-id)
    *   [Metadata](#metadata)
    *   [Flow](#flow)
*   [Components](#components)
    *   [Form](#form)
    *   [Liveness](#liveness)
    *   [Document photo](#documentphoto)
    *   [Selfie](#selfie)
    *   [Thank you](#thank-you)
*   [Verification Types](#verification-types)
*   [Callbacks](#callbacks)
*   [Tokenized url](#tokenized-url)
*   [External libraries](#external-libraries)

## Overview
This SDK provides a configurable widget which will allow your users to capture their personal data 
and/or face/id documents photos in order to verify their identity.

For the documentation of previous versions please refer to [old readme](https://github.com/vvorld/getid-web-sdk/blob/v5/README.md)

In order to make it work you will need access to GetID api. Please get in touch with our [integration team](mailto:support@getid.ee?subject=[GitHub]%20Integration%20with%20GetID).


## Getting started
### Requirements
- browsers and features we support: 
            
| OS | Browser | Version | Photos/Liveness | 
| --- | --- | --- | --- |
| iOS | Safari | 13 or higher | ✔️ |
| iOS | Chrome | 84 or higher | ― |
| iOS | Firefox | 27 or higher| ― |
| Android | Chrome | 83 or higher | ✔️ |
| Android | Samsung Internet | 12 or higher | ✔️ |
| Android | Firefox | 68 or higher | ✔️ |
| Android | Native | 12 or higher | ― |
| Android | UC | 13 or higher | ― |
| Android | Opera | 58 or higher | ✔️ |
| Android | Web browser  | 3 or higher | ― |
| Desktop mac | Safari | 13 or higher | ✔️ |
| Desktop mac | Chrome | 83 or higher | ✔️ |
| Desktop mac | Firefox | 78 or higher | ✔️ |
| Desktop mac | Opera | 69 or higher | ✔️ |
| Desktop mac | Edge | 83 or higher | ✔️ |
| Windows | Edge | 83 or higher | ✔️ |
| Windows | Chrome | 83 or higher | ✔️ |
| Windows | Opera | 69 or higher | ✔️ |
| Windows | Firefox | 78 or higher | ✔️ |
    
### Obtaining an API key
In order to start using GetID SDK, you will need an **SDK KEY** and **API URL**.
Before you start please go to the admin panel and create a flow. You should define the **FLOW_NAME** into configuration


Both can be found and modified either through your GetID admin panel or via contacting our 
[integration support](mailto:support@getid.ee?subject=[GitHub]%20Obtaining%20GetID%20credentials).

[Contacts](https://getid.ee/contact-us/)
## Installation

###  Including the library

#### CDN

Include sdk link as regular script tag. 
The latest stable build can be found in example snippet below.

``` html
<script src='https://cdn.getid.cloud/sdk/getid-web-sdk-v6.min.js'></script>
```


Script loads the widget via window object along with sdk config and jwt token.
```js
window.getidWebSdk.init(config);
```

#### NPM launcher

```bash
npm i getid-launcher
```

Create element in DOM where SDK should be included:
```html
<div id='getid-component'>
```
Import *init* function from launcher package and init the sdk

```js
import { init } from 'getid-launcher';
const config = {
    flowName: 'YOUR_FLOW_NAME',
    apiUrl: 'YOUR_API_URL',
    sdkKey: 'YOUR_SDK_KEY',
    customerId: 'customer id',
    metadata: {},
    containerId: 'getid-component',
    locale: 'en',
    profile: [{
        value: 'Jon',
        category: 'First name',
    }, {
        value: 'Dow',
        category: 'Last name',
    }],
    onComplete({ applicationId }) {
        alert(id);
    },
    onFail({ code, message }) {
        console.log(code, message);
    },
};

init(config);

```
You can specify the sdkKey options, or you can get the JWT token and pass it for authorization

config example for authorization via sdkKey:
```js
const config = {
  sdkKey: 'YOUR_SDK_KEY',
  flowName: 'YOUR_FLOW_NAME',
  apiUrl: 'YOUR_API_URL',
  metadata: {},
  containerId: 'getid-component',
  locale: 'en',
  profile: [{
      value: 'Jon',
      category: 'First name',
  }, {
      value: 'Dow',
      category: 'Last name',
  }],
  onComplete({ applicationId }) {
      alert(applicationId);
  },
  onFail({ code, message }) {
      console.log(code, message);
  },
};
```
configuration example for authorization with JWT

```js
const response = await fetch(`${apiUrl}/sdk/v2/token`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-sdk-key': sdkKey,
  },
  body: JSON.stringify({ customerId }),
})
const jwt = (await response.json())['token']
```

```js
const config = {
  jwt,
  flowName: 'YOUR_FLOW_NAME',
  apiUrl: 'YOUR_API_URL',
  metadata: {},
  containerId: 'getid-component',
  locale: 'en',
  profile: [{
      value: 'Jon',
      category: 'First name',
  }, {
      value: 'Dow',
      category: 'Last name',
  }],
  onComplete({ applicationId }) {
      alert(applicationId);
  },
  onFail({ code, message }) {
      alert(code, message);
  },
};
```

#### Obtaining JWT
For security reasons, you will need to generate and include a short-lived JSON Web Token (JWT) every 
time you initialize the SDK. 
To generate JWT make a post request with sdk key in header on your designated api url:

```shell
$ curl -H "Content-Type: application/json"  -H "x-sdk-key: SDK_KEY"  -X POST API_URL/sdk/v2/token
```

**Customer ID (optional)**


In case you don't want your clients to complete verification more than once or for any other identification purposes you can pass customerId param when generating jwt token or include the customerId property directly into config if you prefer sdkKey authorization to JWT

``` shell script
$ curl -d '{"customerId":"value"}' -H "Content-Type: application/json"  -H "x-sdk-key: SDK_KEY"  -X POST API_URL/sdk/v1/token
```

**NB!** Token expires 60 minutes after creation. (length of a token's life is a matter of configuration).

--------------

### HTML markup
Please place an empty div element with a respective id in your html for the component to mount into.
``` html
<div id='getid-component'></div>
```

It is possible to configure sdk flow in admin panel.

## Initialization

_Now all has been set for sdk initialization._ 
``` js
const config = {
  apiUrl: 'YOUR_URL',
  sdkKey: 'YOUR_SDK_KEY',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME'
}; 
window.getidWebSdk.init(config);
```
This a simple example on how config should look like. Please go through README to learn how to customize the widget even further.

## Metadata

### ExternalID
You can specify *externalId* into metadata to match id from your DB and application

```js
metadata: {
  externalId: 'ID_FROM_YOUR_DB',
},
```
### Labels

It is possible to specify custom key/value storage into metadata *labels* - object with max 30 properties

it's will be added into application result.

metadata example:
```js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME',
  metadata: {
    externalId: 'ID_FROM_YOUR_DB',
    labels: {
      'my-custom-meta-name-1': 'custom-value-1',
      'my-custom-meta-name-2': 'custom-value-2',
    }
  }
}; 
```
## Customization


### Container ID
This can be anything you want, just make sure for it to match the one being specified in HTML div element.


### mode
SDK has two modes:
* popup
* inline
```js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME',
  mode: 'popup'
};
```

### Locale
It is possible to predefine the locale according locale format https://www.localeplanet.com/icu/

Example:
```js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME',
  locale: 'en'
};
```


### Profile
It's possible to pre-fill the profile form data by setting profile property in config.

example 
```js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME',
  profile: [
    { category: 'First name', value: 'Jon' },
    { category: 'Last name', value: 'Dow' },
    { category: 'Date of birth', value: '2010-10-10' },
    { category: 'Address', value: 'France le croissant 4-27' },
    { category: 'Date of expiry', value: '2026-02-15' },
    { category: 'Date of issue', value: '2021-02-15' },
    { category: 'Document number', value: '4114414141' },
    { category: 'Email', value: 'email@email.com' },
    { category: 'Gender', value: 'male' },
    { category: 'Nationality', value: 'AZE' },
    { category: 'Personal number', value: '123123123123' },
    { category: 'Any custom category', value: '123123123123' },
  ],
};
```
Form fields and pre-filled fields will be sent to the server and will be compared with extracted data from a document.

Profile checking is provided for those fields:

* First name
* Last name
* Date of birth
* Issue country
* Gender
* Document type
* Date of issue
* Date of expiry
* Nationality
* Nationality code
* Document number
* Place of birth
* Place of issue

### Visual Appearance

It is possible to customize the styles by two ways:
- Inserting the custom css string (use injectCSS string in config)
- Using CSS variables (use styles object in config)


Example of custom styles:
```js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: 'YOUR_FLOW_NAME',
  injectCSS: 'p {color: red; text-align: center;}',
  styles: {
   '--getid-primary-text-color': 'red'
  }
}
```
Custom variables is a more flexible and convenient way. List of variables:
```
    --getid-primary-text-color
    --getid-secondary-text-color
    --getid-primary-background-color
    --getid-accent-color
    --getid-contrasting-to-accent-color
    --getid-border-color
    --getid-primary-button-text-color
    --getid-primary-button-background-color
    --getid-primary-button-hover-background-color
    --getid-secondary-button-text-color
    --getid-secondary-button-background-color
    --getid-secondary-button-hover-background-color
    --getid-link-button-text-color
    --getid-link-button-hover-text-color
    --getid-button-box-shadow-hover
    --getid-button-border-radius
    --getid-input-placeholder-color
    --getid-input-text-color
    --getid-input-background-color
    --getid-input-border-color
    --getid-input-hover-border-color
    --getid-input-active-border-color
    --getid-input-border-radius
    --getid-error-color
    --getid-success-color
    --getid-warning-color
    --getid-header-font-size
    --getid-subheader-font-size
    --getid-button-font-size
    --getid-font-size
    --getid-small-font-size
    --getid-font-weight
    --getid-bold-font-weight
    --getid-button-font-weight
    --getid-transition
    --getid-font-family
    --getid-container-max-width
    --getid-container-min-width
    --getid-container-border-radius
    --getid-container-overlay-background-color
    --getid-camera-overlay-background-color
    --getid-camera-overlay-text-color
```



### Callbacks
All callbacks are optional.

- **onComplete** = ({ applicationId }) => callback executed on ThankYou view after the client has been successfully submitted their data for verification. Accepts verification id as param.
- **onFail** = ({code, message}) => callback executed on fail event: 
    - Client failed to submit data successfully (server responded with anything but 200) - in this case callback will be called upon clicking on CAT
    - Widget failed to render successfully - in this case callback will be called automatically
accepts Error object as params, so it's up to you to handle this accordingly if needed.

Possible errors:
```
Before render
{code: "internal", message: "Internal error"} 
{code: "sdkkey_invalid", message: "Invalid SDK key"} 
{code: "apiurl_mismatch", message: "Correct API url was not provided"}
{code: "configuration_not_found", message: "Configuration not found"} 
{code: "token_malformed", message: "Incorrect link"}
{code: "token_mismatch", message: "JWT token was mot provided"}

After render
{code: "schema_mismatch", message: "Please use https schema"}
{code: "api_version_mismatch", message: "Your SDK version not compatible with the current API version"}
{code: "token_invalid", message: "Invalid token. Maybe, the session is expired."}
{code: "token_expired", message: "'The link is no longer valid'"}
{code: "customerid_exists", message: "An application with this customerId already exists."}
{code: "browser_not_supported", message: "Browser is not supported"}
{code: "no_camera", message: "Your device has no camera"}
{code: "camera_not_allowed", message: "Failed to access your camera"}
{code: "camera_generic", message: "Failed to access your camera"}
{code: "file_type", message: "We do not support this format"}
{code: "verification_fail", message: "Cannot create application"}
{code: "bad"_request, message: "Bad request"}
{code: "server_unavailable", message: "Server is unavailable"}
```

## External libraries

Current software is using external libraries, which are released under MIT license:

```
 Copyright (c) 2020 GetID

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
```
