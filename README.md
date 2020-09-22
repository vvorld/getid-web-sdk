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
This SDK provides a configurable widget which will allow your users to capture their personal data 
and/or face/id documents photos in order to verify their identity.

In order to make it work you will need access to GetID api. Please get in touch with our [integration team](mailto:support@getid.ee?subject=[GitHub]%20Integration%with%20GetID).


## Getting started
### Requirements
- browsers and features we support: 
            
| OS | Browser | Version | Photos | 
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
Both can be found and modified either through your GetID admin panel or via contacting our 
[integration support](mailto:support@getid.ee?subject=[GitHub]%20Obtaining%GetID%20credentials).

## Installation

#### Obtaining JWT
For security reasons, you will need to generate and include a short-lived JSON Web Token (JWT) every 
time you initialise the SDK. 
To generate JWT make a post request with sdk key in header on your designated api url:

``` shell script
$ curl -H "Content-Type: application/json"  -H "apiKey: SDK_KEY"  -X POST API_URL/v1/sdk/token
```

**Build-in function.**

Instead of making a request directly, you can also use function `createPublicTokenProvider`.
It will take care of the token request.
In this scenario, sdk key must be passed to `init` method along with SDK config and API url.

``` js
const token = window.getidWebSdk.createPublicTokenProvider(apiUrl, sdkKey);
window.getidWebSdk.init(config, token);
``` 

**Customer ID (optional)**

In case you don't want your clients to complete verification more than once or for any other identification purposes
you can pass customerId param when generating jwt token.

``` shell script
$ curl -d '{"customerId":"value"}' -H "Content-Type: application/json"  -H "apiKey: SDK_KEY"  -X POST API_URL/v1/sdk/token
```

or 
``` js
const token = window.getidWebSdk.createPublicTokenProvider(apiUrl, sdkKey, customerId);
window.getidWebSdk.init(config, token);
``` 

**NB!** Token expires 90 minutes after creation. (length of a token's life is a matter of configuration).

#### Including the library

- CDN

Include sdk link as regular script tag. 
The latest stable build can be found in example snippet below.

``` html
<script src='https://cdn.getid.cloud/sdk/getid-web-sdk-v5.0.0.min.js'></script>
```

In case you want to automatically keep up with the latest version of sdk cdn script, we advise to use our [`launcher.js`](src/launcher.js)
Just include the script in your html page, it will insert the latest script into the <head> tag of your page. It will handle versioning and sdk script loading and init. 
Example:
``` html
<script src='launcher.min.js'></script>
```

In both scenarios load the widget via window object along with sdk config and jwt token.
```js
window.getidWebSdk.init(config, token);
```

--------------

### HTML markup
Please place an empty div element with a respective id in your html for the component to mount into.
``` html
<div id='getid-component'></div>
```

## Initialization

_In order to initialize an SDK instance, simply call:_ 
``` js
import { init } from 'getid-web-sdk'
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  [{ component: ['ThankYou'] }],
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
        label: 'First Name',
        name: 'First Name',
        value: 'John',
        required: false
      },
      { 
        type: 'text',
        label: 'Last Name',
        name: 'Last Name',
        value: 'Doe',
        required: false
      },
      { 
        type: 'text',
        label: 'Email',
        name: 'Email',
        required: false
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

### Flow
Flow is required parameter. You can customize which steps that will be present in your getId widget.
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
Fields are required in case `Form` step is active. On form view, you can choose which fields to show to client.

Currently, we support 4 input types:
- text: plain `string`
- date: Date represented as a `string` in ISO 8601 format
- file: any format max 6MB
- select: `string` in ISO 3166-1 alpha-2 format ([Wiki](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2))
- checkbox: boolean

**_Important note:_**

If you want to add custom file fields on the form step, please refrain from using reserved field names such as:
- front
- back
- selfie
- selfie-video

These can only be used to send out 
document photos (front and back), 
selfie (selfie) and liveness recording (selfie video). 
Unless you want to use those file inputs to do just that, please opt for some other naming.

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

### Callbacks
All callbacks are optional, you can specify yours on `init` call. 
getId web SDK allows several callbacks:
- **onComplete** function - callback executed on Success event (client has been successfully verified)
- **onError** function - callback executed on fail event (client has not been successfully verified) - we will tell you why in `error.message` - now it's up to you to handle this accordingly
- **OnExists** function - callback executed when we detect existing application with id that was passed on init
- **onSortDocuments** function - callback executing for sorting or filtering supported documents list. Function takes two parameters: country - string in ALPHA-2 format(lowercase) and documents: array of supported document types for current country. You should return an array of desired document types(in desired order) for every country if you don't want to display some countries just return empty array.

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
  },
  onSortDocuments: function(coutry, documents) {
   const desiredCountries = ['cz', 'dk', 'es', 'hr', 'pl', 'at', 'be', 'bg', 'de', 'ee'];
   const desiredDocuments = ['id-card', 'passport', 'driving-licence', 'residence-permit'];

   if (desiredCountries.includes(country) return desiredDocuments;
   
   return [];
  }
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
  verificationTypes: ['F', 'E', 'W'],
}; 

const token = _your_jwt_here_;
init(config, token);
```
Where 'F' stands for 'face matching', 'E' stands for 'extraction' and 'W' stands for watchlists.

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
 - driving-licence, 
 - residence-permit.
 
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
