import DesignSystem from 'design-system-utils'

// your design-system goes here, see below for details
export const myDesignSystem = {
	type: {
		// this should be set as a px value if you have `options.fontSizeUnit` set
		// to 'rem' or 'em' so that the lib can convert the values properly
		baseFontSize: '16px',
		sizes: {
			base: '28px',
		},
	},
	// Color palette
	// Each object needs to have the same shape
	// Each color object needs a `base` value to be the default
	// Have as many color objects as you like
	colors: {
		// Used with `ds.color('colorName')`
		colorPalette: {
			sky: {
				lighter: '#ffffff',
				light: '#f7f9f9',
				base: '#ecf0f1',
			},
			grey: {
				base: '#9E9E9E',
			},
			ink: {
				base: '#4F4F4F',
			},
		},

		// Used with `ds.brand('colorName)`
		brand: {
			sia: '#20ee82', // base is the default
		},
	},

	// Z-index
	// Used with `ds.z()`
	zIndex: {
		base: 1,
	},

	// Spacing
	// Used with `ds.spacing()` or `ds.space()`
	spacing: {
		scale: [8, 16, 32, 48, 64, 128],
	},
}

export default new DesignSystem(myDesignSystem)
