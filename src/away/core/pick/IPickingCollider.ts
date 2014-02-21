///<reference path="../../_definitions.ts"/>

/**
 * @module away.pick
 */
module away.pick
{
	/**
	 * Provides an interface for picking colliders that can be assigned to individual entities in a scene for specific picking behaviour.
	 * Used with the <code>RaycastPicker</code> picking object.
	 *
	 * @see away.entities.Entity#pickingCollider
	 * @see away.pick.RaycastPicker
	 *
	 * @interface away.pick.IPickingCollider
	 */
	export interface IPickingCollider
	{
		/**
		 * Sets the position and direction of a picking ray in local coordinates to the entity.
		 *
		 * @param localDirection The position vector in local coordinates
		 * @param localPosition The direction vector in local coordinates
		 */
		setLocalRay(localPosition:away.geom.Vector3D, localDirection:away.geom.Vector3D);

		/**
		 * Tests a <code>IRenderable</code> object for a collision with the picking ray.
		 *
		 * @param renderable The <code>SubMesh</code> instance to be tested.
		 * @param pickingCollisionVO The collision object used to store the collision results
		 * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
		 */
		//testRenderableCollision(renderable:away.render.RenderableBase, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number):boolean
	}
}
