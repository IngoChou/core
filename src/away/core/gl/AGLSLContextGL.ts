///<reference path="../../_definitions.ts"/>

module away.gl
{
	export class AGLSLContextGL extends ContextGL
	{

		private _yFlip:number = -1;

		constructor(canvas:HTMLCanvasElement)
		{
			super(canvas);
		}

		//@override
		public setProgramConstantsFromMatrix(programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false)
		{
			/*
			 console.log( "======== setProgramConstantsFromMatrix ========" );
			 console.log( "programType       >>> " + programType );
			 console.log( "firstRegister     >>> " + firstRegister );
			 console.log( "matrix            >>> " + matrix.rawData );
			 console.log( "transposedMatrix  >>> " + transposedMatrix );
			 */

			var d:number[] = matrix.rawData;
			if (transposedMatrix) {
				this.setProgramConstantsFromArray(programType, firstRegister, [ d[0], d[4], d[8], d[12] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 1, [ d[1], d[5], d[9], d[13] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 2, [ d[2], d[6], d[10], d[14] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 3, [ d[3], d[7], d[11], d[15] ], 1);
			} else {
				this.setProgramConstantsFromArray(programType, firstRegister, [ d[0], d[1], d[2], d[3] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 1, [ d[4], d[5], d[6], d[7] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 2, [ d[8], d[9], d[10], d[11] ], 1);
				this.setProgramConstantsFromArray(programType, firstRegister + 3, [ d[12], d[13], d[14], d[15] ], 1);
			}
		}

		//@override
		public drawTriangles(indexBuffer:IndexBuffer, firstIndex:number = 0, numTriangles:number = -1)
		{
			/*
			 console.log( "======= drawTriangles ========" );
			 console.log( indexBuffer );
			 console.log( "firstIndex: " +  firstIndex );
			 console.log( "numTriangles:" + numTriangles );
			 */
			var location:WebGLUniformLocation = this._gl.getUniformLocation(this._currentProgram.glProgram, "yflip");
			this._gl.uniform1f(location, this._yFlip);
			super.drawTriangles(indexBuffer, firstIndex, numTriangles);
		}

		//@override
		public setCulling(triangleFaceToCull:string)
		{
			super.setCulling(triangleFaceToCull);

			switch (triangleFaceToCull) {
				case ContextGLTriangleFace.FRONT:
					this._yFlip = -1;
					break
				case ContextGLTriangleFace.BACK:
					this._yFlip = 1; // checked
					break;
				case ContextGLTriangleFace.FRONT_AND_BACK:
					this._yFlip = 1;
					break;
				case ContextGLTriangleFace.NONE:
					this._yFlip = 1; // checked
					break;
				default:
					throw "Unknown culling mode " + triangleFaceToCull + ".";
					break;
			}
		}
	}
}