#!/bin/bash

# error output terminates this script
set -e

# This script creates a Hyperspace.app release for all 3 platforms: osx (darwin),
# linux, and windows. It takes 5 arguments, the first two arguments are the
# private and public key used to sign the release archives. The last three
# arguments are semver strings, the first of which being the ui version, second
# being the Hyperspace version, and third being the electron version.

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 privatekey publickey uiversion hsdversion electronversion"
	exit 1
fi

## ensure we have a clean node_modules
rm -rf ./node_modules
npm install

# build the UI's js
rm -rf ./dist
npm run build-main

uiVersion=${3:-v0.0.1}
hyperspaceVersion=${4:-v0.0.1}
electronVersion=${5:-v2.0.2}

# fourth argument is the public key file path.
if [ "$(uname -s)" = 'Linux' ]; then
	keyFile=`readlink -f $1`
	pubkeyFile=`readlink -f $2`
else
	keyFile=`perl -e 'use Cwd "abs_path";print abs_path(shift)' $1`
	pubkeyFile=`perl -e 'use Cwd "abs_path";print abs_path(shift)' $2`
fi

electronOSX="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-win32-x64.zip"

hyperspaceOSX="/Users/mark/.go/src/github.com/HyperspaceApp/Hyperspace/release/Hyperspace-${hyperspaceVersion}-darwin-amd64.zip"
hyperspaceLinux="/Users/mark/.go/src/github.com/HyperspaceApp/Hyperspace/release/Hyperspace-${hyperspaceVersion}-linux-amd64.zip"
hyperspaceWindows="/Users/mark/.go/src/github.com/HyperspaceApp/Hyperspace/release/Hyperspace-${hyperspaceVersion}-windows-amd64.zip"

rm -rf release/
mkdir -p release/{osx,linux,win32}

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/{plugins,assets,css,dist,index.html,package.json,js} $dest
}

buildOSX() {
	cd release/osx
	wget $electronOSX
	unzip ./electron*
	mv Electron.app Hyperspace.app
	mv Hyperspace.app/Contents/MacOS/Electron Hyperspace.app/Contents/MacOS/Hyperspace
	# NOTE: this only works with GNU sed, other platforms (like OSX) may fail here
	sed -i 's/>Electron</>Hyperspace</' Hyperspace.app/Contents/Info.plist
	sed -i 's/>'"${electronVersion:1}"'</>'"${hyperspaceVersion:1}"'</' Hyperspace.app/Contents/Info.plist
	sed -i 's/>com.github.electron\</>com.hyperspace.hyperspaceapp</' Hyperspace.app/Contents/Info.plist
	sed -i 's/>electron.icns</>icon.icns</' Hyperspace.app/Contents/Info.plist
	cp ../../assets/icon.icns Hyperspace.app/Contents/Resources/
	rm -r Hyperspace.app/Contents/Resources/default_app.asar
	mkdir Hyperspace.app/Contents/Resources/app
	(
		cd Hyperspace.app/Contents/Resources/app
		cp $hyperspaceOSX .
		unzip ./Hyperspace-*
		rm ./Hyperspace*.zip
		mv ./Hyperspace-* ./Hyperspace
	)
	package "../../" "Hyperspace.app/Contents/Resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildLinux() {
	cd release/linux
	wget $electronLinux
	unzip ./electron*
	mv electron Hyperspace
	rm -r resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $hyperspaceLinux .
		unzip ./Hyperspace-*
		rm ./Hyperspace*.zip
		mv ./Hyperspace-* ./Hyperspace
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildWindows() {
	cd release/win32
	wget $electronWindows
	unzip ./electron*
	mv electron.exe Hyperspace.exe
	wget https://github.com/electron/rcedit/releases/download/v0.1.0/rcedit.exe
	wine rcedit.exe Hyperspace.exe --set-icon '../../assets/icon.ico'
	rm -f rcedit.exe
	rm resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $hyperspaceWindows .
		unzip ./Hyperspace-*
		rm ./Hyperspace*.zip
		mv ./Hyperspace-* ./Hyperspace
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make signed zip archives for each release
for os in win32 linux osx; do 
	(
		cd release/${os}
		zip -r ../Hyperspace-${uiVersion}-${os}-x64.zip .
		cd ..
		openssl dgst -sha256 -sign $keyFile -out Hyperspace-${uiVersion}-${os}-x64.zip.sig Hyperspace-${uiVersion}-${os}-x64.zip
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature Hyperspace-${uiVersion}-${os}-x64.zip.sig Hyperspace-${uiVersion}-${os}-x64.zip
		fi
		rm -rf release/${os}
	)
done

