import {IAudioChannel}				from "../managers/IAudioChannel";
import {AudioManager}				from "../managers/AudioManager";
import {AssetBase}				from "../library/AssetBase";

// TODO: Audio should probably be an interface containing play/stop/seek functionality
export class WaveAudio extends AssetBase
{
	public static assetType:string = "[asset WaveAudio]";

	private _audioChannel:IAudioChannel;
	private _volume:number = 1;
	private _pan:number = 0;
	private _buffer:ArrayBuffer;
	private _onSoundComplete:Function;
	private _audioChannels:IAudioChannel[];
	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return WaveAudio.assetType;
	}

	public get pan():number
	{
		return this._pan;
	}

	public set pan(value:number)
	{
		if (this._pan == value)
			return;

		this._pan = value;

		if (this._audioChannel)
			this._audioChannel.pan = this._pan;
	}
	
	public get volume():number
	{
		return this._volume;
	}

	public set volume(value:number)
	{
		if (this._volume == value)
			return;

		this._volume = value;

		if (this._audioChannel)
			this._audioChannel.volume = this._volume;
	}

	public get currentTime():number
	{
		if (this._audioChannel)
			return this._audioChannel.currentTime;

		return 0;
	}

	public get duration():number
	{
		if (this._audioChannel)
			return this._audioChannel.duration;

		return 0;
	}

	/**
	 *
	 */
	constructor(buffer:ArrayBuffer)
	{
		super();
		this._audioChannels=[];
		this._buffer = buffer;
	}

	public dispose():void
	{
		this.stop();
	}

	public play(offset:number, loop:boolean = false):void
	{

		this._audioChannel = AudioManager.getChannel(this._buffer.byteLength);


		if (this._audioChannel) {
			this._audioChannels.push(this._audioChannel);
			this._audioChannel.volume = this._volume;
			this._audioChannel.play(this._buffer, offset, loop, this.id);
			if(this._onSoundComplete){
				this._audioChannel.onSoundComplete=this._onSoundComplete;

			}
		}
	}
	public set onSoundComplete(value:Function)
	{
		this._onSoundComplete=value;
		if (this._audioChannel) {
			this._audioChannel.onSoundComplete=this._onSoundComplete;
		}
	}

	public stop():void
	{
		for(let channel of this._audioChannels){
			channel.stop();
		}

		this._audioChannels.length=0;
		delete this._audioChannel;
		this._audioChannel = null;
	}

	public clone():WaveAudio
	{
		var newInstance:WaveAudio = new WaveAudio(this._buffer);

		newInstance.name = this.name;

		return newInstance;
	}
}