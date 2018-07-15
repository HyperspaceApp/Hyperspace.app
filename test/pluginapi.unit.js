/* eslint-disable no-unused-expressions */
/* eslint-disable no-invalid-this */
import { expect } from 'chai'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import proxyquire from 'proxyquire'
import React from 'react'
import DisabledPlugin from '../js/rendererjs/disabledplugin.js'

let running = true
const mock = {
	'react-dom': {
		render: sinon.spy(),
	},
	'hyperspace.js': {
		isRunning: () => new Promise((resolve) => {
			resolve(running)
		}),
		launch: sinon.spy(),
	},
	'electron': {
		remote: {
			getCurrentWindow: sinon.spy(),
			getGlobal: (name) => {
				if (name === 'config') {
					return {
						hsd: {
							path: 'testpath/hsd',
							datadir: 'testpath/datadir',
							detached: false,
						},
					}
				}
				return null
			},
			dialog: {
				showOpenDialog: sinon.spy(),
				showSaveDialog: sinon.spy(),
				showMessageBox: sinon.spy(),
				showErrorBox: sinon.spy(),
			},
			require: sinon.spy(),
		},
	},
}

proxyquire('../js/rendererjs/pluginapi.js', mock)

describe('plugin API', () => {
	it('creates a HyperspaceAPI window object', () => {
		expect(window.HyperspaceAPI).to.exist
	})
	it('does not mount disabled plugin component if hsd is running', function(done) {
		running = true
		this.timeout(10000)
		const poll = setInterval(() => {
			if (mock['react-dom'].render.called === false) {
				clearInterval(poll)
				done()
			}
		}, 50)
	})
	it('mounts disabled plugin if hsd is not running', function(done) {
		running = false
		this.timeout(10000)
		const poll = setInterval(() => {
			if (mock['react-dom'].render.called === true) {
				clearInterval(poll)
				done()
			}
		}, 50)
	})
	describe('DisabledPlugin component', () => {
		it('calls hyperspacejs.launch on click', () => {
			const component = shallow(<DisabledPlugin startHsd={mock['hyperspace.js'].launch} />)
			component.find('button').first().simulate('click')
			expect(mock['hyperspace.js'].launch.called).to.be.true
		})
	})
})
/* eslint-enable no-unused-expressions */
/* eslint-enable no-invalid-this */
