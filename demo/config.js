export default {
  apiUrl: '',
  containerId: 'getid-component',
  dictionary: 'amas::ru-RU',
  flow: ['IdCapture', 'Consent', 'IdCaptureBack', 'ThankYou', 'DocumentType', 'Form'],
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
    },
    {
      label: 'Last Name',
      type: 'text',
      value: 'Doe',
      name: 'Last name',
    },
    {
      label: 'email',
      type: 'email',
      value: 'Doe',
      name: 'Email',
    },
    {
      label: 'phone number',
      type: 'tel',
      name: 'Phone number',
    },
    {
      label: 'Country',
      type: 'select',
      value: '',
      placeholder: 'sum placeholder',
      options: [
        { name: 'Estonia', value: 'Estonia' },
        { name: 'Russia', value: 'Russia' },
        { name: 'United Kingdom', value: 'uk' },
        { name: 'Norway', value: 'Norway' },
      ],
      name: 'Country of user',
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
    },
  ],
  isQA: false,
  formType: 'narrow',
  onComplete() {
    window.location.reload();
  },
  onFail() {
    window.location.reload();
  },
};
