import os
from flask import Flask, url_for, render_template, request, redirect, jsonify
from werkzeug.utils import secure_filename
from flask_jsglue import JSGlue


app = Flask(__name__)
jsglue = JSGlue(app)


@app.route('/')
def main():
	return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
	try:
		data = request.json
	except:
		return jsonify(status='false', message='Error unpacking json...')

	try:
		name = data.full_name
		email = data.email
		message = data.message
	except:
		return jsonify(status='false', message='Invalid form params...')

	return jsonify(status='true', message='Thank You!')



if __name__ == '__main__':
	app.run(debug=True, host='127.0.0.1', port=5000)