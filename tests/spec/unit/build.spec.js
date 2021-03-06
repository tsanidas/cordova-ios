/**
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var path = require('path');
var rewire = require('rewire');
var build = rewire('../../../bin/templates/scripts/cordova/lib/build');

describe('build', function () {
    var testProjectPath = path.join('/test', 'project', 'path');

    describe('getXcodeBuildArgs method', function () {

        var getXcodeBuildArgs = build.__get__('getXcodeBuildArgs');
        build.__set__('__dirname', path.join('/test', 'dir'));

        it('should generate appropriate args if a single buildFlag is passed in', function (done) {
            var isDevice = true;
            var buildFlags = '-xcconfig TestXcconfigFlag';

            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, buildFlags);
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual('TestXcconfigFlag');
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-destination');
            expect(args[9]).toEqual('generic/platform=iOS');
            expect(args[10]).toEqual('-archivePath');
            expect(args[11]).toEqual('TestProjectName.xcarchive');
            expect(args[12]).toEqual('archive');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'device'));
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args.length).toEqual(15);
            done();
        });

        it('should generate appropriate args if buildFlags are passed in', function (done) {
            var isDevice = true;
            var buildFlags = [
                '-xcconfig TestXcconfigFlag',
                '-workspace TestWorkspaceFlag',
                '-scheme TestSchemeFlag',
                '-configuration TestConfigurationFlag',
                '-destination TestDestinationFlag',
                '-archivePath TestArchivePathFlag',
                'CONFIGURATION_BUILD_DIR=TestConfigBuildDirFlag',
                'SHARED_PRECOMPS_DIR=TestSharedPrecompsDirFlag'
            ];

            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, buildFlags);
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual('TestXcconfigFlag');
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestWorkspaceFlag');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestSchemeFlag');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfigurationFlag');
            expect(args[8]).toEqual('-destination');
            expect(args[9]).toEqual('TestDestinationFlag');
            expect(args[10]).toEqual('-archivePath');
            expect(args[11]).toEqual('TestArchivePathFlag');
            expect(args[12]).toEqual('archive');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=TestConfigBuildDirFlag');
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=TestSharedPrecompsDirFlag');
            expect(args.length).toEqual(15);
            done();
        });

        it('should generate appropriate args for device', function (done) {
            var isDevice = true;
            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, null);
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual(path.join('/test', 'build-testconfiguration.xcconfig'));
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-destination');
            expect(args[9]).toEqual('generic/platform=iOS');
            expect(args[10]).toEqual('-archivePath');
            expect(args[11]).toEqual('TestProjectName.xcarchive');
            expect(args[12]).toEqual('archive');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'device'));
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args.length).toEqual(15);
            done();
        });

        it('should generate appropriate args for simulator', function (done) {
            var isDevice = false;
            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, null, 'iPhone 5s');
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual(path.join('/test', 'build-testconfiguration.xcconfig'));
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-sdk');
            expect(args[9]).toEqual('iphonesimulator');
            expect(args[10]).toEqual('-destination');
            expect(args[11]).toEqual('platform=iOS Simulator,name=iPhone 5s');
            expect(args[12]).toEqual('build');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'emulator'));
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args.length).toEqual(15);
            done();
        });

        it('should add matched flags that are not overriding for device', function (done) {
            var isDevice = true;
            var buildFlags = '-sdk TestSdkFlag';

            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, buildFlags);
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual(path.join('/test', 'build-testconfiguration.xcconfig'));
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-destination');
            expect(args[9]).toEqual('generic/platform=iOS');
            expect(args[10]).toEqual('-archivePath');
            expect(args[11]).toEqual('TestProjectName.xcarchive');
            expect(args[12]).toEqual('archive');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'device'));
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args[15]).toEqual('-sdk');
            expect(args[16]).toEqual('TestSdkFlag');
            expect(args.length).toEqual(17);
            done();
        });

        it('should add matched flags that are not overriding for simulator', function (done) {
            var isDevice = false;
            var buildFlags = '-archivePath TestArchivePathFlag';

            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, buildFlags, 'iPhone 5s');
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual(path.join('/test', 'build-testconfiguration.xcconfig'));
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-sdk');
            expect(args[9]).toEqual('iphonesimulator');
            expect(args[10]).toEqual('-destination');
            expect(args[11]).toEqual('platform=iOS Simulator,name=iPhone 5s');
            expect(args[12]).toEqual('build');
            expect(args[13]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'emulator'));
            expect(args[14]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args[15]).toEqual('-archivePath');
            expect(args[16]).toEqual('TestArchivePathFlag');
            expect(args.length).toEqual(17);
            done();
        });

        it('should generate appropriate args for automatic provisioning', function (done) {
            var isDevice = true;
            var args = getXcodeBuildArgs('TestProjectName', testProjectPath, 'TestConfiguration', isDevice, null, null, true);
            expect(args[0]).toEqual('-xcconfig');
            expect(args[1]).toEqual(path.join('/test', 'build-testconfiguration.xcconfig'));
            expect(args[2]).toEqual('-workspace');
            expect(args[3]).toEqual('TestProjectName.xcworkspace');
            expect(args[4]).toEqual('-scheme');
            expect(args[5]).toEqual('TestProjectName');
            expect(args[6]).toEqual('-configuration');
            expect(args[7]).toEqual('TestConfiguration');
            expect(args[8]).toEqual('-destination');
            expect(args[9]).toEqual('generic/platform=iOS');
            expect(args[10]).toEqual('-archivePath');
            expect(args[11]).toEqual('TestProjectName.xcarchive');
            expect(args[12]).toEqual('-allowProvisioningUpdates');
            expect(args[13]).toEqual('archive');
            expect(args[14]).toEqual('CONFIGURATION_BUILD_DIR=' + path.join(testProjectPath, 'build', 'device'));
            expect(args[15]).toEqual('SHARED_PRECOMPS_DIR=' + path.join(testProjectPath, 'build', 'sharedpch'));
            expect(args.length).toEqual(16);
            done();
        });
    });

    describe('getXcodeArchiveArgs method', function () {

        var getXcodeArchiveArgs = build.__get__('getXcodeArchiveArgs');

        it('should generate the appropriate arguments', function (done) {
            var archiveArgs = getXcodeArchiveArgs('TestProjectName', testProjectPath, '/test/output/path', '/test/export/options/path');
            expect(archiveArgs[0]).toEqual('-exportArchive');
            expect(archiveArgs[1]).toEqual('-archivePath');
            expect(archiveArgs[2]).toEqual('TestProjectName.xcarchive');
            expect(archiveArgs[3]).toEqual('-exportOptionsPlist');
            expect(archiveArgs[4]).toEqual('/test/export/options/path');
            expect(archiveArgs[5]).toEqual('-exportPath');
            expect(archiveArgs[6]).toEqual('/test/output/path');
            expect(archiveArgs.length).toEqual(7);
            done();
        });

        it('should generate the appropriate arguments for automatic provisioning', function (done) {
            var archiveArgs = getXcodeArchiveArgs('TestProjectName', testProjectPath, '/test/output/path', '/test/export/options/path', true);
            expect(archiveArgs[0]).toEqual('-exportArchive');
            expect(archiveArgs[1]).toEqual('-archivePath');
            expect(archiveArgs[2]).toEqual('TestProjectName.xcarchive');
            expect(archiveArgs[3]).toEqual('-exportOptionsPlist');
            expect(archiveArgs[4]).toEqual('/test/export/options/path');
            expect(archiveArgs[5]).toEqual('-exportPath');
            expect(archiveArgs[6]).toEqual('/test/output/path');
            expect(archiveArgs[7]).toEqual('-allowProvisioningUpdates');
            expect(archiveArgs.length).toEqual(8);
            done();
        });
    });

    describe('parseBuildFlag method', function () {

        var parseBuildFlag = build.__get__('parseBuildFlag');

        it('should detect an xcconfig change', function (done) {
            var buildFlag = '-xcconfig /path/to/config';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.xcconfig).toEqual('/path/to/config');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a workspace change', function (done) {
            var buildFlag = '-workspace MyTestWorkspace';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.workspace).toEqual('MyTestWorkspace');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a scheme change', function (done) {
            var buildFlag = '-scheme MyTestScheme';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.scheme).toEqual('MyTestScheme');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a configuration change', function (done) {
            var buildFlag = '-configuration MyTestConfiguration';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.configuration).toEqual('MyTestConfiguration');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect an sdk change', function (done) {
            var buildFlag = '-sdk NotARealSDK';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.sdk).toEqual('NotARealSDK');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a destination change', function (done) {
            var buildFlag = '-destination MyTestDestination';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.destination).toEqual('MyTestDestination');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect an archivePath change', function (done) {
            var buildFlag = '-archivePath MyTestArchivePath';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.archivePath).toEqual('MyTestArchivePath');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a configuration_build_dir change', function (done) {
            var buildFlag = 'CONFIGURATION_BUILD_DIR=/path/to/fake/config/build/dir';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.configuration_build_dir).toEqual('CONFIGURATION_BUILD_DIR=/path/to/fake/config/build/dir');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should detect a shared_precomps_dir change', function (done) {
            var buildFlag = 'SHARED_PRECOMPS_DIR=/path/to/fake/shared/precomps/dir';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.shared_precomps_dir).toEqual('SHARED_PRECOMPS_DIR=/path/to/fake/shared/precomps/dir');
            expect(args.otherFlags.length).toEqual(0);
            done();
        });
        it('should parse arbitrary build settings', function (done) {
            var buildFlag = 'MY_ARBITRARY_BUILD_SETTING=ValueOfArbitraryBuildSetting';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.otherFlags[0]).toEqual('MY_ARBITRARY_BUILD_SETTING=ValueOfArbitraryBuildSetting');
            expect(args.otherFlags.length).toEqual(1);
            done();
        });
        it('should parse userdefaults', function (done) {
            var buildFlag = '-myuserdefault=TestUserDefaultValue';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.otherFlags[0]).toEqual('-myuserdefault=TestUserDefaultValue');
            expect(args.otherFlags.length).toEqual(1);
            done();
        });
        it('should parse settings with a space', function (done) {
            var buildFlag = '-anotherxcodebuildsetting withASpace';
            var args = { 'otherFlags': [] };
            parseBuildFlag(buildFlag, args);
            expect(args.otherFlags[0]).toEqual('-anotherxcodebuildsetting');
            expect(args.otherFlags[1]).toEqual('withASpace');
            expect(args.otherFlags.length).toEqual(2);
            done();
        });
    });

    describe('help method', () => {
        it('should log a bunch of options', () => {
            const logSpy = jasmine.createSpy();
            const procStub = { exit: _ => null, cwd: _ => '', argv: ['', ''] };
            build.__set__({ console: { log: logSpy }, process: procStub });

            build.help();
            expect(logSpy).toHaveBeenCalledWith(jasmine.stringMatching(/^Usage:/));
        });
    });

    describe('run method', () => {
        let rejectSpy;

        beforeEach(() => {
            rejectSpy = jasmine.createSpy('reject');

            build.__set__('Q', {
                reject: rejectSpy
            });
        });

        it('should not accept debug and release options together', () => {
            build.run({
                debug: true,
                release: true
            });

            expect(rejectSpy).toHaveBeenCalledWith('Cannot specify "debug" and "release" options together.');
        });

        it('should not accept device and emulator options together', () => {
            build.run({
                device: true,
                emulator: true
            });

            expect(rejectSpy).toHaveBeenCalledWith('Cannot specify "device" and "emulator" options together.');
        });

        it('should reject when build config file missing', () => {
            const existsSyncSpy = jasmine.createSpy('existsSync').and.returnValue(false);
            build.__set__('fs', {
                existsSync: existsSyncSpy
            });

            build.run({
                buildConfig: './some/config/path'
            });

            expect(rejectSpy).toHaveBeenCalledWith(jasmine.stringMatching(/^Build config file does not exist:/));
        });
    });

    describe('getDefaultSimulatorTarget method', () => {
        it('should find iPhone X as the default simulator target.', (done) => {
            const mockedEmulators = [{
                name: 'iPhone 7',
                identifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-7',
                simIdentifier: 'iPhone-7'
            },
            {
                name: 'iPhone 8',
                identifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-8',
                simIdentifier: 'iPhone-8'
            },
            {
                name: 'iPhone X',
                identifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-X',
                simIdentifier: 'iPhone-X'
            }];

            // This method will require a module that supports the run method.
            build.__set__('require', () => {
                return {
                    run: () => {
                        return new Promise((resolve, reject) => {
                            resolve(mockedEmulators);
                        });
                    }
                };
            });

            const getDefaultSimulatorTarget = build.__get__('getDefaultSimulatorTarget');
            const exec = getDefaultSimulatorTarget();

            const expected = {
                name: 'iPhone X',
                identifier: 'com.apple.CoreSimulator.SimDeviceType.iPhone-X',
                simIdentifier: 'iPhone-X'
            };

            exec.then((actual) => {
                expect(actual).toEqual(expected);
                done();
            });
        });
    });

    describe('findXCodeProjectIn method', () => {
        let findXCodeProjectIn;
        let shellLsSpy;
        let rejectSpy;
        let resolveSpy;
        let emitSpy;
        const fakePath = '/path/foobar';

        beforeEach(() => {
            findXCodeProjectIn = build.__get__('findXCodeProjectIn');

            // Shell Spy
            shellLsSpy = jasmine.createSpy('shellLsSpy');
            build.__set__('shell', {
                ls: shellLsSpy
            });

            // Q Spy
            rejectSpy = jasmine.createSpy('rejectSpy');
            resolveSpy = jasmine.createSpy('resolveSpy');
            build.__set__('Q', {
                reject: rejectSpy,
                resolve: resolveSpy
            });

            // Events spy
            emitSpy = jasmine.createSpy('emitSpy');
            build.__set__('events', {
                emit: emitSpy
            });
        });

        it('should find not find Xcode project', () => {
            shellLsSpy.and.returnValue(['README.md']);

            findXCodeProjectIn(fakePath);

            expect(rejectSpy).toHaveBeenCalledWith('No Xcode project found in ' + fakePath);
        });

        it('should emit finding multiple Xcode projects', () => {
            shellLsSpy.and.returnValue(['Test1.xcodeproj', 'Test2.xcodeproj']);

            findXCodeProjectIn(fakePath);

            // Emit
            let actualEmit = emitSpy.calls.argsFor(0)[1];
            expect(emitSpy).toHaveBeenCalled();
            expect(actualEmit).toContain('Found multiple .xcodeproj directories in');

            // Resolve
            let actualResolve = resolveSpy.calls.argsFor(0)[0];
            expect(resolveSpy).toHaveBeenCalled();
            expect(actualResolve).toContain('Test1');
        });

        it('should detect and return only one projects', () => {
            shellLsSpy.and.returnValue(['Test1.xcodeproj']);

            findXCodeProjectIn(fakePath);

            // Emit
            expect(emitSpy).not.toHaveBeenCalled();

            // Resolve
            let actualResolve = resolveSpy.calls.argsFor(0)[0];
            expect(resolveSpy).toHaveBeenCalled();
            expect(actualResolve).toContain('Test1');
        });
    });
});
