///<reference path="../../build/awayjs.next.d.ts" />
//<reference path="../../src/awayjs.ts" />
var tests;
(function (tests) {
    (function (entities) {
        var View = away.containers.View;
        var Billboard = away.entities.Billboard;
        var AssetLibrary = away.library.AssetLibrary;
        var CSSMaterialBase = away.materials.CSSMaterialBase;
        var ImageTexture = away.textures.ImageTexture;
        var URLLoader = away.net.URLLoader;
        var URLRequest = away.net.URLRequest;
        var Delegate = away.utils.Delegate;
        var RequestAnimationFrame = away.utils.RequestAnimationFrame;

        var BillboardEntityTest = (function () {
            function BillboardEntityTest() {
                this._move = false;
                //load an image
                AssetLibrary.load(new URLRequest('assets/256x256.png'));

                //listen for a resource complete event
                AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, Delegate.create(this, this.onResourceComplete));
            }
            /**
            * Listener for resource complete event
            *
            * @param event
            */
            BillboardEntityTest.prototype.onResourceComplete = function (event) {
                var _this = this;
                //get the image texture
                this._imageTexture = event.assets[0];

                //create the view
                this._view = new away.containers.View(new away.render.CSSDefaultRenderer());

                //create a bitmap material
                this._bitmapMaterial = new away.materials.CSSMaterialBase(this._imageTexture);

                var billboard;
                var numBillboards = 500;
                for (var i = 0; i < numBillboards; i++) {
                    billboard = new away.entities.Billboard(this._bitmapMaterial, 50, 50);
                    billboard.x = Math.cos(i * 32 * Math.PI / numBillboards) * 400 * Math.sin(i * Math.PI / numBillboards);
                    billboard.y = Math.sin(i * 32 * Math.PI / numBillboards) * 400 * Math.sin(i * Math.PI / numBillboards);
                    billboard.z = Math.cos(i * Math.PI / numBillboards) * 400;
                    billboard.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
                    billboard.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;

                    //add billboard to the scene
                    this._view.scene.addChild(billboard);
                }

                this._hoverControl = new away.controllers.HoverController(this._view.camera, null, 150, 10);

                document.onmousedown = function (event) {
                    return _this.onMouseDownHandler(event);
                };
                document.onmouseup = function (event) {
                    return _this.onMouseUpHandler(event);
                };
                document.onmousemove = function (event) {
                    return _this.onMouseMove(event);
                };

                window.onresize = function (event) {
                    return _this.onResize(event);
                };

                //trigger an initial resize for the view
                this.onResize(null);

                //setup the RAF for a render listener
                this._timer = new away.utils.RequestAnimationFrame(this.render, this);
                this._timer.start();
            };

            BillboardEntityTest.prototype.onResize = function (event) {
                this._view.x = 0;
                this._view.y = 0;
                this._view.width = window.innerWidth;
                this._view.height = window.innerHeight;
            };

            BillboardEntityTest.prototype.render = function (dt) {
                //			this._billboard1.rotationY += 1;
                //			this._billboard3.rotationY += 1;
                this._view.render();
            };

            BillboardEntityTest.prototype.onMouseUpHandler = function (event) {
                this._move = false;
            };

            BillboardEntityTest.prototype.onMouseMove = function (event) {
                if (this._move) {
                    this._hoverControl.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                    this._hoverControl.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
                }
            };

            BillboardEntityTest.prototype.onMouseDownHandler = function (event) {
                this._lastPanAngle = this._hoverControl.panAngle;
                this._lastTiltAngle = this._hoverControl.tiltAngle;
                this._lastMouseX = event.clientX;
                this._lastMouseY = event.clientY;
                this._move = true;
            };
            return BillboardEntityTest;
        })();
        entities.BillboardEntityTest = BillboardEntityTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=BillboardEntityTest.js.map
