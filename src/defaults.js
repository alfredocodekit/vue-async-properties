import { pick, defaultsDeep, cloneDeep } from 'lodash'

const globalDefaultObject = {
	meta: (propName, metaName) => `${propName}$${metaName}`,
}

const commonLocalDefaultObject = {
	// merge: false
	// mergeFunction: () => {}, // ?
	transform: (result) => result.data,
	// transformCombine: false,
	error: (e) => { console.error(e) },
	// errorCombine: false,
}

const dataLocalDefaultObject = {
	lazy: false,
	debounce: false,
}

const computedLocalDefaultObject = {
	eager: false,
	debounce: {
		wait: 1000,
		options: {}
	}
}

// more is only defaulted if it exists
const moreDefaultObject = {
	concat: (posts, newPosts) => posts.concat(newPosts)
}


export function globalDefaults(options) {
	options = cloneDeep(options || {})
	return defaultsDeep(options, globalDefaultObject)
}


function commonChanges(options) {
	// more is only defaulted if it exists
	if (options.more) {
		if (typeof options.more === 'function') {
			options.more = { get: options.more }
		}

		options.more = defaultsDeep(options.more, moreDefaultObject)
	}

	// transform
	if (options.transform === null) options.transform = (result) => result

	return options
}


export function dataDefaults(options, bigOptions = {}) {
	// the "just pass a function" version
	if (typeof options === 'function') {
		options = { get: options }
	}

	options = cloneDeep(options || {})

	// no debouncing for asyncData
	delete options.debounce

	// common
	options = commonChanges(options)

	return defaultsDeep(options, bigOptions, commonLocalDefaultObject, dataLocalDefaultObject)
}


export function computedDefaults(options, bigOptions = {}) {
	options = cloneDeep(options || {})

	// debouncing
	if (typeof options.debounce === 'number') {
		options.debounce = {
			wait: options.debounce,
			options: {}
		}
	}
	else if (options.debounce === null) options.debounce = false
	else if (options.debounce === undefined) options.debounce = {}
	else options.debounce = {wait: options.debounce.wait, options: pick(options.debounce, 'leading', 'trailing', 'maxWait')}

	// common
	options = commonChanges(options)

	return defaultsDeep(options, bigOptions, commonLocalDefaultObject, computedLocalDefaultObject)
}
