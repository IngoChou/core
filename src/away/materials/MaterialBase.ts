///<reference path="../_definitions.ts"/>

module away.materials
{
	import IAnimationSet				= away.animators.IAnimationSet;
	import IAnimator					= away.animators.IAnimator;
	import BlendMode					= away.base.BlendMode;
	import IMaterialOwner				= away.base.IMaterialOwner;
	import Stage						= away.base.Stage;
	import Camera						= away.entities.Camera;
	import Event						= away.events.Event;
	import Matrix3D						= away.geom.Matrix3D;
	import AssetType					= away.library.AssetType;
	import IMaterialPass				= away.materials.IMaterialPass;
	import IRenderable					= away.pool.IRenderable;
	import ICollector					= away.traverse.ICollector;

	/**
	 * MaterialBase forms an abstract base class for any material.
	 * A material consists of several passes, each of which constitutes at least one render call. Several passes could
	 * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
	 * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
	 * subsurface scattering, or rendering a depth map for specialized self-shadowing).
	 *
	 * Away3D provides default materials trough SinglePassMaterialBase and TriangleMaterial, which use modular
	 * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
	 * shaders, or entire new material frameworks.
	 */
	export class MaterialBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
		/**
		 * An object to contain any extra data.
		 */
		public extra:Object;

		/**
		 * A value that can be used by materials that only work with a given type of renderer. The renderer can test the
		 * classification to choose which render path to use. For example, a deferred material could set this value so
		 * that the deferred renderer knows not to take the forward rendering path.
		 *
		 * @private
		 */
		public _iClassification:string;


		/**
		 * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
		 *
		 * @private
		 */
		public _iMaterialId:number = 0;

		/**
		 * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
		 *
		 * @private
		 */
		public _iRenderOrderId:number = 0;

		public _iBaseScreenPassIndex:number = 0;

		private _bothSides:boolean = false; // update
		private _animationSet:IAnimationSet;
		public _pScreenPassesInvalid:boolean = true;

		/**
		 * A list of material owners, renderables or custom Entities.
		 */
		private _owners:Array<IMaterialOwner>;

		private _alphaPremultiplied:boolean;

		public _pBlendMode:string = BlendMode.NORMAL;

		private _numPasses:number = 0;
		private _passes:Array<IMaterialPass>;

		public _pMipmap:boolean = false; // Update
		private _smooth:boolean = true;
		private _repeat:boolean = false; // Update

		public _pLightPicker:LightPickerBase;

		public _pHeight:number = 1;
		public _pWidth:number = 1;
		public _pRequiresBlending:boolean = false;

		private _onPassChangeDelegate:(event:Event) => void;
		private _onLightChangeDelegate:(event:Event) => void;

		/**
		 * Creates a new MaterialBase object.
		 */
		constructor()
		{
			super();

			this._iMaterialId = Number(this.id);

			this._owners = new Array<IMaterialOwner>();
			this._passes = new Array<IMaterialPass>();

			this._onPassChangeDelegate = (event:Event) => this.onPassChange(event);
			this._onLightChangeDelegate = (event:Event) => this.onLightsChange(event);

			this.alphaPremultiplied = false; //TODO: work out why this is different for WebGL
		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return AssetType.MATERIAL;
		}

		/**
		 *
		 */
		public get height():number
		{
			return this._pHeight;
		}

		/**
		 * The light picker used by the material to provide lights to the material if it supports lighting.
		 *
		 * @see LightPickerBase
		 * @see StaticLightPicker
		 */
		public get lightPicker():LightPickerBase
		{
			return this._pLightPicker;
		}

		public set lightPicker(value:LightPickerBase)
		{
			if (this._pLightPicker == value)
				return;

			if (this._pLightPicker)
				this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightChangeDelegate);

			this._pLightPicker = value;

			if (this._pLightPicker)
				this._pLightPicker.addEventListener(Event.CHANGE, this._onLightChangeDelegate);

			this.pInvalidateScreenPasses();
		}

		/**
		 * Indicates whether or not any used textures should use mipmapping. Defaults to true.
		 */
		public get mipmap():boolean
		{
			return this._pMipmap;
		}

		public set mipmap(value:boolean)
		{
			if (this._pMipmap == value)
				return;

			this._pMipmap = value;

			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].mipmap = value;
		}

		/**
		 * Indicates whether or not any used textures should use smoothing.
		 */
		public get smooth():boolean
		{
			return this._smooth;
		}

		public set smooth(value:boolean)
		{
			this._smooth = value;

			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].smooth = value;
		}

		/**
		 * Indicates whether or not any used textures should be tiled. If set to false, texture samples are clamped to
		 * the texture's borders when the uv coordinates are outside the [0, 1] interval.
		 */
		public get repeat():boolean
		{
			return this._repeat;
		}

		public set repeat(value:boolean)
		{
			this._repeat = value;

			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].repeat = value;
		}

		/**
		 * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
		 * could be used by other materials and will not be disposed.
		 */
		public dispose()
		{
			var i:number;

			for (i = 0; i < this._numPasses; ++i)
				this._passes[i].dispose();
		}

		/**
		 * Defines whether or not the material should cull triangles facing away from the camera.
		 */
		public get bothSides():boolean
		{
			return this._bothSides;
		}

		public set bothSides(value:boolean)
		{
			this._bothSides = value;

			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].bothSides = value;
		}

		/**
		 * The blend mode to use when drawing this renderable. The following blend modes are supported:
		 * <ul>
		 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
		 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
		 * <li>BlendMode.MULTIPLY</li>
		 * <li>BlendMode.ADD</li>
		 * <li>BlendMode.ALPHA</li>
		 * </ul>
		 */
		public get blendMode():string
		{
			return this._pBlendMode;
		}

		public set blendMode(value:string)
		{
			if (this._pBlendMode == value)
				return;

			this._pBlendMode = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * Indicates whether visible textures (or other pixels) used by this material have
		 * already been premultiplied. Toggle this if you are seeing black halos around your
		 * blended alpha edges.
		 */
		public get alphaPremultiplied():boolean
		{
			return this._alphaPremultiplied;
		}

		public set alphaPremultiplied(value:boolean)
		{
			this._alphaPremultiplied = value;

			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].alphaPremultiplied = value;
		}

		/**
		 * Indicates whether or not the material requires alpha blending during rendering.
		 */
		public get requiresBlending():boolean
		{
			return this._pRequiresBlending;
		}

		/**
		 *
		 */
		public get width():number
		{
			return this._pWidth;
		}

		/**
		 * The amount of passes used by the material.
		 *
		 * @private
		 */
		public get _iNumPasses():number // ARCANE
		{
			return this._numPasses;
		}

		/**
		 * Indicates whether or not the pass with the given index renders to texture or not.
		 * @param index The index of the pass.
		 * @return True if the pass renders to texture, false otherwise.
		 *
		 * @internal
		 */
		public iPassRendersToTexture(index:number):boolean
		{
			return this._passes[index].renderToTexture;
		}

		/**
		 * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
		 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
		 * @param index The index of the pass to activate.
		 * @param stage The Stage object which is currently used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @private
		 */
		public iActivatePass(index:number, stage:Stage, camera:Camera) // ARCANE
		{
			this._passes[index].iActivate(stage, camera);
		}

		/**
		 * Clears the render state for a pass. This needs to be called before activating another pass.
		 * @param index The index of the pass to deactivate.
		 * @param stage The Stage used for rendering
		 *
		 * @internal
		 */
		public iDeactivatePass(index:number, stage:Stage) // ARCANE
		{
			this._passes[index].iDeactivate(stage);
		}

		/**
		 * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
		 * @param index The index of the pass used to render the renderable.
		 * @param renderable The IRenderable object to draw.
		 * @param stage The Stage object used for rendering.
		 * @param entityCollector The EntityCollector object that contains the visible scene data.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 *
		 * @internal
		 */
		public iRenderPass(index:number, renderable:IRenderable, stage:Stage, entityCollector:ICollector, viewProjection:Matrix3D)
		{
			if (this._pLightPicker)
				this._pLightPicker.collectLights(renderable, entityCollector);

			var pass:IMaterialPass = this._passes[index];

			if (renderable.materialOwner.animator)
				pass.iUpdateAnimationState(renderable, stage, entityCollector.camera);

			pass.iRender(renderable, stage, entityCollector.camera, viewProjection);

		}

		//
		// MATERIAL MANAGEMENT
		//
		/**
		 * Mark an IMaterialOwner as owner of this material.
		 * Assures we're not using the same material across renderables with different animations, since the
		 * Programs depend on animation. This method needs to be called when a material is assigned.
		 *
		 * @param owner The IMaterialOwner that had this material assigned
		 *
		 * @internal
		 */
		public iAddOwner(owner:IMaterialOwner)
		{
			this._owners.push(owner);

			var animationSet:IAnimationSet;
			var animator:IAnimator = <IAnimator> owner.animator;

			if (animator)
				animationSet = <IAnimationSet> animator.animationSet;

			if (owner.animator) {
				if (this._animationSet && animationSet != this._animationSet) {
					throw new Error("A Material instance cannot be shared across material owners with different animation sets");
				} else {
					if (this._animationSet != animationSet) {

						this._animationSet = animationSet;

						for (var i:number = 0; i < this._numPasses; ++i)
							this._passes[i].animationSet = this._animationSet;

						this.iInvalidatePasses(null);
					}
				}
			}
		}

		/**
		 * Removes an IMaterialOwner as owner.
		 * @param owner
		 *
		 * @internal
		 */
		public iRemoveOwner(owner:IMaterialOwner)
		{
			this._owners.splice(this._owners.indexOf(owner), 1);

			if (this._owners.length == 0) {
				this._animationSet = null;

				for (var i:number = 0; i < this._numPasses; ++i)
					this._passes[i].animationSet = this._animationSet;

				this.iInvalidatePasses(null);
			}
		}

		/**
		 * A list of the IMaterialOwners that use this material
		 *
		 * @private
		 */
		public get iOwners():Array<IMaterialOwner>
		{
			return this._owners;
		}

		/**
		 * Performs any processing that needs to occur before any of its passes are used.
		 *
		 * @private
		 */
		public iUpdateMaterial()
		{
		}

		/**
		 * Deactivates the last pass of the material.
		 *
		 * @private
		 */
		public iDeactivate(stage:Stage)
		{
			this._passes[this._numPasses - 1].iDeactivate(stage);
		}

		/**
		 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
		 * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
		 * triggering pass, which would result in an infinite loop.
		 *
		 * @private
		 */
		public iInvalidatePasses(triggerPass:IMaterialPass)
		{
			var owner:IMaterialOwner;
			var animator:IAnimator;

			var l:number;
			var c:number;

			// test all passes support animating the animation set in the vertex shader
			// if any object using this material fails to support accelerated animations for any of the passes,
			// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
			for (var i:number = 0; i < this._numPasses; ++i) {
				// only invalidate the pass if it wasn't the triggering pass
				if (this._passes[i] != triggerPass)
					this._passes[i].iInvalidateShaderProgram(false);

				// test if animation will be able to run on gpu BEFORE compiling materials
				// test if the pass supports animating the animation set in the vertex shader
				// if any object using this material fails to support accelerated animations for any of the passes,
				// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
				if (this._animationSet) {
					l = this._owners.length;

					for (c = 0; c < l; c++) {
						owner = this._owners[c];
						animator = <IAnimator> owner.animator;

						if (animator)
							animator.testGPUCompatibility(this._passes[i]);
					}
				}

			}
		}

		/**
		 * Removes a pass from the material.
		 * @param pass The pass to be removed.
		 */
		public pRemovePass(pass:IMaterialPass)
		{
			this._passes.splice(this._passes.indexOf(pass), 1);
			--this._numPasses;
		}

		/**
		 * Removes all passes from the material
		 */
		public pClearPasses()
		{
			for (var i:number = 0; i < this._numPasses; ++i)
				this._passes[i].removeEventListener(Event.CHANGE, this._onPassChangeDelegate);

			this._passes.length = 0;
			this._numPasses = 0;
		}

		/**
		 * Adds a pass to the material
		 * @param pass
		 */
		public pAddPass(pass:IMaterialPass)
		{
			this._passes[this._numPasses++] = pass;

			pass.animationSet = this._animationSet;
			pass.alphaPremultiplied = this._alphaPremultiplied;
			pass.mipmap = this._pMipmap;
			pass.smooth = this._smooth;
			pass.repeat = this._repeat;
			pass.lightPicker = this._pLightPicker;
			pass.bothSides = this._bothSides;
			pass.addEventListener(Event.CHANGE, this._onPassChangeDelegate);

			this.iInvalidatePasses(null);
		}


		/**
		 * Adds any additional passes on which the given pass is dependent.
		 * @param pass The pass that my need additional passes.
		 */
		public pAddChildPassesFor(pass:IMaterialPass)
		{
			if (!pass)
				return;

			if (pass._iPasses) {
				var len:number = pass._iPasses.length;

				for (var i:number = 0; i < len; ++i)
					this.pAddPass(pass._iPasses[i]);
			}
		}

		/**
		 * Listener for when a pass's shader code changes. It recalculates the render order id.
		 */
		private onPassChange(event:Event)
		{
			var mult:number = 1;
			var ids:Array<number>;
			var len:number;

			this._iRenderOrderId = 0;

			for (var i:number = 0; i < this._numPasses; ++i) {

				ids = this._passes[i]._iProgramids;
				len = ids.length;

				for (var j:number = 0; j < len; ++j) {
					if (ids[j] != -1) {
						this._iRenderOrderId += mult*ids[j];
						j = len;
					}
				}

				mult *= 1000;
			}
		}

		/**
		 * Flags that the screen passes have become invalid.
		 */
		public pInvalidateScreenPasses()
		{
			this._pScreenPassesInvalid = true;
		}

		/**
		 * Called when the light picker's configuration changed.
		 */
		private onLightsChange(event:Event)
		{
			this.pInvalidateScreenPasses();
		}
	}
}