export default {
  apiUrl: 'http://localhost:3001',
  apiKey: '1231223',
  containerId: 'getid-component',
  dictionary: 'en',
  metadata: {
    externalId: 121212,
  },
  HtmlProperties: {
    isShadowDom: true,
  },
  styles: {
    // 'txt-color': 'red',
    '--getid-accent-color': 'pink',
    '--getid-font-family': 'Helvetica',
  },
  translations: {
    Form_header: 'Is Custom Form Header!',
  },
  flow: [
    {
      component: 'Form',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          name: 'First name',
          required: false,
          value: '',
          mask: {
            regexp: '^[a-zA-Z0-9 ]+$',
            message: 'Only latin symbols',
          },
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'Last name',
          required: false,
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
        },
        {
          placeholder: 'Document front side',
          type: 'file',
          name: 'test',
          required: true,
        },
        {
          label: 'Date Of Birth',
          type: 'date',
          name: 'Date of birth',
          required: false,
          enableControls: true,
        },
        {
          label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID&nbspOÜ.',
          type: 'consent',
          name: 'privacy',
        },

      ],
    },
    {
      component: 'Record',
      phrases: ['My name is...', 'I would like to receive a certificate...'],
    },
    { component: 'Liveness' },
    {
      component: 'DocumentPhoto',
      showRules: true,
      interactive: true,
      enableCheckPhoto: true,
    },
    { component: 'Selfie', showRules: true, enableCheckPhoto: true },
    { component: 'ThankYou' },
  ],
  onComplete({ id }) {
    alert(id);
    // window.location.reload();
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
