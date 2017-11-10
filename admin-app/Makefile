flight-launch-admin.html: flight-launch-admin.html.erb *.js
	ruby -rerb -rjson -e \
		"puts ERB.new(File.read('flight-launch-admin.html.erb')).result" \
		> flight-launch-admin.html

install: flight-launch-admin.html
	mkdir -p ../server/public/__admin__
	cp flight-launch-admin.html ../server/public/__admin__/tenants.html
