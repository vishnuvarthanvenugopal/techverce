var hmapp = angular.module('app', 
    ['ui.router', 'ui.bootstrap', 'ui.tinymce'])
.value('APIURL', 'http://localhost/Boopathi/howmatch/admin/api/?action=');

hmapp
.config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/home');
    var states = [
        {
            name: 'home',
            label: 'Home',
            auth: false,
            restricted:false,
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: 'homeController'
        }
    ]

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });
};


hmapp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

hmapp.directive('ngEscape', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.key === "Escape") {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEscape);
                });
                event.preventDefault();
            }
        });
    };
});

hmapp.directive('ngUparrow', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 38) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngUparrow);
                });
                event.preventDefault();
            }
        });
    };
});

hmapp.directive('ngDownarrow', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 40) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngDownarrow);
                });
                event.preventDefault();
            }
        });
    };
});

hmapp.directive("repeatEnd", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});

hmapp.directive("datePicker", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).datepicker({'format': 'yyyy-mm-dd', startDate: new Date()});
            
            $(element).on('changeDate', function(ev){
                $(this).datepicker('hide');
            });
        }
    };
});

hmapp.directive("cdatePicker", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).datepicker({'format': 'yyyy-mm-dd'});
            
            $(element).on('changeDate', function(ev){
                $(this).datepicker('hide');
            });
        }
    };
});

hmapp.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

hmapp.directive('triggerUpload', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
        element.bind('click', function(event){
            $("#"+attrs['triggerUpload']).trigger('click');
        }); 
    }
  };
});

hmapp.directive('fileUpload', function(ApiService, $rootScope, $timeout, $state, $q) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
        element.bind('change', function(event){
        	var file = event.target.files[0];
        	
        	var fileReader = new FileReader();
        	fileReader.onload = function(){
        		ngModel.$setViewValue(fileReader.result);
        	}
        	fileReader.readAsDataURL( file );
        	
        }); 
    }
  };
});

hmapp.filter('checkurl', function ($rootScope) {
  return function (item) {
    var res = (item || "").replace(
        /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
        function(match, space, url){
          var hyperlink = url;
          if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
          }
          return space + '<a class="linkurl" target="_blank" href="' + hyperlink + '">' + url + '</a>';
        }
      );
     
    var tmpa = document.createElement("div");
    $(tmpa).html(res);
    
    var tagged_users = $(tmpa).text().split(' ').filter(function(re){
        return re.indexOf('@') === 0 && !!$rootScope.company_user_login_by_name[re.replace('@', '')];
    });
    
    angular.forEach(tagged_users, function(v, k) {
        res = res.replace(v, '<a class="linkurl" href="#!/profile/'+v.replace('@', '')+'">'+$rootScope.company_user_login_by_name[v.replace('@', '')]+'</a>');
    });
     
    return res;
  };
});

hmapp.filter('notiName', function ($rootScope) {
  return function (item, noti) {
      if($rootScope.company_user[noti.triggered_by]){
            var res = (item || "").replace('[name]', '<strong>'+$rootScope.company_user[noti.triggered_by].display_name+'</strong>');
            res = res.replace('[event_name]', noti.title);
            res = res.replace('[title]', noti.title);
            res = res.replace('[notes]', noti.notes);
            res = res.replace('[feedname]', noti.notes);
            return res;
      } else {
          return "";
      }
  };
});

hmapp.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

hmapp.filter('secure_url', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsResourceUrl(text);
    };
}]);

hmapp.filter('shortContent', function () {
    return function (item, maxLength) {
        if((item || "").length < maxLength){
            return item;
        } else {
            var trimmedString = (item || "").substr(0, maxLength);
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))+'...';
        }
    }
});

hmapp.filter('youtubeurl', function () {
  return function (item) {
    var regex = /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi;
    var found = (item || "").match(regex);
    
    var $youtubeurl= '';
    
    if(Array.isArray(found)){
        angular.forEach(found, function(v,k){
            var tmpv = [];
            if(v.indexOf('youtube.com/watch?v=') !== -1){
                tmpv = v.split('youtube.com/watch?v=');
            } else if(v.indexOf('youtu.be/') !== -1){
                tmpv = v.split('youtu.be/');
            }
            
            if(tmpv.length == 2 && tmpv[1].trim()){
                $youtubeurl += '<div class="youtube-video">'+
                    '<iframe width="470" height="315"src=" https://www.youtube.com/embed/'+ tmpv[1].trim() +'">'+
                    '</iframe>'+
                '</div>';
            }
        });
    }
    
    return $youtubeurl;
  };
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

hmapp.
    filter('timeago', function() {
        return function(input, p_allowFuture) {
            var substitute = function (stringOrFunction, number, strings) {
                    var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings= {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "few seconds",
                    minute: "a minute",
                    minutes: "%d minutes",
                    hour: "an hour",
                    hours: "%d hours",
                    day: "a day",
                    days: "%d days",
                    month: "a month",
                    months: "%d months",
                    year: "a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
            
                // var strings = this.settings.strings;
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
                
            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);

            return $.trim([prefix, words, suffix].join(separator));
            // conditional based on optional argument
            // if (somethingElse) {
            //     out = out.toUpperCase();
            // }
            // return out;
        }
    })
    
.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});

Object.equals = function( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {

    if(p == 'collapsed') continue;

    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {

    if(p == 'collapsed') continue;

    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};
 
hmapp.directive("compareTo", compareTo)
hmapp.value('ISIONICAPP', 0)
.factory('Camera', function($q) {
   return {
      getPicture: function(options) {
         var q = $q.defer();

         navigator.camera.getPicture(function(result) {
            q.resolve(result);
         }, function(err) {
            q.reject(err);
         }, options);

         return q.promise;
      }
   }
});