import AttributesBuffer			from "awayjs-core/lib/attributes/AttributesBuffer";
import AttributesView			from "awayjs-core/lib/attributes/AttributesView";

class Float2Attributes extends AttributesView
{
	public static assetType:string = "[attributes Float2Attributes]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return Float2Attributes.assetType;
	}

	/**
	 *
	 */
	constructor(length?:number);
	constructor(attributesBuffer?:AttributesBuffer);
	constructor(attributesBufferLength?:any)
	{
		super(Float32Array, 2, attributesBufferLength)
	}

	public set(array:Array<number>, offset?:number);
	public set(typedArray:Float32Array, offset?:number);
	public set(values:any, offset:number = 0)
	{
		super.set(values, offset);
	}

	public get(count:number, offset:number = 0):Float32Array
	{
		return <Float32Array> super.get(count, offset);
	}

	public _internalClone(attributesBuffer:AttributesBuffer):Float2Attributes
	{
		return (this._cloneCache = new Float2Attributes(attributesBuffer));
	}

	public clone(attributesBuffer:AttributesBuffer = null):Float2Attributes
	{
		return <Float2Attributes> super.clone(attributesBuffer);
	}
}

export default Float2Attributes;