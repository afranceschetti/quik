'use strict';

angular.module('quik.version', [
  'quik.version.interpolate-filter',
  'quik.version.version-directive'
])

.value('version', '0.1');
