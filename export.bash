#!/bin/bash

includeRecurse=(assets css html js manifest.json config.js)
mkdir aspys
for i in ${includeRecurse[@]} ; do
	cp -r $i aspys
done

zip ../aspys.zip -r aspys

rm -rf ./aspys
