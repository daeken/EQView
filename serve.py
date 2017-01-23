import json, os, os.path
from flask import Flask, send_from_directory, make_response
from functools import wraps, update_wrapper
from datetime import datetime
app = Flask(__name__)
app.debug = True


def nocache(view):
	@wraps(view)
	def no_cache(*args, **kwargs):
		response = make_response(view(*args, **kwargs))
		response.headers['Last-Modified'] = datetime.now()
		response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
		response.headers['Pragma'] = 'no-cache'
		response.headers['Expires'] = '-1'
		return response

	return update_wrapper(no_cache, view)

@app.route('/<path:path>')
@nocache
def root(path):
	if path == 'eqfiles.json':
		return json.dumps([fn for fn in os.listdir(eqpath) if os.path.isfile(eqpath + '/' + fn)])
	elif path.startswith('eq/'):
		return send_from_directory(eqpath, path[3:])
	return send_from_directory('static', path)

@app.route('/')
@nocache
def index():
	return send_from_directory('static', 'index.html')

if __name__ == '__main__':
	import sys
	if len(sys.argv) > 1:
		eqpath = sys.argv[1]
		app.run()
	else:
		print >>sys.stderr, 'ERROR: EQ path not provided'
		print >>sys.stderr, 'Usage: python serve.py <path-to-everquest-install>'
