"use strict";
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var RequestAnimationFrameTest = (function () {
    function RequestAnimationFrameTest() {
        var _this = this;
        this.requestAnimationFrameTimer = new RequestAnimationFrame_1.default(this.tick, this);
        this.requestAnimationFrameTimer.start();
        document.onmousedown = function (event) { return _this.onMouseDown(event); };
    }
    RequestAnimationFrameTest.prototype.onMouseDown = function (event) {
        console.log('mouseDown');
        if (this.requestAnimationFrameTimer.active)
            this.requestAnimationFrameTimer.stop();
        else
            this.requestAnimationFrameTimer.start();
    };
    RequestAnimationFrameTest.prototype.tick = function (dt) {
        console.log('tick');
    };
    return RequestAnimationFrameTest;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFrQyw2Q0FBNkMsQ0FBQyxDQUFBO0FBRWhGO0lBSUM7UUFKRCxpQkEwQkM7UUFwQkMsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksK0JBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLENBQUE7UUFFdkMsUUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFDLEtBQVcsSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQXZCLENBQXVCLENBQUM7SUFDakUsQ0FBQztJQUVPLCtDQUFXLEdBQW5CLFVBQW9CLEtBQVc7UUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDO1lBQzFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJO1lBQ0gsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFTyx3Q0FBSSxHQUFaLFVBQWEsRUFBUztRQUVyQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFDRixnQ0FBQztBQUFELENBMUJBLEFBMEJDLElBQUEiLCJmaWxlIjoidXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmNsYXNzIFJlcXVlc3RBbmltYXRpb25GcmFtZVRlc3Rcbntcblx0cHJpdmF0ZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWVUaW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVUaW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLCB0aGlzKTtcblx0XHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVRpbWVyLnN0YXJ0KClcblxuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50OkV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcblx0fVxuXG5cdHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnbW91c2VEb3duJyk7XG5cblx0XHRpZiAodGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVUaW1lci5hY3RpdmUpXG5cdFx0XHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVRpbWVyLnN0b3AoKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVRpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHRwcml2YXRlIHRpY2soZHQ6bnVtYmVyKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ3RpY2snKTtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
