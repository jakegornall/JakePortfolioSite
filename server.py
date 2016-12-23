import os
from flask import Flask, url_for, render_template, request, redirect
from werkzeug.utils import secure_filename
from flask_jsglue import JSGlue


app = Flask(__name__)
jsglue = JSGlue(app)


@app.route('/')
def main():
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True, host='127.0.0.1', port=5000)