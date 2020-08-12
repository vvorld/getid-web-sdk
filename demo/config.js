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
  additionalData: [
    {
      name: 'Test',
      value: 'test',
    },
  ],
  flow: [
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
    // {
    //   component: 'DocumentPhoto',
    //   showRules: true,
    //   interactive: false,
    //   enableCheckPhoto: true,
    //   country: 'ee',
    //   documentType: 'residence-permit',
    // },
    // { component: 'Selfie' },
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
          min: 'now',
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
