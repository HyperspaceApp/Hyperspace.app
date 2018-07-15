/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import UploadButton from '../../plugins/Files/js/components/uploadbutton.js'

const hyperspaceOpenFilesArg = {
	title: 'Choose a file to upload',
	properties: ['openFile', 'multiSelections'],
}

const hyperspaceOpenFoldersArg = {
	title: 'Choose a folder to upload',
	properties: ['openDirectory'],
}

const testButton = (files, isDir) => {
	const uploadSpy = sinon.spy()
	const testActions = {
		showUploadDialog: uploadSpy,
	}
	const openFileSpy = sinon.spy( () => files )
	global.HyperspaceAPI = { openFile: openFileSpy }
	const uploadButton = shallow(<UploadButton contracts={18} actions={testActions} />)
	if (isDir) {
		uploadButton.find('.upload-button').at(1).simulate('click')
	} else {
		uploadButton.find('.upload-button').first().simulate('click')
	}
	return {uploadSpy, openFileSpy}
}

describe('files upload button component', () => {
	it('dispatches proper action for a single file upload', () => {
		const testFiles = ['filename.png']
		const spies = testButton(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(hyperspaceOpenFilesArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple file upload', () => {
		const testFiles = ['filename.png', 'file2.jpg', 'files3.pdf', 'cat.gifs']
		const spies = testButton(testFiles)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFiles)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(hyperspaceOpenFilesArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a single folder upload', () => {
		const testFolders = ['I am a folder.']
		const spies = testButton(testFolders, true)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFolders)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(hyperspaceOpenFoldersArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})

	it('dispatches proper action for a multiple folder upload', () => {
		const testFolders = ['Folders ', '987238479Holder', 'Yeah I\'m a folder.', 'Me too!']
		const spies = testButton(testFolders, true)
		expect(spies.uploadSpy.alwaysCalledWithExactly(testFolders)).to.be.true
		expect(spies.uploadSpy.calledOnce).to.be.true
		expect(spies.openFileSpy.alwaysCalledWithExactly(hyperspaceOpenFoldersArg)).to.be.true
		expect(spies.openFileSpy.calledOnce).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
