import {ParserUtils}				from "../parsers/ParserUtils";
import {IAudioChannel}				from "./IAudioChannel";
export class EventAudioChannel
{
	public static maxChannels:number = 4;

	public static _channels:Array<EventAudioChannel> = new Array<EventAudioChannel>();

	public static _base64Cache:Object = new Object();

	private _isPlaying:boolean = false;
	private _isLooping:boolean = false;
	private _volume:number;
	private _startTime:number = 0;
	private _duration:number;

	public onSoundComplete:Function;
	private _audio:HTMLAudioElement;

	public static stopAllSounds(){
		var channel:IAudioChannel;
		var len:number = EventAudioChannel._channels.length;
		for (var j:number = 0; j < len; j++) {
			channel = EventAudioChannel._channels[j];
			channel.stop();
		}
		EventAudioChannel._channels.length=0;
	}

	public get duration():number
	{
		return this._duration;
	}

	public get currentTime():number
	{
		return this._audio.currentTime - this._startTime;
	}

	public get pan():number
	{
		//todo
		return 0;
	}

	public set pan(value:number)
	{
		//todo
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

		this._audio.volume = this._volume;
	}

	public isPlaying():boolean
	{
		return this._isPlaying;
	}

	public isLooping():boolean
	{
		return this._isLooping;
	}

	public isDecoding():boolean
	{
		return false;
	}

	constructor()
	{
		this._audio = new Audio();
		this._audio.ontimeupdate = (event) => this._onTimeUpdate(event);
	}
	
	public play(buffer:ArrayBuffer, offset:number = 0, loop:boolean = false, id:number = 0):void
	{
		this._isPlaying = true;
		this._isLooping = loop;

		this._audio.src = EventAudioChannel._base64Cache[id] || (EventAudioChannel._base64Cache[id] = ParserUtils.arrayBufferToBase64(buffer, "audio/mp3"));
		this._audio.loop = this._isLooping;
		var thisAudio=this._audio;
		this._audio.addEventListener('loadedmetadata', function() {
			thisAudio.currentTime = offset;
			thisAudio.play();
		}, false);
	}

	public stop():void
	{
		this._audio.pause();
		this._isPlaying = false;
		this._isLooping = false;
	}

	private _onTimeUpdate(event):void
	{
		//TODO: more accurate end detection
		if (!this._isLooping && this._duration < this._audio.currentTime - this._startTime + 0.1)
			this.stop();
	}
}