#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import Flask
from flask import jsonify
from flask import request
import json
#import pymongo
#from pymongo import MongoClient


app = Flask(__name__, static_folder='www')

@app.route('/<path:path>')
def static_file(path):
    print(request.host)
    try:
        return app.send_static_file(path)
    except:
        return "Error"


@app.route('/')
def root():
    print(request.host)
    return app.send_static_file('index.html')

app.run(host='127.0.0.1', port=8030, debug=True, use_reloader=False)
