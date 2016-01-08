'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }, {
    'title': 'D3 goodness',
    'state': 'chart'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('junk1App')
  .controller('NavbarController', NavbarController);
