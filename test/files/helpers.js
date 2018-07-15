import { expect } from 'chai'
import { searchFiles, minRedundancy, minUpload, uploadDirectory, rangeSelect, readableFilesize, ls, buildTransferTimes, addTransferSpeeds } from '../../plugins/Files/js/sagas/helpers.js'
import { List, OrderedSet, Map } from 'immutable'
import proxyquire from 'proxyquire'
import Path from 'path'
import * as actions from '../../plugins/Files/js/actions/files.js'

describe('files plugin helper functions', () => {
	it('returns sane values from readableFilesize', () => {
		const sizes = {
			1 : '1 B',
			1000 : '1 KB',
			10000 : '10 KB',
			100000 : '100 KB',
			1000000 : '1 MB',
			10000000 : '10 MB',
			100000000 : '100 MB',
			1000000000 : '1 GB',
			10000000000 : '10 GB',
			100000000000 : '100 GB',
			1000000000000 : '1 TB',
			10000000000000 : '10 TB',
			100000000000000 : '100 TB',
			1000000000000000 : '1 PB',
		}
		for (const bytes in sizes) {
			expect(readableFilesize(parseFloat(bytes))).to.equal(sizes[bytes])
		}
	})
	describe('directory upload', () => {
		const uploadDirectoryWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).uploadDirectory

		it('handles unix paths correctly', () => {
			const directoryTree = List([
				'/tmp/test/testfile.png',
				'/tmp/test/test_file.pdf',
				'/tmp/test/testdir/testfile.png',
				'/tmp/test/testdir/test.png',
			])
			expect(uploadDirectory('/tmp/test', directoryTree, 'testhyperspacepath')).to.deep.equal(List([
				actions.uploadFile('testhyperspacepath/test', '/tmp/test/testfile.png'),
				actions.uploadFile('testhyperspacepath/test', '/tmp/test/test_file.pdf'),
				actions.uploadFile('testhyperspacepath/test/testdir', '/tmp/test/testdir/testfile.png'),
				actions.uploadFile('testhyperspacepath/test/testdir', '/tmp/test/testdir/test.png'),
			]))
		})
		it('handles windows paths correctly', () => {
			const directoryTree = List([
				'C:\\tmp\\test\\testfile.png',
				'C:\\tmp\\test\\test_file.pdf',
				'C:\\tmp\\test\\testdir\\testfile.png',
				'C:\\tmp\\test\\testdir\\test.png',
			])
			expect(uploadDirectoryWin32('C:\\tmp\\test', directoryTree, 'testhyperspacepath')).to.deep.equal(List([
				actions.uploadFile('testhyperspacepath/test', 'C:\\tmp\\test\\testfile.png'),
				actions.uploadFile('testhyperspacepath/test', 'C:\\tmp\\test\\test_file.pdf'),
				actions.uploadFile('testhyperspacepath/test/testdir', 'C:\\tmp\\test\\testdir\\testfile.png'),
				actions.uploadFile('testhyperspacepath/test/testdir', 'C:\\tmp\\test\\testdir\\test.png'),
			]))
		})
	})
	describe('range selection', () => {
		const testFiles = List([
			{ hyperspacepath: 'test1' },
			{ hyperspacepath: 'test2' },
			{ hyperspacepath: 'test3' },
			{ hyperspacepath: 'test4' },
			{ hyperspacepath: 'test5' },
		])
		it('selects all from first -> last', () => {
			const selected = OrderedSet([
				{ hyperspacepath: 'test1' },
			])
			expect(rangeSelect(testFiles.last(), testFiles, selected).toArray()).to.deep.equal(testFiles.toArray())
		})
		it('selects all from last -> first', () => {
			const selected = OrderedSet([
				{ hyperspacepath: 'test5' },
			])
			expect(rangeSelect(testFiles.first(), testFiles, selected).toArray()).to.deep.equal(testFiles.reverse().toArray())
		})
		it('adds selections correctly top -> bottom', () => {
			const selected = OrderedSet([
				{ hyperspacepath: 'test2' },
			])
			const expectedSelection = [
				{ hyperspacepath: 'test2' },
				{ hyperspacepath: 'test3' },
			]
			expect(rangeSelect({ hyperspacepath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly bottom -> top', () => {
			const selected = OrderedSet([
				{ hyperspacepath: 'test4' },
			])
			const expectedSelection = [
				{ hyperspacepath: 'test4' },
				{ hyperspacepath: 'test3' },
				{ hyperspacepath: 'test2' },
			]
			expect(rangeSelect({ hyperspacepath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks top -> bottom', () => {
			let selected = OrderedSet([
				{ hyperspacepath: 'test1' },
			])
			let expectedSelection = [
				{ hyperspacepath: 'test1' },
				{ hyperspacepath: 'test2' },
				{ hyperspacepath: 'test3' },
			]
			expect(rangeSelect({ hyperspacepath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ hyperspacepath: 'test1' },
				{ hyperspacepath: 'test2' },
			]
			expect(rangeSelect({ hyperspacepath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks bottom -> top', () => {
			let selected = OrderedSet([
				{ hyperspacepath: 'test5' },
			])
			let expectedSelection = [
				{ hyperspacepath: 'test5' },
				{ hyperspacepath: 'test4' },
				{ hyperspacepath: 'test3' },
			]
			expect(rangeSelect({ hyperspacepath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ hyperspacepath: 'test5' },
				{ hyperspacepath: 'test4' },
			]
			expect(rangeSelect({ hyperspacepath: 'test4' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
	})
	describe('ls helper function', () => {
		const lsWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).ls
		it('should ls a file list correctly', () => {
			const hyperspacepathInputs = List([
				{ filesize: 1337, hyperspacepath: 'folder/file.jpg', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 50 },
				{ filesize: 13117, hyperspacepath: 'folder/file2.jpg', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1237, hyperspacepath: 'rare_pepe.png', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1317, hyperspacepath: 'memes/waddup.png', hyperspaceAppFolder: false, redundancy: 2.5, available: true, uploadprogress: 10 },
				{ filesize: 1337, hyperspacepath: 'memes/itsdatboi.mov', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 20 },
				{ filesize: 1337, hyperspacepath: 'memes/rares/lordkek.gif', hyperspaceAppFolder: false, redundancy: 1.6, available: true, uploadprogress: 30 },
				{ filesize: 13117, hyperspacepath: 'sibyl_system.avi', hyperspaceAppFolder: false, redundancy: 1.0, available: true, uploadprogress: 75 },
				{ filesize: 13117, hyperspacepath: 'test_0bytes.avi', hyperspaceAppFolder: false, redundancy: -1, available: true, uploadprogress: 100 },
				{ filesize: 1331, hyperspacepath: 'doggos/borkborkdoggo.png', hyperspaceAppFolder: false, redundancy: 1.5, available: true, uploadprogress: 100 },
				{ filesize: 1333, hyperspacepath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', hyperspaceAppFolder: false, redundancy: 1.0, available: true, uploadprogress: 100 },
			])
			const expectedOutputs = {
				'': List([
					{ size: readableFilesize(1331+1333), name: 'doggos', hyperspacepath: 'doggos/', redundancy: 1.0, available: true, hyperspaceAppFolder: false, uploadprogress: 100, type: 'directory' },
					{ size: readableFilesize(1337+13117), name: 'folder', hyperspacepath: 'folder/', redundancy: 2.0, available: true, hyperspaceAppFolder: false, uploadprogress: 50, type: 'directory' },
					{ size: readableFilesize(1317+1337+1337), name: 'memes', hyperspacepath: 'memes/', redundancy: 1.6, available: true, hyperspaceAppFolder: false, uploadprogress: 10, type: 'directory' },
					{ size: readableFilesize(1237), name: 'rare_pepe.png', hyperspacepath: 'rare_pepe.png', redundancy: 2.0, available: true, hyperspaceAppFolder: false, uploadprogress: 100, type: 'file' },
					{ size: readableFilesize(13117), name: 'sibyl_system.avi', hyperspacepath: 'sibyl_system.avi', redundancy: 1.0, available: true, hyperspaceAppFolder: false, uploadprogress: 75, type: 'file' },
					{ size: readableFilesize(13117), name: 'test_0bytes.avi', hyperspacepath: 'test_0bytes.avi', redundancy: -1.0, available: true, hyperspaceAppFolder: false, uploadprogress: 100, type: 'file'},
				]),
				'doggos/': List([
					{ size: readableFilesize(1331), name: 'borkborkdoggo.png', hyperspacepath: 'doggos/borkborkdoggo.png', redundancy: 1.5, available: true, hyperspaceAppFolder: false, uploadprogress: 100, type: 'file' },
					{ size: readableFilesize(1333), name: 'snip_snip_doggo_not_bork_bork_kind.jpg', redundancy: 1.0, hyperspacepath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', available: true, hyperspaceAppFolder: false, uploadprogress: 100, type: 'file' },
				]),
				'memes/': List([
					{ size: readableFilesize(1337), name: 'rares', hyperspacepath: 'memes/rares/', available: true, hyperspaceAppFolder: false,  redundancy: 1.6, uploadprogress: 30, type: 'directory' },
					{ size: readableFilesize(1337), name: 'itsdatboi.mov', hyperspacepath: 'memes/itsdatboi.mov', redundancy: 2.0, hyperspaceAppFolder: false, available: true, uploadprogress: 20, type: 'file' },
					{ size: readableFilesize(1317), name: 'waddup.png', hyperspacepath: 'memes/waddup.png', available: true, hyperspaceAppFolder: false, redundancy: 2.5, uploadprogress: 10, type: 'file' },
				]),
			}
			for (const path in expectedOutputs) {
				const output = ls(hyperspacepathInputs, path)
				const outputWin32 = lsWin32(hyperspacepathInputs, path)
				expect(output).to.deep.equal(outputWin32)
				expect(output.size).to.equal(expectedOutputs[path].size)
				expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
			}
		})
		it('should work with hyperspacepaths that have a folder or file ending in ..', () => {
			const hyperspacepathInputs = List([
				{ filesize: 1000, hyperspacepath: 'test/test/..test.png', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1000, hyperspacepath: 'test/test../test.png', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100},
			])
			const expectedOutputs = {
				'': List([
					{ size: readableFilesize(1000+1000), name: 'test', hyperspacepath: 'test/', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100, type: 'directory' },
				]),
				'test': List([
					{ size: readableFilesize(1000), name: 'test', hyperspacepath: 'test/test/', hyperspaceAppFolder: false, redundancy: 2.0, available: true, uploadprogress: 100, type: 'directory' },
					{ size: readableFilesize(1000), name: 'test..', hyperspacepath: 'test/test../', redundancy: 2.0, hyperspaceAppFolder: false, available: true, uploadprogress: 100, type: 'directory' },
				]),
				'test/test': List([
					{ size: readableFilesize(1000), name: '..test.png', hyperspacepath: 'test/test/..test.png', redundancy: 2.0, hyperspaceAppFolder: false, available: true, uploadprogress: 100, type: 'file' },
				]),
			}
			for (const path in expectedOutputs) {
				const output = ls(hyperspacepathInputs, path)
				const outputWin32 = lsWin32(hyperspacepathInputs, path)
				expect(output).to.deep.equal(outputWin32)
				expect(output.size).to.equal(expectedOutputs[path].size)
				expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
			}
		})
	})
	describe('minRedundancy', () => {
		it('returns correct values for list of size 0', () => {
			expect(minRedundancy(List())).to.equal(0)
		})
		it('returns correct values given a list of files', () => {
			expect(minRedundancy(List([{redundancy: 0.5}, {redundancy: 1.2}, {redundancy: 1.3}, {redundancy: 0.2}]))).to.equal(0.2)
		})
		it('ignores negative redundancy values', () => {
			expect(minRedundancy(List([{redundancy: -1}, {redundancy: 1.5}, {redundancy: 1.1}]))).to.equal(1.1)
		})
		it('returns correct values for a list of only negative redundancy', () => {
			expect(minRedundancy(List([{redundancy: -1}, {redundancy: -1}]))).to.equal(-1)
		})
	})
	describe('minUpload', () => {
		it('returns correct values for list of size 0', () => {
			expect(minUpload(List())).to.equal(0)
		})
		it('returns correct values given a list of files', () => {
			expect(minUpload(List([{uploadprogress: 10}, {uploadprogress: 25}, {uploadprogress: 100}, {uploadprogress: 115}]))).to.equal(10)
		})
	})
	describe('buildTransferTimes', () => {
		it('correctly appends new transfers to a set of previous transfer times', () => {
			const previousTransferTimes = Map({
				'hyperspacepath1': { timestamps: [1, 2], bytes: [10, 20] },
				'hyperspacepath2': { timestamps: [1, 2, 3, 4, 5], bytes: [10, 20, 30, 40, 50] },
			})
			const transfers = List([
				{ hyperspacepath: 'hyperspacepath1', bytestransferred: 60 },
				{ hyperspacepath: 'hyperspacepath2', bytestransferred: 70 },
				{ hyperspacepath: 'hyperspacepath3', bytestransferred: 80 },
			])
			const transferTimes = buildTransferTimes(previousTransferTimes, transfers)
			expect(transferTimes.get('hyperspacepath1').timestamps.length).to.equal(3)
			expect(transferTimes.get('hyperspacepath1').bytes.length).to.equal(3)
			expect(transferTimes.get('hyperspacepath1').bytes[2]).to.equal(60)
			expect(transferTimes.get('hyperspacepath2').timestamps.length).to.equal(5)
			expect(transferTimes.get('hyperspacepath2').bytes.length).to.equal(5)
			expect(transferTimes.get('hyperspacepath2').timestamps[0]).to.equal(2)
			expect(transferTimes.get('hyperspacepath2').bytes[0]).to.equal(20)
			expect(transferTimes.get('hyperspacepath2').bytes[4]).to.equal(70)
			expect(transferTimes.get('hyperspacepath3').timestamps.length).to.equal(1)
			expect(transferTimes.get('hyperspacepath3').bytes.length).to.equal(1)
			expect(transferTimes.get('hyperspacepath3').bytes[0]).to.equal(80)
		})
	})
	describe('addTransferSpeeds', () => {
		it('correctly appends speeds to a set of previous transfer times', () => {
			const transferTimes = Map({
				'hyperspacepath1': { timestamps: [1, 2000], bytes: [10, 4000000] },
				'hyperspacepath2': { timestamps: [1, 2, 3, 4, 5000], bytes: [10, 20, 30, 40, 10000] },
				'hyperspacepath3': { timestamps: [1000, 2000], bytes: [50, 60] },
			})
			const untimedTransfers = List([
				{ hyperspacepath: 'hyperspacepath1', bytestransferred: 4000000 },
				{ hyperspacepath: 'hyperspacepath2', bytestransferred: 10000 },
				{ hyperspacepath: 'hyperspacepath3', bytestransferred: 60 },
			])
			const timedTransfers = addTransferSpeeds(untimedTransfers, transferTimes)
			expect(timedTransfers.get(0).speed).to.equal('2 MB/s')
			expect(timedTransfers.get(1).speed).to.equal('2 KB/s')
			expect(timedTransfers.get(2).speed).to.equal('10 B/s')
		})
	})
	describe('searchFiles', () => {
		it('parses a file tree and returns expected search results', () => {
			const files = List([
				{ hyperspacepath: 'test/test1/testfile' },
				{ hyperspacepath: 'test/test1/testaaa' },
				{ hyperspacepath: 'test/test2/testfile2' },
				{ hyperspacepath: 'test/test3/testfile3' },
				{ hyperspacepath: 'test2/asdf.mov' },
				{ hyperspacepath: 'test/testuifolder', hyperspaceAppFolder: true},
			])

			expect(searchFiles(files, '', 'test/testuifolder').size).to.equal(0)
			expect(searchFiles(files, 'testuifolder', 'test/testuifolder/').size).to.equal(0)

			expect(searchFiles(files, 'test1', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test1', 'test/').get(0).type).to.equal('directory')
			expect(searchFiles(files, 'test1', 'test/').get(0).name).to.equal('test1')

			expect(searchFiles(files, 'test2', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test2', 'test/').get(0).name).to.equal('test2')
			expect(searchFiles(files, 'test2', 'test/').get(0).type).to.equal('directory')

			expect(searchFiles(files, 'test3', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test3', 'test/').get(0).type).to.equal('directory')

			expect(searchFiles(files, 'testfile', 'test/').size).to.equal(3)
			expect(searchFiles(files, 'testfile', 'test/').get(0).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(0).name).to.equal('testfile')
			expect(searchFiles(files, 'testfile', 'test/').get(1).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(1).name).to.equal('testfile2')
			expect(searchFiles(files, 'testfile', 'test/').get(2).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(2).name).to.equal('testfile3')

			expect(searchFiles(files, 'testuifolder', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'testuifolder', 'test/').get(0).type).to.equal('directory')
			expect(searchFiles(files, 'testuifolder', 'test/').get(0).name).to.equal('testuifolder')
		})
	})
})
