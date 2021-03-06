/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */
window.Sitegeist.Objects.plugin.registerConverter('collection', ({payload}, convertPropertiesRecursively) => {
	return Promise.all(payload.map(async item => ({
		...item,
		payload: {
			...item.payload,
			properties: await convertPropertiesRecursively(item.payload.transient),
			transient: undefined
		}
	})));
});
