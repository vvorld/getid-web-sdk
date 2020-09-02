export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'en',
  metadata: {
    externalId: 121212,
  },
  styles: {
    'txt-color': 'red',
    'accent-color': 'green',
    'font-family': 'Helvetica',
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
          // validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
        },

        {
          label: 'Last Name',
          type: 'text',
          name: 'Last name',
          required: false,
          // validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),

        },
        {
          label: 'Date Of Birth',
          type: 'date',
          name: 'Date of birth',
          required: false,
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
      server: 'https://mc2.getid.dev',
      phrases: ['My name is...', 'I would like to receive a certificate...'],
    },
    {
      servers: [
        'wss://ws.getid.dev',
      ],
      component: 'Liveness',
    },
    {
      component: 'DocumentPhoto',
      showRules: true,
      interactive: true,
      enableCheckPhoto: true,
    },
    { component: 'Selfie', showRules: true },

    // { component: 'Selfie' },
    // {
    //   component: 'Form',
    //   fields: [
    //     {
    //       label: 'First Name',
    //       type: 'text',
    //       value: 'text',
    //       name: 'First name',
    //       required: true,
    //     },
    //     {
    //       placeholder: 'Document front side',
    //       type: 'file',
    //       name: 'test',
    //       required: true,
    //     },
    //     {
    //       label: 'Last Name',
    //       type: 'text',
    //       name: 'Last name',
    //       required: true,
    //     },
    //     {
    //       label: 'Date Of Birth',
    //       type: 'date',
    //       name: 'Date of birth',
    //       min: 'now',
    //     },
    //     {
    //       label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID&nbspOÜ.',
    //       type: 'consent',
    //       name: 'privacy',
    //     },
    //   ],
    // },
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
