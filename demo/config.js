export default {
  apiUrl: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  flow: ['Form', 'DocumentType', 'ThankYou'],
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
      name: 'First name',
    },
    {
      label: 'Last Name',
      type: 'text',
      name: 'Last name',
      required: true,

    },
    {
      label: 'email',
      type: 'email',
      name: 'Email',
      required: true,
    },
    {
      label: 'Document back side',
      type: 'file',
      name: 'Photo_id',
      required: true,
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
