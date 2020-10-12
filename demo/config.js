export default {
  apiUrl: 'https://example.sb.getid.dev',
  apiKey: 'Qm64AQyks8dmkcNb',
  containerId: 'getid-component',
  dictionary: 'en',
  htmlProperties: {
    isShadowDom: false,
    isPopUp: false,
  },
  translations: {},
  flow: [
    {
      component: 'Form',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          name: 'First name',
          required: false,
          placeholder: 'asd',
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
      component: 'DocumentPhoto',
      showRules: true,
      interactive: true,
      enableCheckPhoto: true,
      country: 'ee',
      documentType: 'id-card',
    },
    {
      component: 'Record',
      phrases: ['My name is...', 'I would like to receive a certificate...'],
    },
    { component: 'Liveness' },
    { component: 'Selfie', showRules: true, enableCheckPhoto: true },
    { component: 'ThankYou' },
  ],
  additionalData: [
    {
      value: 'Gerus Artem',
      name: 'First name',
    },
    {
      value: 'Test',
      name: 'Test',
    },
  ],
  onComplete({ id }) {
    alert(id);
  },
  onFail(error) {
    console.log(error);
  },
  onBack() {
    alert('back');
  },
};
