export const environment = {
  production: true,
  apiUrl: 'https://springbootintro.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('https://springbootintro.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
