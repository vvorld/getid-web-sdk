export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  metadata: {
    externalId: 121212,
  },
  additionalData: [
    {
      name: 'Test',
      value: 'test',
    },
  ],

  flow: [
    {
      component: 'Form',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          value: 'Artem',
          name: 'First name',
          required: true,
          // validation: (value, setError) => {
          //   const re = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
          //   if (value && value.length !== 0 && !re.test(String(value).toLowerCase())) {
          //     setError('Input is not valid');
          //     return;
          //   }
          //   setError(null);
          // },
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'Last name',
          value: 'Gerus',
          required: true,
        },
        {
          label: 'Date Of Birth',
          type: 'date',
          name: 'Date of Birth',
          value: '1986-09-22',
          // required: true,
        },
        {
          label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID&nbspOÜ.',
          type: 'consent',
          name: 'privacy',
        },
      ],
    },
    // {
    //   component: 'Form',
    //   fields: [
    //
    //     {
    //       label: 'Document front side',
    //       type: 'file',
    //       name: 'front',
    //       required: true,
    //     },
    //     {
    //       label: 'Document back side',
    //       type: 'file',
    //       name: 'back',
    //       required: false,
    //     },
    //     {
    //       label: 'Country',
    //       type: 'select',
    //       placeholder: 'sum placeholder',
    //       options: [
    //         { name: 'Estonia', value: 'Estonia' },
    //         { name: 'Russia', value: 'Russia' },
    //         { name: 'United Kingdom', value: 'uk' },
    //       ],
    //       name: 'Country of user',
    //       required: true,
    //     },
    //
    //     {
    //       label: 'Date of expiry',
    //       type: 'date',
    //       value: '1991-08-15',
    //       name: 'Date of expiry',
    //       required: true,
    //       hidden: true,
    //
    //     },
    //
    //   ],
    // },
    /* {
      component: 'CountryAndDocument',

    }, */
    {
      component: 'DocumentPhoto',
      showRules: true,
      interactive: true,
      enableCheckPhoto: true,
      country: 'ee',
      documentType: 'residence-permit',
    },
    { component: 'Selfie' },
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
