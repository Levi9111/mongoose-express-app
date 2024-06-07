export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemisterName = 'Autumn' | 'Summer' | 'Fall';

export type TAcademicSemisterCode = '01' | '02' | '03';

export type TAcademicSemister = {
  name: TAcademicSemisterName;
  code: TAcademicSemisterCode;
  year: string;
  startMonth: TMonths;
  endMonth: TMonths;
};

/**
   type TAcademicSemisterNameCodeMapper = {
    Autumn: '01';
    Summar: '02';
    Fall: '03';
  };
   */

//   dynamic type
export type TAcademicSemisterNameCodeMapper = {
  [key: string]: string;
};
