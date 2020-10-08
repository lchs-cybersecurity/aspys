#!/bin/bash

if !command -v javascript-obfuscator &> /dev/null
then 
	npm install -g javascript-obfuscator
fi

includeRecurse=(assets css html js manifest.json config.js)
mkdir aspys
for i in ${includeRecurse[@]} ; do
	cp -r $i aspys
done

cd aspys/js
for i in $(ls | grep -e '.*.js') ; do
	javascript-obfuscator $i -o $i
	echo Obfuscated $i
done
cd ../..

zip ../aspys.zip -r aspys

rm -rf ./aspys
