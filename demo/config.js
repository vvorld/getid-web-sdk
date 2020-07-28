export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  metadata: {
    externalId: 121212,
  },
  flow: [
    // { component: 'Form' },
    { component: 'CountryAndDocument' },
    { component: 'IdCapture' },
    { component: 'IdCaptureBack' },
    { component: 'IdSelfie' },
    { component: 'ThankYou' }],
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
  fields: [
    {
      label: 'First Name',
      type: 'text',
      value: 'John',
      name: 'First name',
      required: true,
      hidden: true,
    },
    {
      label: 'Last Name',
      type: 'text',
      name: 'Last name',
    },
    {
      label: 'Document front side',
      type: 'file',
      name: 'front',
      required: true,
    },
    {
      label: 'Document back side',
      type: 'file',
      name: 'back',
      required: false,
    },
    {
      label: 'Country',
      type: 'select',
      placeholder: 'sum placeholder',
      options: [
        { name: 'Estonia', value: 'Estonia' },
        { name: 'Russia', value: 'Russia' },
        { name: 'United Kingdom', value: 'uk' },
      ],
      name: 'Country of user',
      required: true,
    },

    {
      label: 'Country 2',
      type: 'select',
      placeholder: 'sum placeholder',
      options: [
        { name: 'Estonia', value: 'Estonia' },
        { name: 'Russia', value: 'Russia' },
        { name: 'United Kingdom', value: 'uk' },
      ],
      value: 'Estonia',
      name: 'Country of user 2',
      required: true,
    },
    {
      label: 'Date Of Birth',
      type: 'date',
      name: 'Date of Birth',
    },
    {
      label: 'Date of expiry',
      type: 'date',
      value: '1991-08-15',
      name: 'Date of expiry',
      required: true,
    },
    {
      label: 'Invalide date 1',
      type: 'date',
      value: '2991-28-25',
      name: 'Invalide date',
      required: true,
    },
    {
      label: 'Invalide date 2',
      type: 'date',
      value: 'asdsad',
      name: 'Invalide date 2',
      required: true,
    },
    {
      label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID OÜ.',
      type: 'checkbox',
      name: 'privacy',
      value: true,
    },
  ],
  formType: 'narrow',
  cameraDistance: 'default',
  onComplete() {
    window.location.reload();
  },
  // onFail(error) {
  //   console.log(error.message);
  // },
  onExists() {
    console.log('exists');
  },
};
