export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  metadata: {
    externalId: 121212,
  },
  additionalData: [],
  flow: [
    {
      component: 'Record',
      server: 'http://164.90.223.220:8080',
      phrases: ['I would like to get a setificate from Company Z'],
    },
    {
      component: 'DocumentPhoto',
      showRules: true,
      interactive: false,
      enableCheckPhoto: false,
      country: 'ee',
      documentType: 'residence-permit',
    },
    { component: 'Selfie' },
    {
      component: 'Form',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          name: 'First name',
          required: true,
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'Last name',
          required: true,
        },
        {
          label: 'Date Of Birth',
          type: 'date',
          name: 'Date of birth',
        },
        {
          label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID&nbspOÜ.',
          type: 'consent',
          name: 'privacy',
        },
      ],
    },
    { component: 'ThankYou' }],
  onComplete({ id }) {
    alert(id);
    window.location.reload();
  },
  // onFail(error) {
  //   console.log(error.message);
  // },
  onExists() {
    console.log('exists');
  },
  onBack() {
    alert('back');
  },
};
