# GetID WEB SDK

## Table of contents
*   [Overview](#overview)
*   [Getting started](#getting-started)
    *   [Requirements](#requirements)
    *   [Camera usage description](#camera-usage-description)
*   [Installation](#installation)
    *   [Obtaining JWT](#obtaining-jwt)
    *   [HTML markup](#html-markup)
*   [Initializing](#initializing)
*   [Customization](#customization)
    *   [Callbacks](#callbacks)
    *   [Flow](#flow)
    *   [Fields](#fields)
    *   [Verification Types](#verification-types)
    *   [Supported countries and types of documents](#supported-countries-and-types-of-documents)
    *   [Form grid](#form-grid)
*   [Localization](#localization)
    *   [Dictionary](#dictionary)
*   [External libraries](#external-libraries)

## Overview
The SDK provides functionality to upload user personal data to GetID server. 
Also, this SDK provides a possibility to add a customisable form component 
for users to enter text information about themselves or/and 
upload (capture) ids and face photos.

## Getting started
### Requirements
- node 12.15.0
- browsers and features we support: 
            
| OS | Browser | photos | liveness |
| --- | --- | --- | --- |
| iOS | Chrome, last versions | ✔️ | ― |
| iOS | Safari, last versions | ✔️ | ― |
| iOS | Firefox, last versions | ✔️ | ― |
| Android | Chrome | ✔️ | ― |
| Android | Samsung Internet | ✔️ | ― |
| Android | Firefox | ✔️ | ― |
| Android | Native | ✔️ | ― |
| Android | UC | ✔️ | ― |
| Android | Opera | ✔️ | ― |
| Android | Web browser  | ✔️ | ― |
| Desktop mac | Chrome | ✔️ | ✔️ |
| Desktop mac | Safari | ✔️ | ― |
| Desktop mac | Firefox | ✔️ | ✔️ |
| Desktop mac | Opera | ✔️ | ✔️ |
| Desktop mac | Edge | ✔️ | ✔️ |
| Windows | Edge | ✔️ | ― |
| Windows | Chrome | ✔️ | ✔️ |
| Windows | Opera | ✔️ | ✔️ |
| Windows | Firefox | ✔️ | ✔️ |
    
### Obtaining an API key
In order to start using GetID SDK, you will need an API key and API url. You can get and set your key and url in your 
GetID Dashboard.
### Camera usage description
The SDK uses the camera for capturing photos during verification. 
The app is responsible for describing the reason for using the camera. 
For better verification try to hold the document exactly within the frame 
while capturing photo. Do not place document in inverted alignment or at an 
angle. Please avoid too dark or bright lightning. 
In process of capturing selfie be sure that there is no more than one face in a photo.
## Installation
- NPM style import
```sh
npm install --save getid-web-sdk
```
``` js
// ES6 module import
import {init} from 'getid-web-sdk'
```

``` js
// commonjs style require
const getId = require('getid-web-sdk')
```

- CDN
include sdk as regular script tag. (please contact technical support for CDN link)
``` html
<script src='getid-web-sdk-vx.x.x.min.js'></script>
```

In case you want to automatically keep up with latest version of sdk cdn script, we advice to use our `launcher.js`
Just include the script in your html page, it will insert the latest script into the <head> tag of your page.
Example:
``` html
<script src='launcher.min.js'></script>
```

it will handle versioning and sdk script loading and init. 
Load it the same way you would load with sdk init

```js
window.getidWebSdk.init(config, token);
```

### Obtaining JWT
For security reasons, you will need to generate and include a short-lived JSON Web Token (JWT) every 
time you initialise the SDK. 
To generate JWT make a post request with api key in header on your designated api url:
Make sure to pass the whole response object on `init` function as `token` param

### Customer Id (optional)
In case you don't want your clients to complete verification more than once you can pass customerId param when generating jwt token.

``` js
import { init } from 'getid-web-sdk'
const config = {_your_config_here_}

const token = post YOUR_SDK_SERVER_BACKEND_URL/sdk/token
headers: {
    apiKey: YOUR_API_KEY
},
body: {
    customerId: YOUR_CUSTOMER_ID
}
init(config, token);
```
In case you are using our launcher script, initialize sdk like you would with simple sdk script
```js
window.getidWebSdk.init(config, token);
```
--------------
Also, you can use SDK built-in function `createPublicTokenProvider` that you can import along with `init`.
In this scenario, apiKey must be passed to `init` method along with SDK config and API url.

``` js
import { init, createPublicTokenProvider } from 'getid-web-sdk'
const config = {_your_config_here_}
const token = createPublicTokenProvider(config.apiUrl, config.apiKey, customerId)
init(config, token);
```

In case you are using our launcher script, 
`createPublicTokenProvider` will be accessible via `window.getidWebSdk` object.
```js
const config = {_your_config_here_}
const token = window.getidWebSdk.createPublicTokenProvider(config.apiUrl, config.apiKey, customerId)
window.getidWebSdk.init(config, token);
```

Our team strongly encourages making a JWT call using server-side code and first option of obtaining a .


* Tokens expire 90 minutes after creation. (length of a token's life is a matter of configuration)

### HTML markup
In case you are planning to use getId form, place an empty element for the interface to mount itself on:
``` html
<div id='getid-component'></div>
```

Place the snippet in the bottom of your index file.

## Initializing

_In order to initialize an SDK instance, simply call:_ 
``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
}; 

const token = _your_jwt_here_;
init(config, token);
```

_For more sophisticated initialization with more customization check this example below:_

``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  flow: [ { component: ['Form'] },
          { component: ['ThankYou'] } ],
  containerId: 'getid-component',
  fields: [
      {
        type: 'text',
        title: 'First Name',
        value: 'John',
        required: false
      },
      { 
        type: 'text',
        title: 'Last Name',
        value: 'Doe',
      },
      { 
        type: 'text',
        title: 'Email',
      },
  ],
  onComplete: function(data) {
    console.log("everything is complete" + data)
  },
   onFail: function(error) {
   console.log("something went wrong" + error)
  }
}; 

const token = _your_jwt_here_;
init(config, token);
```

## Customization

### Callbacks
All callbacks are optional, you can specify yours on `init` call. 
getId web SDK allows several callbacks:
- **onComplete** function - callback executed on Success event (client has been successfully verified)
- **onError** function - callback executed on fail event (client has not been successfully verified) - we will tell you why in `error.message` - now it's up to you to handle this accordingly
- **OnExists** function - callback executed when we detect existing application with id that was passed on init

Example:
``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  onComplete: function(data) {
    console.log("everything is complete" + data)
  },
   onFail: function(error) {
   console.log("something went wrong" + error)
  }
}; 

const token = _your_jwt_here_;
init(config, token);
```
### Flow
You can customize which steps that will be present in your getId widget.
Available: 
- _Consent_ - Client gives their consent to their Personal data processing.
- _Form_ - Form with basic personal data fields (first name, last name, email, gender etc)
- _CountryAndDocument_ - country of document and document type selection view
- _IdCapture_ - web camera view. can consist of up to 2 views, depending on the type of document.
i.e in case of id card, there are two views: frond and back side.
- _IdSelfie_ - web camera view. user will have to take a selfie.
- _ThankYou_ - Thank you page, informs client about successful state of the validation.  

Example: 

``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flow: [ { component: ['Form'] },
          { component: ['CountryAndDocument'] },
          { component: ['ThankYou'] } ],
}; 

const token = _your_jwt_here_;
init(config, token);
```

### Fields
On form view, you can choose which fields to show to client.

Currently, we support 4 input types:
- text: plain `string`
- date: Date represented as a `string` in ISO 8601 format
- file: file in jpg or png format
- select: `string` in ISO 3166-1 alpha-2 format ([Wiki](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2))
- checkbox: boolean

Optionally, you can pre-populate some fields by known values. Pass the values according to formats listed in the table above.
You can set field's `required` option. All fields are set as `required: true` by default.

Also you can set already prefilled invisible fields by adding `hidden` flag to each field you want ot hide. 
Those fields will be not accessible for client, but included in total form result

Example: 
``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flow: [ { component: ['Form'] },
          { component: ['CountryAndDocument'] },
          { component: ['ThankYou'] } ],
  fields: [
     // pre-populated and not visible
      {
        type: 'text',
        title: 'First Name',
        value: 'John',
        hidden: true,
        required: false
      },
      // this one client will have to fill in
      {
        type: 'select',
        title: 'Country',
        required: true
      },
  ],
}; 

const token = _your_jwt_here_;
init(config, token);
```

### Verification types
You may also configure desirable types of verification by simple passing a
``` verificationTypes``` (array of strings) property in config. 

Example: 
``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  verificationTypes: ['F', 'E'],
}; 

const token = _your_jwt_here_;
init(config, token);
```
Where 'F' stands for 'face matching' and 'E' stands for 'extraction'.

### Supported countries and types of documents
In process of passing flow you have to choose one of the offered document types. Depending on country user is allowed to select one or other document type. 
You can pass user's document data via sdk init method.
This will pre-fill document and country view fields with passed params.
In case passed values do not match getId supported list of countries and/or documents, 
sdk will proceed with empty values, and client will be able to try to select other options.
 
Console will show error `This country is not supported`
or `This document type is not supported.`  
 
For now we mostly support these documents:
 - passport, 
 - id-card, 
 - visa, 
 - driving-licence, 
 - residence-permit,
 - internal-passport.
 
Example: 
 ``` js
 import { init } from 'getid-web-sdk'
 const config = {
   apiUrl: 'YOUR_URL',
   containerId: 'getid-component',
   flow: [ { component: ['Form'] },
           { component: ['CountryAndDocument'] },
           { component: ['ThankYou'] } ],
   documentData: [
    {
      name: 'Country',
      value: 'ee',
    },
    {
      name: 'DocumentType',
      value: 'passport',
    },
  ],
 }; 
 
 const token = _your_jwt_here_;
 init(config, token);
 ```

For some documents (`internal-passport`) you will have to capture photo from both sides (front and back).

### Form grid
You can also specify form width within the config

Types are: `narrow` or `wide`

Example: 
``` js
 import { init } from 'getid-web-sdk'
 const config = {
   apiUrl: 'YOUR_URL',
   containerId: 'getid-component',
   flow: [ { component: ['Form'] },
           { component: ['CountryAndDocument'] },
           { component: ['ThankYou'] } ],
   formType: 'narrow',
 }; 
 
 const token = _your_jwt_here_;
 init(config, token);
```

## Localization
Sdk can be localised. 
Please contact technical support for more details.

### Dictionary
Example of using `dictionary` key.

``` js
 import { init } from 'getid-web-sdk'
 const config = {
   apiUrl: 'YOUR_URL',
   dictionary: '_lang_key_',
   flow: [ { component: ['Form'] },
           { component: ['CountryAndDocument'] },
           { component: ['ThankYou'] } ],
 }; 
 
 const token = _your_jwt_here_;
 init(config, token);
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
