"use strict";
var TimerEvent_1 = require("awayjs-core/lib/events/TimerEvent");
var getTimer_1 = require("awayjs-core/lib/utils/getTimer");
var Timer_1 = require("awayjs-core/lib/utils/Timer");
/**
 *
 */
var TimerTest = (function () {
    function TimerTest() {
        var _this = this;
        this.oneSecondTimer = new Timer_1.default(1000);
        this.oneSecondTimer.addEventListener(TimerEvent_1.default.TIMER, function (event) { return _this.onSecTimerEvent(event); });
        this.oneSecondTimer.start();
        this.repeatTenTimes = new Timer_1.default(100, 10);
        this.repeatTenTimes.addEventListener(TimerEvent_1.default.TIMER, function (event) { return _this.repeatTenTimesEvent(event); });
        this.repeatTenTimes.addEventListener(TimerEvent_1.default.TIMER_COMPLETE, function (event) { return _this.repeatTenTimesComplete(event); });
        this.repeatTenTimes.start();
    }
    TimerTest.prototype.repeatTenTimesEvent = function (event) {
        var t = event.target;
        console.log('repeatTenTimesEvent', t.currentCount);
    };
    TimerTest.prototype.repeatTenTimesComplete = function (event) {
        var t = event.target;
        console.log('repeatTenTimesComplete', t.currentCount);
    };
    TimerTest.prototype.onSecTimerEvent = function (event) {
        console.log('onSecTimerEvent, tick');
        console.log('getTimer() : ', getTimer_1.default());
    };
    return TimerTest;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL1RpbWVyVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQTBCLG1DQUFtQyxDQUFDLENBQUE7QUFDOUQseUJBQXlCLGdDQUFnQyxDQUFDLENBQUE7QUFDMUQsc0JBQXNCLDZCQUE2QixDQUFDLENBQUE7QUFFcEQ7O0dBRUc7QUFDSDtJQUtDO1FBTEQsaUJBa0NDO1FBM0JDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBVSxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQWdCLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLG9CQUFVLENBQUMsS0FBSyxFQUFFLFVBQUMsS0FBZ0IsSUFBSyxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsb0JBQVUsQ0FBQyxjQUFjLEVBQUUsVUFBQyxLQUFnQixJQUFLLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUM7UUFDMUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU8sdUNBQW1CLEdBQTNCLFVBQTRCLEtBQWdCO1FBRTNDLElBQUksQ0FBQyxHQUFpQixLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTywwQ0FBc0IsR0FBOUIsVUFBK0IsS0FBZ0I7UUFFOUMsSUFBSSxDQUFDLEdBQWlCLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVPLG1DQUFlLEdBQXZCLFVBQXdCLEtBQWdCO1FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBUSxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0YsZ0JBQUM7QUFBRCxDQWxDQSxBQWtDQyxJQUFBIiwiZmlsZSI6InV0aWxzL1RpbWVyVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaW1lckV2ZW50XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9UaW1lckV2ZW50XCI7XG5pbXBvcnQgZ2V0VGltZXJcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi91dGlscy9nZXRUaW1lclwiO1xuaW1wb3J0IFRpbWVyXHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvVGltZXJcIjtcblxuLyoqXG4gKiBcbiAqL1xuY2xhc3MgVGltZXJUZXN0XG57XG5cdHByaXZhdGUgb25lU2Vjb25kVGltZXI6VGltZXI7XG5cdHByaXZhdGUgcmVwZWF0VGVuVGltZXM6VGltZXI7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5vbmVTZWNvbmRUaW1lciA9IG5ldyBUaW1lcigxMDAwKTtcblx0XHR0aGlzLm9uZVNlY29uZFRpbWVyLmFkZEV2ZW50TGlzdGVuZXIoVGltZXJFdmVudC5USU1FUiwgKGV2ZW50OlRpbWVyRXZlbnQpID0+IHRoaXMub25TZWNUaW1lckV2ZW50KGV2ZW50KSk7XG5cdFx0dGhpcy5vbmVTZWNvbmRUaW1lci5zdGFydCgpO1xuXG5cdFx0dGhpcy5yZXBlYXRUZW5UaW1lcyA9IG5ldyBUaW1lcigxMDAsIDEwKTtcblx0XHR0aGlzLnJlcGVhdFRlblRpbWVzLmFkZEV2ZW50TGlzdGVuZXIoVGltZXJFdmVudC5USU1FUiwgKGV2ZW50OlRpbWVyRXZlbnQpID0+IHRoaXMucmVwZWF0VGVuVGltZXNFdmVudChldmVudCkpO1xuXHRcdHRoaXMucmVwZWF0VGVuVGltZXMuYWRkRXZlbnRMaXN0ZW5lcihUaW1lckV2ZW50LlRJTUVSX0NPTVBMRVRFLCAoZXZlbnQ6VGltZXJFdmVudCkgPT4gdGhpcy5yZXBlYXRUZW5UaW1lc0NvbXBsZXRlKGV2ZW50KSk7XG5cdFx0dGhpcy5yZXBlYXRUZW5UaW1lcy5zdGFydCgpO1xuXHR9XG5cblx0cHJpdmF0ZSByZXBlYXRUZW5UaW1lc0V2ZW50KGV2ZW50OlRpbWVyRXZlbnQpOnZvaWRcblx0e1xuXHRcdHZhciB0OlRpbWVyID0gPFRpbWVyPiBldmVudC50YXJnZXQ7XG5cdFx0Y29uc29sZS5sb2coJ3JlcGVhdFRlblRpbWVzRXZlbnQnLCB0LmN1cnJlbnRDb3VudCk7XG5cdH1cblxuXHRwcml2YXRlIHJlcGVhdFRlblRpbWVzQ29tcGxldGUoZXZlbnQ6VGltZXJFdmVudCk6dm9pZFxuXHR7XG5cdFx0dmFyIHQ6VGltZXIgPSA8VGltZXI+IGV2ZW50LnRhcmdldDtcblx0XHRjb25zb2xlLmxvZygncmVwZWF0VGVuVGltZXNDb21wbGV0ZScsIHQuY3VycmVudENvdW50KTtcblx0fVxuXG5cdHByaXZhdGUgb25TZWNUaW1lckV2ZW50KGV2ZW50OlRpbWVyRXZlbnQpOnZvaWRcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdvblNlY1RpbWVyRXZlbnQsIHRpY2snKTtcblx0XHRjb25zb2xlLmxvZygnZ2V0VGltZXIoKSA6ICcsIGdldFRpbWVyKCkpO1xuXHR9XG59Il0sInNvdXJjZVJvb3QiOiIuL3Rlc3RzIn0=
