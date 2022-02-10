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