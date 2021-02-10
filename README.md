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
    *   [htmlProperties](#htmlProperties)
    *   [Flow](#flow)
*   [Components](#components)
    *   [Form](#form)
    *   [Record](#record)
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

For the documentation of previous versions please refer to [old readme](https://github.com/vvorld/getid-web-sdk/blob/v4.4.2/README.md)

In order to make it work you will need access to GetID api. Please get in touch with our [integration team](mailto:support@getid.ee?subject=[GitHub]%20Integration%20with%20GetID).


## Getting started
### Requirements
- browsers and features we support: 
            
| OS | Browser | Version | Photos/Liveness/Recording | 
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

ADD LINKS

Both can be found and modified either through your GetID admin panel or via contacting our 
[integration support](mailto:support@getid.ee?subject=[GitHub]%20Obtaining%20GetID%20credentials).

## Installation

#### Including the library

- CDN

Include sdk link as regular script tag. 
The latest stable build can be found in example snippet below.

``` html
<script src='https://cdn.getid.cloud/sdk/getid-web-sdk-v6.min.js'></script>
```

ADD INFO ABOUT NPM

Script loads the widget via window object along with sdk config and jwt token.
```js
window.getidWebSdk.init(config);
```
ADD EXAMPLES WITH JWT AND SDK KEY

#### Obtaining JWT
For security reasons, you will need to generate and include a short-lived JSON Web Token (JWT) every 
time you initialise the SDK. 
To generate JWT make a post request with sdk key in header on your designated api url:

``` shell script
$ curl -H "Content-Type: application/json"  -H "apikey: SDK_KEY"  -X POST API_URL/sdk/v1/token
```



**Customer ID (optional)**

ADD INFO THAT IT IS DEDUPLICATION POSABILITY

In case you don't want your clients to complete verification more than once or for any other identification purposes
you can pass customerId param when generating jwt token.

``` shell script
$ curl -d '{"customerId":"value"}' -H "Content-Type: application/json"  -H "apikey: SDK_KEY"  -X POST API_URL/sdk/v1/token
```


**NB!** Token expires 90 minutes after creation. (length of a token's life is a matter of configuration).

--------------

### HTML markup
Please place an empty div element with a respective id in your html for the component to mount into.
``` html
<div id='getid-component'></div>
```

ADD INFO ABOUT FLOW CONFIGURATOR

## Initialization

_Now all has been set for sdk initialization._ 
``` js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flowName: ''
}; 
window.getidWebSdk.init(config);
```
This a simple example on how config should look like. Please go through README to learn how to customize the widget even further.

## Metadata

### ExternalID
### Labes

## Customization


### Container ID
This can be anything you want, just make sure for it to match the one being specified in HTML div element.


### isPopUp

### Locale


List?


### Profile
Add list availeble fieds for crosschecking
Add keys with custom fields


### Widget object

Example: 

``` js
 const config = {
   apiUrl: 'YOUR_URL',
   isPopUp,
 }; 
```

### Visual Appearance

SHADOW DOM

1. CSS Variables
2. cssString



### Callbacks
All callbacks are optional.

- **onComplete** = ({ id }) => callback executed on ThankYou view after the client has been successfully submitted their data for verification. Accepts verification id as param.
- **onFail** = ({code, messge}) => callback executed on fail event: 
    - Client failed to submit data successfully (server responded with anything but 200) - in this case callback will be called upon clicking on CAT
    - Widget failed to render successfully - in this case callback will be called automatically
accepts Error object as params, so it's up to you to handle this accordingly if needed.


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
