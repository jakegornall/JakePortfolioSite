import os
from flask import Flask, url_for, render_template, request, redirect, jsonify
from werkzeug.utils import secure_filename
from flask_jsglue import JSGlue
import smtplib
from email.mime.text import MIMEText
import json


app = Flask(__name__)
jsglue = JSGlue(app)

# emailLogin.json is ignored by git.
# DO NOT ALLOW SENSITIVE INFO TO BE VISIBLE ON GITHUB!!!
emailLogin = json.loads(open('emailLogin.json', 'r').read())
EMAIL_ADDRESS = emailLogin['username']
EMAIL_PASS = emailLogin['password']

VERIF_EMAIL_MESSAGE = "Thanks for contacting me! I'll get back with you ASAP!\n \n Jake Gornall\n Full Stack Web Developer\n 740.438.7924\n jakegornall@yahoo.com"


@app.route('/')
def main():
	'''Renders main site'''
	return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
	'''Recieves contact form data and emails it to Jake's yahoo account.'''
	try:
		# retrieves form data from json object.
		data = request.json
	except:
		return jsonify(status='false', message='Error unpacking json...')

	try:
		# unpacks contact form data into variables.
		name = data.get("full_name")
		email = data.get("email")
		message = data.get("message")
	except:
		return jsonify(status='false', message='Invalid form params...')

	try:
		# prepairs email message via MIMEText.
		msg = MIMEText(message)
		msg['Subject'] = '%s contacted you via your portfolio!' % name
		msg['From'] = email
		msg['To'] = EMAIL_ADDRESS
	except:
		return jsonify(status='false', message='Error preparing message...')

	try:
		# sends email via Jake's yahoo account.
		s = smtplib.SMTP('smtp.mail.yahoo.com', 587)
		s.starttls()
		s.ehlo()
		s.login(EMAIL_ADDRESS, EMAIL_PASS)
		s.sendmail(msg['From'], EMAIL_ADDRESS, msg.as_string())
		s.quit()
	except:
		return jsonify(status='false', message='Error sending message...')

	try:
		vMsg = MIMEText(VERIF_EMAIL_MESSAGE)
		vMsg['Subject'] = "I got your message!"
		vMsg['From'] = EMAIL_ADDRESS
		vMsg['To'] = email
	except:
		return jsonify(status='false', message='Error preparing verification message...')

	try:
		# sends email via Jake's yahoo account.
		s = smtplib.SMTP('smtp.mail.yahoo.com', 587)
		s.starttls()
		s.ehlo()
		s.login(EMAIL_ADDRESS, EMAIL_PASS)
		s.sendmail(vMsg['From'], email, vMsg.as_string())
		s.quit()
	except:
		return jsonify(status='false', message='Error sending verification message...')

	return jsonify(status='true', message='Thank You!')



if __name__ == '__main__':
	app.run(debug=True, host='127.0.0.1', port=5000)