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
Both can be found and modified either through your GetID admin panel or via contacting our 
[integration support](mailto:support@getid.ee?subject=[GitHub]%20Obtaining%20GetID%20credentials).

## Installation

#### Including the library

- CDN

Include sdk link as regular script tag. 
The latest stable build can be found in example snippet below.

``` html
<script src='https://cdn.getid.cloud/sdk/getid-web-sdk-v5.min.js'></script>
```


Script loads the widget via window object along with sdk config and jwt token.
```js
window.getidWebSdk.init(config, token);
```

#### Obtaining JWT
For security reasons, you will need to generate and include a short-lived JSON Web Token (JWT) every 
time you initialise the SDK. 
To generate JWT make a post request with sdk key in header on your designated api url:

``` shell script
$ curl -H "Content-Type: application/json"  -H "apikey: SDK_KEY"  -X POST API_URL/sdk/v1/token
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
$ curl -d '{"customerId":"value"}' -H "Content-Type: application/json"  -H "apikey: SDK_KEY"  -X POST API_URL/sdk/v1/token
```

or 
``` js
const token = window.getidWebSdk.createPublicTokenProvider(apiUrl, sdkKey, customerId);
window.getidWebSdk.init(config, token);
``` 

**NB!** Token expires 90 minutes after creation. (length of a token's life is a matter of configuration).

--------------

### HTML markup
Please place an empty div element with a respective id in your html for the component to mount into.
``` html
<div id='getid-component'></div>
```

## Initialization

_Now all has been set for sdk initialization._ 
``` js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  flow: [
    {
        component: 'Form',
        fields: []
    },
    {
        component: 'ThankYou',
    },
  ],
}; 
window.getidWebSdk.init(config, token);
```
This a simple example on how config should look like. Please go through README to learn how to customize the widget even further.

## Customization

### Container ID
This can be anything you want, just make sure for it to match the one being specified in HTML div element.


### Metadata
Custom values object, mainly to upload some client specific data.
``` js
 const config = {
   apiUrl: 'YOUR_URL',
   metadata: {
      clientIpAddress: '127.0.0.1'
   }
 }; 
```

### htmlProperties

-> disableSwitchDevice (boolean, default: **false**)

Configuration flag to turn on/off (true/false) switching from desktop to mobile.
By default, if the user uses a desktop we offer to continue verification on a mobile device (because mobile phones usually have  cameras with better quality) 

-> disableSwitchLocales (boolean, default: **false**)

Configuration flag to turn on/off (true/false) being able to switch locale in an interface.

-> isPopUp (boolean, default: **false**)

Configuration flag to turn on/off (true/false) showing widget in the popup.
If this setting is true then SDK will be shown as a button witch show a popup with the widget


Example: 

``` js
 const config = {
   apiUrl: 'YOUR_URL',
   htmlProperties: {
      disableSwitchDevice: false,
      disableSwitchLocales: false,
      isPopUp: false,
   }
 }; 
```


### Flow
Flow is a required parameter. You can customize which steps that will be present in your getId widget.
Flow array must contain a set of objects that will match this pattern: 
``` js
    {
      component: name_of_component,
      ...{rest_of_parameters_for_the_component}
    }
```

## Components

### **Form**

View that provides the client with a set of fields to enter their personal data.
Can be used several times in the config (multi-form)
**_Configuration props_**: 

   - fields (array of objects)

        You can predefine as many input fields as there is needed. 
        Currently, we support 6 input types:
        - text: `string`
        - date: `string`
        - file: `*.jpg, *.jpeg, *.png, *.pdg`, **max.size: 6MB**
        - select: `string`
        - bool: `boolean` (form of checkbox input)
        - consent: `boolean` (special type in case T&C/MarketingPromotion consent are required)
    
   Example:
   
        {
          label: 'Test Field',
          type: 'text',
          name: 'First name',
          required: false,
        }
        
   Each field has multiple config points:
   - label -> input label
   - type -> input type
   - name -> input name (key value for the form data)
   - required -> boolean, is input required or not
   accepts two args => value(type: any), setError(type: function). Usage can be found in the example above.
        
**_Important note:_**

If you want to add custom file fields on the form step, please refrain from using reserved field names such as:
- front
- back
- selfie
- selfie-video

These can only be used to send out 
document photos (front and back), 
Unless you want to use those file inputs to do just that, please opt for some other naming.


### **Liveness**

View that gives the client option to pass the liveness check.

example: 

     const config = {
       apiUrl: 'YOUR_URL',
           {
                 component: 'Liveness', 
           },
        }
        
### **DocumentPhoto**

View that gives the client option to take photos of the ID document.

**_Configuration props_**: 

- showRules (boolean)

    Enables of disables the screen with the list of rules 
    (main purpose is to guide the client through the process to avoid bad quality photos)
- interactive (boolean)

    Enables of disables the screen with the option to pick document country and document type.
    Both document country and document type can be pre-filled via the config as well. See the example below.
- enableCheckPhoto (boolean)
    
    Enables of disables the "on the go" document photo check. 
    Is useful to eliminate bad quality photos/incorrect photos right after the client took them.

example: 
    
     const config = {
       apiUrl: 'YOUR_URL',
       flow: [  {
                component: 'DocumentPhoto',
                showRules: true,
                interactive: true,
                enableCheckPhoto: true,
                country: 'ee',
                type:  'id-catd',
          }],
        }

### **Selfie**
This view allows the client ot take a photo of themselves.

**_Configuration props_**: 

- showRules (boolean)

    Enables of disables the screen with the list of rules 
    (main purpose is to guide the client through the process to avoid bad quality photos)
- enableCheckPhoto (boolean)
    
    Enables of disables the "on the go" document photo check. 
    Is useful to eliminate bad quality photos/incorrect photos right after the client took them.
    
example: 
    
     const config = {
       apiUrl: 'YOUR_URL',
       {
            component: 'Selfie',
            showRules: true,
            enableCheckPhoto: true,
       },
     }
### **Thank you**
Final view, concludes the flow.
    
example: 
    
     const config = {
       apiUrl: 'YOUR_URL',
       {
            component: 'ThankYou',
       },
     }

### Callbacks
All callbacks are optional.

- **onComplete** = ({ id }) => callback executed on ThankYou view after the client has been successfully submitted their data for verification. Accepts verification id as param.
- **onFail** = ({code, messge}) => callback executed on fail event: 
    - Client failed to submit data successfully (server responded with anything but 200) - in this case callback will be called upon clicking on CAT
    - Widget failed to render successfully - in this case callback will be called automatically
accepts Error object as params, so it's up to you to handle this accordingly if needed.
- **onSortDocuments** function - callback executing for sorting or filtering supported documents list. Function takes two parameters: country - string in ALPHA-2 format(lowercase) and documents: array of supported document types for current country. You should return an array of desired document types(in desired order) for every country if you don't want to display some countries just return empty array.

Example:
``` js
const config = {
  apiUrl: 'YOUR_URL',
  onComplete: function(data) {
    console.log("everything is complete" + data)
  },
   onFail: function({ code, message}) {
    console.log("something went wrong: " + message )
  },
  onSortDocuments: function(coutry, documents) {
   const desiredCountries = ['cz', 'dk', 'es', 'hr', 'pl', 'at', 'be', 'bg', 'de', 'ee'];
   const desiredDocuments = ['id-card', 'passport', 'driving-licence', 'residence-permit'];

   if (desiredCountries.includes(country) return desiredDocuments;
   
   return [];
  }
}; 
```


Here are possible error codes/ message:

- customerid_exists - An application with this customerId already exists
- verification_fail - Cannot create application
- file_size - too large file/files
- file_type - We do not support this format
- camera_not_allowed - Failed to access your camera
- internal - Internal technical error
- schema_mismatch - Please use https schema
- browser_not_supported - Browser is not supported
- no_camera - Your device has no camera
- camera_generic - Failed to access your camera
- server_unavailable - Server is unavailable

## Tokenized url
You can get a tokenized URL to pass validation once (this link is valid for 1 hour, contact support to change the duration). There are two ways to get the link
* by sending a get request to your API url with query parameters **name** which means the name of the flow check
* you can specify the externalId into query string for mapping application id to some your custom unique id.
```bash
curl -H "X-API-Key: yourApiKey" -X GET https://your.api.url/api/v1/tokenized-url?name=doc-only&externalId=123
```
* by sending POST request with a next keys: locale, profile, redirects

```bash
curl -H "X-API-Key: yourApiKey" -H "Content-Type: application/json" -X POST https://your.api.url/api/v1/tokenized-url?name=doc-only --data '{"locale": "de", "profile": {"First name": "Jon", "Last name": "Dow", "Date of birth": "1991-04-12"}, "redirects": {"onComplete": "https://google.com", "onFail": "https://facebook.com"}}'
```

### Verification types
You may also configure desirable types of verification by simple passing a
``` verificationTypes``` (array of strings) property in the config. 
For more info about verification types please contact [integration support](mailto:support@getid.ee).

Example: 
``` js
const config = {
  apiUrl: 'YOUR_URL',
  containerId: 'getid-component',
  verificationTypes: ['face-matching', 'data-extraction', 'watchlists'],
}; 
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
