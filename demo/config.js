export default {
  apiUrl: 'http://localhost:3001',
  apiKey: '1231223',
  containerId: 'getid-component',
  dictionary: 'en',
  metadata: {
    externalId: 121212,
  },
  HtmlProperties: {
    isShadowDom: false,
  },
  styles: {
    // 'txt-color': 'red',
    'accent-color': 'pink',
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
          validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'Last name',
          required: false,
          // validation: (value, setError) => ((/^[0-9]*$/.test(value)) ? setError(null) : setError('Only number')),

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
      // server: 'https://mc.getid.ee',
      server: 'https://mc2.getid.dev',
      phrases: ['My name is...', 'I would like to receive a certificate...'],
    },
    {
      servers: [
        // 'ws://74.80.245.17:6088',
        'wss://74-80-245-17.liveness.getid.cloud:1088',
        // 'wss://ws.getid.dev',
        //        'ws://74.80.245.17:2088',
      ],
      component: 'Liveness',
    },
    {
      component: 'DocumentPhoto',
      showRules: true,
      interactive: true,
      enableCheckPhoto: true,
    },
    { component: 'Selfie', showRules: true, enableCheckPhoto: true },

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
  onSortDocuments(country, documents) {
    const idPassportDrivingCountries = ['at', 'be', 'bg', 'de', 'ee', 'fi', 'fr', 'gb', 'gr', 'hu', 'ie', 'is', 'it', 'lv', 'mt', 'no', 'pt', 'ro', 'se', 'si', 'cn'];
    const passportIdDrivingCountries = ['cy', 'li', 'lt', 'nl'];
    const idDrivingPassportCountries = ['cz', 'dk', 'es', 'hr', 'pl', 'sk'];
    const drivingPassportIdCountries = ['lu'];
    const drivingIdPassportCountries = ['au'];

    const idPassportDrivingDocuments = ['id-card', 'passport', 'driving-licence', 'residence-permit'];
    const passportIdDrivingDocuments = ['passport', 'id-card', 'driving-licence', 'residence-permit'];
    const idDrivingPassportDocuments = ['id-card', 'driving-licence', 'passport', 'residence-permit'];
    const drivingPassportIdDocuments = ['driving-licence', 'passport', 'id-card', 'residence-permit'];
    const drivingIdPassportDocuments = ['driving-licence', 'id-card', 'passport', 'residence-permit'];

    if (drivingPassportIdCountries.includes(country)) return drivingPassportIdDocuments;
    if (drivingIdPassportCountries.includes(country)) return drivingIdPassportDocuments;
    if (passportIdDrivingCountries.includes(country)) return passportIdDrivingDocuments;
    if (idDrivingPassportCountries.includes(country)) return idDrivingPassportDocuments;
    if (idPassportDrivingCountries.includes(country)) return idPassportDrivingDocuments;

    return passportIdDrivingDocuments;
  },
};
