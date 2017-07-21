angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
]).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    });
}).factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');	//Tên namespace webapp

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
	
/////////////////////// Những dòng code ở trên phần này là phần cài đặt, các bạn hãy đọc thêm về angularjs để hiểu, cái này không nhảy cóc được nha!
}).controller('Home', function($scope, mySocket) {
	////Khu 1 -- Khu cài đặt tham số 
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
	$scope.Parameter = ["", ""]
	$scope.Device_status = [0, 0, 0, 0]
	
	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút
	$scope.Auto_Run_W  = function() {
		mySocket.emit("TuDong_R")
	}
	$scope.Auto_Stop_W  = function() {
		mySocket.emit("TuDong_S")
	}
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
	//giử Các check box từ WebApp lên sockectServer
	$scope.Hand_W = function() {
		console.log("Hand_W ", $scope.Device_status)
		
		var json = {
			"DEN": $scope.Device_status[1],
			"QUAT": $scope.Device_status[2],
			"BOM": $scope.Device_status[3],
			"MAICHE": $scope.Device_status[4]
			
		}
		mySocket.emit("TAY", json)
	}
	//Cách gửi tham số 2: dùng biến cục bộ: SET_VALUE(). Biến này đươc truyền từ file home.html, dữ liệu đươc truyền vào đó chính là biến toàn cục $scope.servoPosition. Cách 2 này sẽ giúp bạn tái sử dụng hàm này vào mục đích khác, thay vì chỉ sử dụng cho việc bắt sự kiện như cách 1, xem ở Khu 4 để biết thêm ứng dụng!
	$scope.SET_VALUE = function() {
		console.log("SET_VALUE", json) //debug chơi à
		var json = {
			"SET_POINT": $scope.Parameter
		}
		console.log("Install", json) //debug chơi à
		mySocket.emit("Install", json)
	}
	

	
	////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
	mySocket.on('READSENSOR', function(json) {
		console.log("READSENSOR", json)
		$scope.NhietDo = json.NhietDo
		$scope.DoAm = json.DoAm
		$scope.AnhSang = (json.AnhSang == 0) ? "Sáng rầu" : "Tối thui"
		$scope.Mua = (json.Mua == 1) ? "Không mưa" : "Mưa rầu"
		$scope.DoAmDat1 = json.DoAmDat1
		$scope.DoAmDat2 = json.DoAmDat2
		$scope.DoAmDat3 = json.DoAmDat3
		$scope.DoAmDat4 = json.DoAmDat4
		$scope.DoAmDat5 = json.DoAmDat5
		$scope.DoAmDat6 = json.DoAmDat6
	})
	//Khi nhận được lệnh LED_STATUS
	mySocket.on('STATUS', function(json) {
		console.log("STATUS", json)
		$scope.Den  = json.Den 
		$scope.Quat = json.Quat
		$scope.Bom = json.Bom
		$scope.MaiChe = json.MaiChe
	})

	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
	})
		
});