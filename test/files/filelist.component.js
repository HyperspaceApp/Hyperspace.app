import React from 'react'
import { shallow, mount } from 'enzyme'
import { List, OrderedSet } from 'immutable'
import { expect } from 'chai'
import { spy } from 'sinon'
import FileList from '../../plugins/Files/js/components/filelist.js'

const testFiles = List([
	{size: '1337mb', available: true, redundancy: 1.0, uploadprogress: 100, name: 'hackers.mkv', siapath: 'movies/hackers.mkv', type: 'file'},
	{size: '', available: true, redundancy: 1.0, uploadprogress: 100, name: 'movies', type: 'directory'},
	{size: '137mb', available: true, redundancy: 1.5, uploadprogress: 100, name: 'test.jpg', siapath: 'test.jpg', type: 'file'},
	{size: '137mb', available: true, redundancy: 2.0, uploadprogress: 100, name: 'meme.avi', siapath: 'meme.avi', type: 'file'},
	{size: '137mb', available: true, redundancy: -1, uploadprogress: 100, name: 'test-0bytes', siapath: 'test-0bytes', type: 'file'},
	{size: '', available: true, redundancy: 1.0, uploadprogress: 100, name: 'dankpepes', type: 'directory'},
])

const testActions = {
	setPath: spy(),
	selectFile: spy(),
	deselectFile: spy(),
	deselectAll: spy(),
	selectUpTo: spy(),
	setDragUploadEnabled: spy(),
}

describe('file list', () => {
	beforeEach(() => {
		for (const action in testActions) {
			testActions[action].reset()
		}
	})
	it('renders a ul with the correct number of file and directory children', () => {
		const filelist = shallow(<FileList actions={testActions} files={testFiles} selected={OrderedSet()} showSearchField={false} path="" dragFileOrigin={{}} />)
		expect(filelist.find('File')).to.have.length(testFiles.size)
	})
	it('renders a back button when path is set', () => {
		expect(shallow(<FileList actions={testActions} files={testFiles} showSearchField={false} selected={OrderedSet()} path="movies/" dragFileOrigin={{}} />).find('ul').children()).to.have.length(testFiles.size + 1)
	})
	describe('file selection', () => {
		it('selects files', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={OrderedSet()} path="" actions={testActions} dragFileOrigin={{}} />)
			const filenodes = filelist.find('File')
			for (let nodeindex = 0; nodeindex < filenodes.length; nodeindex++) {
				filenodes.at(nodeindex).simulate('click', { ctrlKey: false })
				expect(testActions.deselectAll.called).to.equal(true)
				expect(testActions.selectFile.calledWith(testFiles.get(nodeindex))).to.equal(true)
			}
		})
		it('selects multiple files with ctrl key', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={OrderedSet()} path="" actions={testActions} dragFileOrigin={{}} />)
			const filenodes = filelist.find('File')
			for (let nodeindex = 0; nodeindex < filenodes.length; nodeindex++) {
				filenodes.at(nodeindex).simulate('click', { ctrlKey: true })
				expect(testActions.deselectAll.called).to.equal(false)
				testActions.deselectAll.reset()
				expect(testActions.selectFile.calledWith(testFiles.get(nodeindex))).to.equal(true)
			}
		})
		it('deselects a file when selected and ctrl-clicked', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={OrderedSet([testFiles.get(0), testFiles.get(1)])} path="" actions={testActions} dragFileOrigin={{}} />)
			const filenodes = filelist.find('File')
			filenodes.at(0).simulate('click', { ctrlKey: true })
			expect(testActions.deselectFile.calledWith(testFiles.get(0))).to.equal(true)
		})
		it('exclusively selects a file with multiple selected and no ctrl click', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={OrderedSet([testFiles.get(0), testFiles.get(1)])} path="" actions={testActions} dragFileOrigin={{}} />)
			const filenodes = filelist.find('File')
			filenodes.at(1).simulate('click', { ctrlKey: false})
			expect(testActions.deselectAll.called).to.equal(true)
			expect(testActions.selectFile.calledWith(testFiles.get(1))).to.equal(true)
		})
		it('selects ranges with the shift key', () => {
			const filelist = shallow(<FileList files={testFiles} showSearchField={false} selected={OrderedSet()} path="" actions={testActions} dragFileOrigin={{}} />)
			const filenodes = filelist.find('File')
			filenodes.first().simulate('click', { ctrlKey: false, shiftKey: false })
			filenodes.last().simulate('click', { ctrlKey: false, shiftKey: true })
			expect(testActions.selectUpTo.calledWith(testFiles.last())).to.equal(true)
		})
	})
	it('navigates directories', () => {
		let filelist = mount(<FileList files={testFiles} selected={OrderedSet()} showSearchField={false} path="test1/test2/" actions={testActions} dragFileOrigin={{}} />)
		filelist.find('.back-button').first().simulate('click')
		expect(testActions.setPath.calledWith('test1')).to.equal(true)

		filelist = mount(<FileList files={testFiles} showSearchField={false} selected={OrderedSet()} path="test1/" actions={testActions} dragFileOrigin={{}} />)
		filelist.find('.back-button').first().simulate('click')
		expect(testActions.setPath.calledWith('')).to.equal(true)

		filelist = mount(<FileList files={testFiles} showSearchField={false} selected={OrderedSet()} path="test1/test2/test3/" actions={testActions} dragFileOrigin={{}} />)
		filelist.find('.back-button').first().simulate('click')
		expect(testActions.setPath.calledWith('test1/test2')).to.equal(true)

		const renderedDirectories = filelist.find('File [type="directory"]')
		renderedDirectories.forEach((directory) => {
			directory.find('i').first().simulate('click')
			expect(testActions.setPath.calledWith('test1/' + directory.prop('name'))).to.equal(true)
		})
	})
})
