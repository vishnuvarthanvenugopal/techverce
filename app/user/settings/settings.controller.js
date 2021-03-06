angular.module('app')
        .controller('userSettingsController', userSettingsController);

userSettingsController.$inject = ['$scope', '$state', '$rootScope', 'APIURL', '$http', 'ApiService']

function userSettingsController($scope, $state, $rootScope, APIURL, $http, ApiService) {
	$scope.changep_form_data = {};
	$scope.settings_form_data = {};
    $scope.pageInfo = {};

   	$scope.change_password = function(frm){
		$scope.pageInfo.submitted2 = true;
    	if(frm.$valid){
    		ApiService.hm_change_password($scope.changep_form_data).then(function(res){
    			ApiService.notification(res.msg, 'success');
			    $scope.changep_form_data = {};
                $scope.pageInfo = {};
    		});
    	} else {
    		ApiService.notification('Please fill all required fields', 'error');
    	}
	};

	$scope.save = function(frm){
		$scope.pageInfo.submitted1 = true;
    	if(frm.$valid){
    		ApiService.hm_save_user_profile($scope.settings_form_data).then(function(res){
    			ApiService.notification(res.msg, 'success');
                $scope.pageInfo = {};
    		});
    	} else {
    		ApiService.notification('Please fill all required fields', 'error');
    	}
	};
}