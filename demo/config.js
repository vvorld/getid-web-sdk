export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  flow: [
    // { component: ['CountryAndDocument'] },
    // { component: ['Form'] },
    { component: ['IdSelfie'] },
    { component: ['IdCapture'] },
    { component: ['IdCaptureBack'] },

    // { component: ['Consent'] },
    { component: ['ThankYou'] }],
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
      // value: 'John',
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
      name: 'Photo_id',
      required: false,
    },
    {
      label: 'Document back side',
      type: 'file',
      name: 'Test_name',
      required: true,
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
      label: 'Date Of Birth',
      type: 'date',
      value: '1991-08-15',
      name: 'Date Of Birth',
    },
    {
      label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> and Private policy of GetID OÜ.',
      type: 'checkbox',
      name: 'privacy',
      value: true,
    },
  ],
  isQA: false,
  formType: 'narrow',
  cameraDistance: 'default',
  onComplete: function() {
    window.location.reload();
  },
  onFail: function() {
    window.location.reload();
  },
  onExists: function() {
    console.log('exists');
  },
};
