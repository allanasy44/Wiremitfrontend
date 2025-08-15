// Country data with phone codes and flags
export interface CountryData {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  format?: string; // Optional format hint like "+1 (XXX) XXX-XXXX"
}

export const COUNTRIES: CountryData[] = [
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    phoneCode: '+263',
    format: '+263 XX XXX XXXX'
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    phoneCode: '+1',
    format: '+1 (XXX) XXX-XXXX'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    phoneCode: '+44',
    format: '+44 XXXX XXXXXX'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    phoneCode: '+27',
    format: '+27 XX XXX XXXX'
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    phoneCode: '+1',
    format: '+1 (XXX) XXX-XXXX'
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    phoneCode: '+61',
    format: '+61 X XXXX XXXX'
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    phoneCode: '+254',
    format: '+254 XXX XXXXXX'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    phoneCode: '+234',
    format: '+234 XXX XXX XXXX'
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    phoneCode: '+233',
    format: '+233 XX XXX XXXX'
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    phoneCode: '+255',
    format: '+255 XXX XXX XXX'
  }
];

export const getCountryByCode = (code: string): CountryData | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountryByPhoneCode = (phoneCode: string): CountryData | undefined => {
  return COUNTRIES.find(country => country.phoneCode === phoneCode);
};

export const formatPhoneNumber = (phone: string, country: CountryData): string => {
  if (!country.format) return phone;
  
  // Remove all non-digits except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If phone doesn't start with country code, add it
  if (!cleaned.startsWith(country.phoneCode)) {
    return country.phoneCode + ' ' + cleaned.replace(/^\+/, '');
  }
  
  return cleaned;
};