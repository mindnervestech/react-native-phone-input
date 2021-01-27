import { find, orderBy } from 'lodash';

let instance = null;

class Country {
  static getInstance() {
    if (!instance) {
      instance = new Country();
    }
    return instance;
  }

  constructor() {
    this.countryCodes = [];

    this.countriesData = null;
  }

  setCustomCountriesData(json) {
    this.countriesData = json;
  }

  removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  addCountryCode(iso2, dialCode, priority) {
    if (!(dialCode in this.countryCodes)) {
      this.countryCodes[dialCode] = [];
    }

    const index = priority || 0;
    this.countryCodes[dialCode][index] = iso2;
  }

  getAll(selected_country) {
    if (!this.countries) {
      let temp = orderBy(
        this.countriesData || require('./resources/countries.json'),
        ['name'],
        ['asc'],
      );
      if(selected_country === 'international') {
        temp = this.removeByAttr(temp, 'iso2', 'ae');
        temp = this.removeByAttr(temp, 'iso2', 'sa');
      }
      this.countries = temp;
    }
    return this.countries;
  }

  getCountryCodes(selected_country) {
    if (!this.countryCodes.length) {
      this.getAll(selected_country).map((country) => {
        this.addCountryCode(country.iso2, country.dialCode, country.priority);
        if (country.areaCodes) {
          country.areaCodes.map((areaCode) => {
            this.addCountryCode(country.iso2, country.dialCode + areaCode);
          });
        }
      });
    }
    return this.countryCodes;
  }

  getCountryDataByCode(iso2, selected_country) {
    return find(this.getAll(selected_country), country => country.iso2 === iso2);
  }
}

export default Country.getInstance();
