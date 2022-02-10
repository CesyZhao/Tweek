export enum ShortCutKey {
	'MediaNextTrack',
	'MediaPreviousTrack',
	'MediaPlayPause'
}

export const ShortCutKeyMap = new Map([
	[ShortCutKey.MediaNextTrack, 'next'],
	[ShortCutKey.MediaPreviousTrack, 'prev'],
	[ShortCutKey.MediaPlayPause, 'togglePlaying'],
])

export const ShortCutKeyConfig = [
	ShortCutKey.MediaNextTrack,
	ShortCutKey.MediaPreviousTrack,
	ShortCutKey.MediaPlayPause
].map(key => { key: ShortCutKeyMap.get(key) })