
// User type constants for mapping between UI and API values
export const USER_TYPES = {
  'Chiến sĩ': 'SOLDIER',
  'Sĩ quan': 'OFFICER',
  'Chuyên nghiệp': 'PROFESSIONAL',
  'SOLDIER': 'Chiến sĩ',
  'OFFICER': 'Sĩ quan',
  'PROFESSIONAL': 'Chuyên nghiệp'
} as const;

export const mapTypeToApi = (uiType: string): string => {
  return USER_TYPES[uiType as keyof typeof USER_TYPES] || uiType;
};

export const mapTypeToUI = (apiType: string): string => {
  return USER_TYPES[apiType as keyof typeof USER_TYPES] || apiType;
};

export const GENDER_MAPPING = {
  'MALE': 'Nam',
  'FEMALE': 'Nữ',
  'OTHER': 'Khác',
  'Nam': 'MALE',
  'Nữ': 'FEMALE',
  'Khác': 'OTHER'
} as const;

export const mapGenderToApi = (uiGender: string): string => {
  return GENDER_MAPPING[uiGender as keyof typeof GENDER_MAPPING] || uiGender;
};

export const mapGenderToUI = (apiGender: string): string => {
  return GENDER_MAPPING[apiGender as keyof typeof GENDER_MAPPING] || apiGender;
};
