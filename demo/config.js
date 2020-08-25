export default {
  apiUrl: '',
  apiKey: '',
  containerId: 'getid-component',
  dictionary: 'amas::u-RU',
  metadata: {
    externalId: 121212,
  },
  flow: [
    { component: ['CountryAndDocument'] },
    { component: ['Consent'] },
    { component: ['Form'] },
    { component: ['IdSelfie'] },
    { component: ['IdCapture'] },
    { component: ['IdCaptureBack'] },
    { component: ['ThankYou'] }],
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
      required: true,
      hidden: true,
    },
    {
      label: 'Last Name',
      type: 'text',
      name: 'Last name',
    },
    {
      label: 'Document front side',
      type: 'file',
      name: 'front',
      required: false,
    },
    {
      label: 'Document back side',
      type: 'file',
      name: 'back',
      required: true,
    },
    {
      label: 'Country',
      type: 'select',
      placeholder: 'sum placeholder',
      options: [
        { name: 'Estonia', value: 'Estonia' },
        { name: 'Russia', value: 'Russia' },
        { name: 'United Kingdom', value: 'uk' },
      ],
      name: 'Country of user',
      required: true,
    },
    {
      label: 'Date Of Birth',
      type: 'date',
      // value: '1991-08-15',
      name: 'Date Of Birth',
    },
    {
      label: 'I have read and understand <a href="https://getid.ee">Terms of use</a> of GetID OÜ.',
      type: 'checkbox',
      name: 'privacy',
      value: true,
    },
  ],
  formType: 'narrow',
  cameraDistance: 'default',
  onComplete() {
    window.location.reload();
  },
  // onFail(error) {
  //   console.log(error.message);
  // },
  onExists() {
    console.log('exists');
  },
  onSortDocuments(country, documents) {
    const idPassportDrivingCountries = ['at', 'be', 'bg', 'de', 'ee', 'fi', 'fr', 'gb', 'gr', 'hu', 'ie', 'is', 'it', 'lv', 'mt', 'no', 'pt', 'ro', 'se', 'si', 'ci'];
    const passportIdDrivingCountries = ['cy', 'li', 'lt', 'nl', 'sk'];
    const idDrivingPassportCountries = ['cz', 'dk', 'es', 'hr', 'pl'];
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
