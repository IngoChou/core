///<reference path="../_definitions.ts" />

module away.bounds
{
	import IEntity						= away.entities.IEntity;
	import Matrix3D						= away.geom.Matrix3D;
	import Matrix3DUtils				= away.geom.Matrix3DUtils;
	import PlaneClassification			= away.geom.PlaneClassification;
	import Plane3D						= away.geom.Plane3D;
	import Vector3D						= away.geom.Vector3D;

	/**
	 * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
	 * This is useful for most meshes.
	 */
	export class AxisAlignedBoundingBox extends BoundingVolumeBase
	{
		private _centerX:number = 0;
		private _centerY:number = 0;
		private _centerZ:number = 0;
		private _halfExtentsX:number = 0;
		private _halfExtentsY:number = 0;
		private _halfExtentsZ:number = 0;

		/**
		 * Creates a new <code>AxisAlignedBoundingBox</code> object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public nullify()
		{
			super.nullify();

			this._centerX = this._centerY = this._centerZ = 0;
			this._halfExtentsX = this._halfExtentsY = this._halfExtentsZ = 0;
		}

		/**
		 * @inheritDoc
		 */
		public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
		{
			for (var i:number = 0; i < numPlanes; ++i) {

				var plane:away.geom.Plane3D = planes[i];
				var a:number = plane.a;
				var b:number = plane.b;
				var c:number = plane.c;
				var flippedExtentX:number = a < 0? -this._halfExtentsX : this._halfExtentsX;
				var flippedExtentY:number = b < 0? -this._halfExtentsY : this._halfExtentsY;
				var flippedExtentZ:number = c < 0? -this._halfExtentsZ : this._halfExtentsZ;
				var projDist:number = a*(this._centerX + flippedExtentX) + b*(this._centerY + flippedExtentY) + c*(this._centerZ + flippedExtentZ) - plane.d;

				if (projDist < 0)
					return false;
			}

			return true;
		}

		public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number
		{

			if (this.containsPoint(position))
				return 0;

			var px:number = position.x - this._centerX
			var py:number = position.y - this._centerY
			var pz:number = position.z - this._centerZ;

			var vx:number = direction.x
			var vy:number = direction.y
			var vz:number = direction.z;

			var ix:number;
			var iy:number;
			var iz:number;
			var rayEntryDistance:number;

			// ray-plane tests
			var intersects:boolean;
			if (vx < 0) {
				rayEntryDistance = ( this._halfExtentsX - px )/vx;
				if (rayEntryDistance > 0) {
					iy = py + rayEntryDistance*vy;
					iz = pz + rayEntryDistance*vz;
					if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
						targetNormal.x = 1;
						targetNormal.y = 0;
						targetNormal.z = 0;

						intersects = true;
					}
				}
			}
			if (!intersects && vx > 0) {
				rayEntryDistance = ( -this._halfExtentsX - px )/vx;
				if (rayEntryDistance > 0) {
					iy = py + rayEntryDistance*vy;
					iz = pz + rayEntryDistance*vz;
					if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
						targetNormal.x = -1;
						targetNormal.y = 0;
						targetNormal.z = 0;
						intersects = true;
					}
				}
			}
			if (!intersects && vy < 0) {
				rayEntryDistance = ( this._halfExtentsY - py )/vy;
				if (rayEntryDistance > 0) {
					ix = px + rayEntryDistance*vx;
					iz = pz + rayEntryDistance*vz;
					if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
						targetNormal.x = 0;
						targetNormal.y = 1;
						targetNormal.z = 0;
						intersects = true;
					}
				}
			}
			if (!intersects && vy > 0) {
				rayEntryDistance = ( -this._halfExtentsY - py )/vy;
				if (rayEntryDistance > 0) {
					ix = px + rayEntryDistance*vx;
					iz = pz + rayEntryDistance*vz;
					if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
						targetNormal.x = 0;
						targetNormal.y = -1;
						targetNormal.z = 0;
						intersects = true;
					}
				}
			}
			if (!intersects && vz < 0) {
				rayEntryDistance = ( this._halfExtentsZ - pz )/vz;
				if (rayEntryDistance > 0) {
					ix = px + rayEntryDistance*vx;
					iy = py + rayEntryDistance*vy;
					if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
						targetNormal.x = 0;
						targetNormal.y = 0;
						targetNormal.z = 1;
						intersects = true;
					}
				}
			}
			if (!intersects && vz > 0) {
				rayEntryDistance = ( -this._halfExtentsZ - pz )/vz;
				if (rayEntryDistance > 0) {
					ix = px + rayEntryDistance*vx;
					iy = py + rayEntryDistance*vy;
					if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
						targetNormal.x = 0;
						targetNormal.y = 0;
						targetNormal.z = -1;
						intersects = true;
					}
				}
			}

			return intersects? rayEntryDistance : -1;
		}

		/**
		 * @inheritDoc
		 */
		public containsPoint(position:Vector3D):boolean
		{
			var px:number = position.x - this._centerX, py:number = position.y - this._centerY, pz:number = position.z - this._centerZ;
			return px <= this._halfExtentsX && px >= -this._halfExtentsX && py <= this._halfExtentsY && py >= -this._halfExtentsY && pz <= this._halfExtentsZ && pz >= -this._halfExtentsZ;
		}

		/**
		 * @inheritDoc
		 */
		public fromExtremes(minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number)
		{

			this._centerX = (maxX + minX)*.5;
			this._centerY = (maxY + minY)*.5;
			this._centerZ = (maxZ + minZ)*.5;
			this._halfExtentsX = (maxX - minX)*.5;
			this._halfExtentsY = (maxY - minY)*.5;
			this._halfExtentsZ = (maxZ - minZ)*.5;

			super.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);

		}

		/**
		 * @inheritDoc
		 */
		public clone():BoundingVolumeBase
		{
			var clone:AxisAlignedBoundingBox = new AxisAlignedBoundingBox();
			clone.fromExtremes(this._aabb.x, this._aabb.y + this._aabb.height, this._aabb.z, this._aabb.x + this._aabb.width, this._aabb.y, this._aabb.z + this._aabb.depth);
			return clone;
		}

		public get halfExtentsX():number
		{
			return this._halfExtentsX;
		}

		public get halfExtentsY():number
		{
			return this._halfExtentsY;
		}

		public get halfExtentsZ():number
		{
			return this._halfExtentsZ;
		}

		/**
		 * Finds the closest point on the bounding volume to another given point. This can be used for maximum error calculations for content within a given bound.
		 * @param point The point for which to find the closest point on the bounding volume
		 * @param target An optional Vector3D to store the result to prevent creating a new object.
		 * @return
		 */
		public closestPointToPoint(point:Vector3D, target:Vector3D = null):Vector3D
		{
			var p:number;

			if (target == null)
				target = new Vector3D();

			p = point.x;
			if (p < this._aabb.x)
				p = this._aabb.x;
			if (p > this._aabb.x + this._aabb.width)
				p = this._aabb.x + this._aabb.width;
			target.x = p;

			p = point.y;
			if (p < this._aabb.y + this._aabb.height)
				p = this._aabb.y + this._aabb.height;
			if (p > this._aabb.y)
				p = this._aabb.y;
			target.y = p;

			p = point.z;
			if (p < this._aabb.z)
				p = this._aabb.z;
			if (p > this._aabb.z + this._aabb.depth)
				p = this._aabb.z + this._aabb.depth;
			target.z = p;

			return target;
		}

		public pUpdateBoundingRenderable()
		{
			this._pBoundingEntity.transform.scale.x = Math.max(this._halfExtentsX*2, 0.001);
			this._pBoundingEntity.transform.scale.y = Math.max(this._halfExtentsY*2, 0.001);
			this._pBoundingEntity.transform.scale.z = Math.max(this._halfExtentsZ*2, 0.001);
			this._pBoundingEntity.transform.position.x = this._centerX;
			this._pBoundingEntity.transform.position.y = this._centerY;
			this._pBoundingEntity.transform.position.z = this._centerZ;
		}

		public pCreateBoundingEntity():IEntity
		{
			return null;//<away.primitives.WireframePrimitiveBase> new away.primitives.WireframeCube(1, 1, 1, 0xffffff, 0.5);
		}

		public classifyToPlane(plane:Plane3D):number
		{
			var a:number = plane.a;
			var b:number = plane.b;
			var c:number = plane.c;
			var centerDistance:number = a*this._centerX + b*this._centerY + c*this._centerZ - plane.d;

			if (a < 0)
				a = -a;

			if (b < 0)
				b = -b;

			if (c < 0)
				c = -c;

			var boundOffset:number = a*this._halfExtentsX + b*this._halfExtentsY + c*this._halfExtentsZ;

			return centerDistance > boundOffset? PlaneClassification.FRONT : centerDistance < -boundOffset? PlaneClassification.BACK : PlaneClassification.INTERSECT;
		}

		public transformFrom(bounds:BoundingVolumeBase, matrix:Matrix3D)
		{
			var aabb:AxisAlignedBoundingBox = <AxisAlignedBoundingBox> bounds;
			var cx:number = aabb._centerX;
			var cy:number = aabb._centerY;
			var cz:number = aabb._centerZ;
			var raw:number[] = Matrix3DUtils.RAW_DATA_CONTAINER;

			matrix.copyRawDataTo(raw);

			var m11:number = raw[0], m12:number = raw[4], m13:number = raw[8], m14:number = raw[12];
			var m21:number = raw[1], m22:number = raw[5], m23:number = raw[9], m24:number = raw[13];
			var m31:number = raw[2], m32:number = raw[6], m33:number = raw[10], m34:number = raw[14];

			this._centerX = cx*m11 + cy*m12 + cz*m13 + m14;
			this._centerY = cx*m21 + cy*m22 + cz*m23 + m24;
			this._centerZ = cx*m31 + cy*m32 + cz*m33 + m34;

			if (m11 < 0)
				m11 = -m11;
			if (m12 < 0)
				m12 = -m12;
			if (m13 < 0)
				m13 = -m13;
			if (m21 < 0)
				m21 = -m21;
			if (m22 < 0)
				m22 = -m22;
			if (m23 < 0)
				m23 = -m23;
			if (m31 < 0)
				m31 = -m31;
			if (m32 < 0)
				m32 = -m32;
			if (m33 < 0)
				m33 = -m33;
			var hx:number = aabb._halfExtentsX;
			var hy:number = aabb._halfExtentsY;
			var hz:number = aabb._halfExtentsZ;
			this._halfExtentsX = hx*m11 + hy*m12 + hz*m13;
			this._halfExtentsY = hx*m21 + hy*m22 + hz*m23;
			this._halfExtentsZ = hx*m31 + hy*m32 + hz*m33;

			this._aabb.width = this._aabb.height = this._aabb.depth = this._halfExtentsX*2;
			this._aabb.x = this._centerX - this._halfExtentsX;
			this._aabb.y = this._centerY + this._halfExtentsY;
			this._aabb.z = this._centerZ - this._halfExtentsZ;
		}
	}
}
