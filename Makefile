.PHONY: public/bundle.js

public/bundle.js:
	watchify client.js  -o public/bundle.js -v
