import os
from flask import Flask, url_for, render_template, request, redirect, jsonify
from werkzeug.utils import secure_filename
from flask_jsglue import JSGlue
import smtplib
from email.mime.text import MIMEText
import json
import httplib2
import urllib
import requests


app = Flask(__name__)
jsglue = JSGlue(app)

# emailLogin.json is ignored by git.
# DO NOT ALLOW SENSITIVE INFO TO BE VISIBLE ON GITHUB!!!
base_dir = os.path.dirname(__file__)
emailLogin = json.loads(open(os.path.join(base_dir, 'emailLogin.json'), 'r').read())
EMAIL_ADDRESS = emailLogin['username']
EMAIL_PASS = emailLogin['password']

VERIF_EMAIL_MESSAGE = "Thanks for contacting me! I'll get back with you ASAP!\n \n Jake Gornall\n Full Stack Web Developer\n 740.438.7924\n jakegornall@yahoo.com"


@app.route('/')
def main():
	'''Renders main site'''
	return render_template('index.html')


@app.route('/home')
def home():
	return render_template('home.html')

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


##############################
## Neighborhood Map Project ##
##############################
def getYelpAccessToken():
    '''Retrieves access token from Yelp and returns the response'''
    yelpSecrets = json.loads(open(os.path.join(base_dir, 'yelpSecrets.json'), 'r').read())['yelp']
    url = 'https://api.yelp.com/oauth2/token'
    body = urllib.urlencode(yelpSecrets)

    h = httplib2.Http()
    response = h.request(url, method='POST', body=body)[1]
    return json.loads(response)


@app.route('/MapProject', methods=["GET"])
def MapProject():
    return render_template('MapProject.html')


@app.route('/MapProject/yelpCallAPI', methods=['GET'])
def yelpCallAPI():
    try:
    	YelpResponseObject = getYelpAccessToken()
    except:
        return jsonify(status='false', message='Unable to get access token...')

    try:
        name = request.args.get('name')
        address = request.args.get('address')
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
    except:
        return jsonify(
            status='false',
            message='Error unpacking client data...')

    url = 'https://api.yelp.com/v3/businesses/search?term={name}&location={address}&latitude={latitude}&longitude={longitude}&limit=1'  # noqa
    url = url.format(
        name=name,
        address=address,
        latitude=latitude,
        longitude=longitude)

    try:
        response = requests.get(
            url,
            headers={'Authorization': 'bearer %s' % YelpResponseObject['access_token']}  # noqa
            )
    except:
        return jsonify(
            status='false',
            message='Error requesting data from Yelp...')

    return jsonify(status='true', content=json.loads(response.text))


if __name__ == '__main__':
	app.run(debug=True, host='127.0.0.1', port=5000)