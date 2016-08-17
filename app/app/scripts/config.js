/**
 * Created by robinengbersen on 17.08.16.
 */

angular.module('iklinikPosApp')
  .constant('ENV', {name: 'dev'})

  .constant('config', {
    API_DEV: 'http://localhost:8000/api',
    API_PROD: 'https://mobile.salesbird.ch/api/mobile' //http://46.101.169.111/api/mobile 8180
  });
