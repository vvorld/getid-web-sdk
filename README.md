# GetID WEB SDK

## Table of contents
*   [Overview](#overview)
*   [Getting started](#getting-started)
    *   [Requirements](#requirements)
    *   [Obtaining an API key](#obtaining-an-api-key)
    *   [Camera usage description](#camera-usage-description)
*   [Installation](#installation)
*   [Usage](#usage)
    *   [HTML markup](#html-markup)
    *   [Initializing](#initializing)
*    [Callbacks](#callbacks)
*   [Customisation](#customisation)
    *   [Styles](#styles)
    *   [Flow](#flow)
    *   [Fields](#fields)
    *   [Logo](#logo)
    *   [Setting acceptable documents](#setting-acceptable-documents)
*   [Localisation](#localisation)
*   [External libraries](#external-libraries)

## Overview
The SDK provides functionality to upload user personal data to GetID server. 
Also, this SDK provides a possibility to add a customisable form component 
for users to enter text information about themselves or/and 
upload (capture) ids and face photos.


## Getting started
### Requirements
- node 10+
- browsers: Chrome, Safari and FF latest

### Obtaining an API key
In order to start using GetID SDK, you will need an API key and API url. You can get and set your key and url in your GetID Dashboard.

### Generating an SDK token.
For security reasons, instead of using the API key directly in you client-side code, 
you will need to generate and include a short-lived JSON Web Token (JWT) every time you initialise the SDK. 
To generate an SDK Token you should perform a request to the SDK Token endpoint you got from your getID dashboard:
apiKey must be passed in request headers.

``` js
POST YOUR_SDK_SERVER_BACKEND_URL/sdk/token
headers: {
    apiKey: YOUR_API_KEY
} 
```

Make a note of the `token` value in the response, as you will need it later on when initialising the SDK.

Our team strongly encourages making a JWT call using server-side code, for security reasons. If this is not possible, the request can be made in client-side code as well, but is not recommended.

* Tokens expire 90 minutes after creation. (length of a token's life is a matter of configuration)

### Camera usage description
The SDK uses the camera for capturing photos during verification. The app is responsible for describing the reason for using the camera. 

In order to use camera you need to first give permission in your browser notification. 

For better verification try to hold the document exactly within the frame while capturing photo. Do not place document in inverted alignment or at an angle. Please avoid too dark or bright lightning. In process of capturing selfie be sure that there is no more than one face in a photo.

## Installation
- NPM style import
```sh
npm install --save getid-web-sdk
```
```js
// ES6 module import
import {init} from 'getid-web-sdk'

// commonjs style require
const getId = require('getid-web-sdk')
```
- HTML Script Tag

include sdk as regular script tag. (the only avaliable option at this moment of time)
```html
<script src='<folder-name>/getid-web-sdk.min.js'></script>
```

### HTML markup
In case you are planning to use getId form, place an empty element for the interface to mount itself on:
```html
<div id='getid-component'></div>
```
Place the snippet in the bottom of your index file.

## Initializing
_In order to initialize an SDK instance, simply call:_ 
```js
getId.init({
  // the JWT token that you generated earlier on
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
});
```

_In case you want to use getId UI you need to specify container_id - element where component will mount into.:_ 
```js
getId.init({
  // the JWT token that you generated earlier on
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
});
```


_for more sophisticated initialization with more customization check this example:_
```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flow: [ { component: ['Form'] },
          { component: ['ThankYou'] } ],
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
});
```

## Callbacks
All callbacks are optional, you can specify yours on `init` call. 
getId web SDK allows several callbacks:
- **onComplete** function - callback executed on Success event (client has been successfully verified)
- **onError** function - callback executed on fail event (client has not been successfully verified) - we will tell you why in `error.message` - now it's up to you to handle this accordingly

Example:
```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  onComplete: function(data) {
    console.log("everything is complete" + data)
  },
   onFail: function(error) {
   console.log("something went wrong" + error)
  }
});
```

## Customization

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
```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  // pass flow options as array of objects in your preferred order
    flow: [ { component: ['Form'] },
            { component: ['CountryAndDocument'] },
            { component: ['ThankYou'] } ],
});
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

Example: 
```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  fields: [
     // pre-populated 
      {
        type: 'text',
        title: 'First Name',
        value: 'John'
      },
      // this one client will have to fill in
      {
        type: 'select',
        title: 'Country',
        required: false
      },
  ]
});
```

### Supported countries and types of documents
In process of passing flow you have to choose one of the offered document types. Depending on country user is allowed to select one or other document type. 
You can pass user's document data via sdk init method.
 
 ```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
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
});

```

This will pre-fill document and country view fields with passed params.
In case passed values do not match getId supported list of countries and/or documents, sdk will proceed with empty values, and client will be able to try to select other options.

Console will show error ``This country is not supported`` or `This document type is not supported.`  

For now system is mostly supporting next documents:
- passport, 
- id-card, 
- visa, 
- driving-licence, 
- residence-permit,
- internal-passport.

For some documents (`internal-passport` and `passport`) you will have to capture photo from both sides (front and back).

### Form grid
You can also specify form width within the config

Types are: `narrow` or `wide`

Example: 
```js
getId.init({
  jwtToken: 'YOUR_JWT_TOKEN',
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  formType: 'narrow',
});
```

## External libraries

Current software is using external libraries, which are released under MIT license:

```
 Copyright (c) 2019 GetID

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
