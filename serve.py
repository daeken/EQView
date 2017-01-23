import json, os
from flask import Flask, send_from_directory
app = Flask(__name__)
app.debug = True

@app.route('/<path:path>')
def root(path):
	print 'foo', path
	if path == 'eqfiles.json':
		return json.dumps(os.listdir(eqpath))
	elif path.startswith('eq/'):
		return send_from_directory(eqpath, path[3:])
	return send_from_directory('static', path)

@app.route('/')
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
