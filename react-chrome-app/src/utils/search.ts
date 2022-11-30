export type TSearchFilter = {
  category: ESearchCategory;
  expectedInput: EExpectedSearchInput;
  allowMultipleUse: boolean;
}

export enum ESearchKeyword {
  HAVE_EVERY = 'have_every',
  HAVE_EXACTLY = 'have_exactly',
  HAVE_EITHER = 'have_either',
  HAVE_NONE = 'have_none',
  HASHTAGS = '#',
  LANG = 'lang',
  FROM = 'from',
  REPLY_TO = 'reply_to',
  MENTIONS = 'mentions',
  REPLIES = 'replies',
  LINKS = 'links',
  PEOPLE = 'people',
  LOCATION = 'location',
  MIN_REPLIES = 'min_replies',
  MIN_LIKES = 'min_likes',
  MIN_RT = 'min_rt',
  SINCE = 'since',
  UNTIL = 'until',
}

export enum ESearchCategory {
  WORDS = 'words',
  ACCOUNTS = 'accounts',
  FILTERS = 'filters',
  ENGAGEMENT = 'engagement',
  DATES = 'dates',
}

export enum EExpectedSearchInput {
  WORDS = 'words',
  HASHTAGS = 'hashtags',
  LANGUAGE = 'language',
  USER = 'user',
  REPLIES_OPTIONS = 'with, only, none',
  LINKS_OPTIONS = 'with, only, none',
  PEOPLE_OPTIONS = 'followed, anyone',
  LOCATION_OPTIONS = 'near, anywhere',
  NUMBER = 'number',
  DATE = 'date',
}

export const FILTERS = new Map<string, TSearchFilter>([
  [ESearchKeyword.HAVE_EVERY, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.WORDS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.HAVE_EXACTLY, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.WORDS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.HAVE_EITHER, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.WORDS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.HAVE_NONE, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.WORDS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.HASHTAGS, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.HASHTAGS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.LANG, {
    category: ESearchCategory.WORDS,
    expectedInput: EExpectedSearchInput.LANGUAGE,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.FROM, {
    category: ESearchCategory.ACCOUNTS,
    expectedInput: EExpectedSearchInput.USER,
    allowMultipleUse: true,
  }],
  [ESearchKeyword.REPLY_TO, {
    category: ESearchCategory.ACCOUNTS,
    expectedInput: EExpectedSearchInput.USER,
    allowMultipleUse: true,
  }],
  [ESearchKeyword.MENTIONS, {
    category: ESearchCategory.ACCOUNTS,
    expectedInput: EExpectedSearchInput.USER,
    allowMultipleUse: true,
  }],
  [ESearchKeyword.REPLIES, {
    category: ESearchCategory.FILTERS,
    expectedInput: EExpectedSearchInput.REPLIES_OPTIONS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.LINKS, {
    category: ESearchCategory.FILTERS,
    expectedInput: EExpectedSearchInput.LINKS_OPTIONS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.PEOPLE, {
    category: ESearchCategory.FILTERS,
    expectedInput: EExpectedSearchInput.PEOPLE_OPTIONS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.LOCATION, {
    category: ESearchCategory.FILTERS,
    expectedInput: EExpectedSearchInput.LOCATION_OPTIONS,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.MIN_REPLIES, {
    category: ESearchCategory.ENGAGEMENT,
    expectedInput: EExpectedSearchInput.NUMBER,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.MIN_LIKES, {
    category: ESearchCategory.ENGAGEMENT,
    expectedInput: EExpectedSearchInput.NUMBER,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.MIN_RT, {
    category: ESearchCategory.ENGAGEMENT,
    expectedInput: EExpectedSearchInput.NUMBER,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.SINCE, {
    category: ESearchCategory.DATES,
    expectedInput: EExpectedSearchInput.DATE,
    allowMultipleUse: false,
  }],
  [ESearchKeyword.UNTIL, {
    category: ESearchCategory.DATES,
    expectedInput: EExpectedSearchInput.DATE,
    allowMultipleUse: false,
  }],
]);

export type TSearchQueryComponent = {
  keyword: string;
  value: string;
  expectedInput: string;
}