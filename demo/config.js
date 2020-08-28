export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'en',
  metadata: {
    externalId: 121212,
  },
  // styles: {
  //   'txt-color': 'red',
  //   'txt-color-secondary': 'green',
  //   'font-family': 'Helvetica',
  // },
  flow: [
    {
      component: 'Form',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          name: 'First name',
          required: false,
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
        },
        {
          label: 'First Name 2',
          type: 'text',
          name: 'First name',
          required: false,
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
        },
        {
          label: 'First Name 3',
          type: 'text',
          name: 'First name',
          required: false,
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
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
          label: 'First Name 3',
          type: 'text',
          name: 'First name',
          required: false,
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
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
      // server: 'http://mc.getid.dev',
      // server: 'http://164.90.223.220:8080',
      phrases: ['I would like to get a setificate from Company Z', 'Step 2'],
    },
    {
      server: 'ws://10.10.10.59:8765/',
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
