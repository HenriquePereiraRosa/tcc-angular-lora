export const environment = {
  production: true,
  apiUrl: 'https://tcc-email-server.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('https://tcc-email-server.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
