deps: node_modules package.json
	npm install

test: deps
	node_modules/.bin/regis

.PHONY: test