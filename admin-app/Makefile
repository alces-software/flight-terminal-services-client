flight-launch-admin.html: flight-launch-admin.html.erb *.js
	ruby -rerb -rjson -e \
		"puts ERB.new(File.read('flight-launch-admin.html.erb')).result" \
		> flight-launch-admin.html

install:
	cp flight-launch-admin.html ../server/public/admin.html
